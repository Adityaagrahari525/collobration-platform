/**
 * End-to-End Runtime Integration & User Journey Verification Suite
 * Tests all end-to-end flows:
 * - Auth & session handling
 * - Q&A lifecycle (Post -> Live Duplicate Check -> Answer -> Upvote -> Accept Solution)
 * - Research workspace & Algorithmic compatibility scoring (0-100%)
 * - Project application pitch workflow
 * - Faculty office hours reservation
 * - Consortia membership & Direct messaging
 */

import { dbService } from "../src/services/dbService";
import { computeCompatibility, buildMatchExplanation } from "../src/utils/matchingAlgorithm";
import { findSimilarQuestions } from "../src/utils/duplicateDetector";
import { analyzeSkillGap } from "../src/utils/aiService";
import { calculateLevel, checkBadges, calculateUpdatedStreak } from "../src/utils/userStats";

export async function runIntegrationTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${name}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${name}: ${detail || "Assertion failed"}`);
    }
  }

  console.log("==================================================");
  console.log("🚀 STARTING E2E USER JOURNEY INTEGRATION TESTS");
  console.log("==================================================\n");

  // Step 1: Authentication & Scholar Registration
  console.log("--- Step 1: Scholar Authentication & Verification ---");
  const loginRes = await dbService.login("aditya.sharma@iitd.ac.in", "academicPass123");
  assert(Boolean(loginRes.user && loginRes.user.id), "Scholar login returns verified user object");
  assert(loginRes.user.verified === true, "Scholar profile is verified with campus credentials");
  assert(Boolean(loginRes.user.verificationCode), `Verification code generated: ${loginRes.user.verificationCode}`);

  const facultyRes = await dbService.login("dr.rajesh.varma@iitd.ac.in", "academicPass123");
  assert(facultyRes.user.role === "faculty", "Faculty role correctly assigned for professor credentials");

  // Step 2: Q&A Forum Lifecycle & Jaccard Duplicate Prevention
  console.log("\n--- Step 2: Q&A Forum Lifecycle & Live Duplicate Check ---");
  const existingQuestions = await dbService.getQuestions();
  assert(existingQuestions.length >= 4, `Feed contains ${existingQuestions.length} academic discussions`);

  // Duplicate check
  const duplicateQuery = "How to optimize raft consensus heartbeats in mesh networks";
  const duplicateMatches = findSimilarQuestions(duplicateQuery, existingQuestions, 0.3);
  assert(duplicateMatches.length > 0, "Duplicate detection identifies existing Raft consensus inquiry");

  // Create new unique question
  const createdQuestion = await dbService.createQuestion({
    authorId: loginRes.user.id,
    authorName: loginRes.user.name,
    title: "Benchmarking eBPF XDP packet filtering overhead on ARM64 Cortex-A72",
    description: "We are evaluating XDP driver mode packet drop performance on edge telemetry gateways under 10Gbps SYN flood test conditions.",
    department: "Computer Science & Engineering",
    tags: ["eBPF", "XDP", "ARM64", "Networking"],
    isAnonymous: false,
  });
  assert(Boolean(createdQuestion.id), `New question created with ID: ${createdQuestion.id}`);

  // Upvote question
  const voteRes = await dbService.toggleVoteQuestion(createdQuestion.id);
  assert(voteRes.userVoted === true && voteRes.votes >= 2, "Question upvoted successfully");

  // Submit Answer from Faculty
  const submittedAnswer = await dbService.addAnswer(
    createdQuestion.id,
    facultyRes.user,
    "Ensure your network driver has native XDP support enabled instead of generic fallback mode. Native XDP bypasses `sk_buff` allocation entirely, yielding ~8.4M pps on Cortex-A72."
  );
  assert(Boolean(submittedAnswer.id), "Faculty answer posted successfully to inquiry thread");

  // Author marks answer as accepted solution
  const acceptRes = await dbService.toggleAcceptAnswer(createdQuestion.id, submittedAnswer.id);
  assert(acceptRes === true, "Answer successfully marked as accepted solution");

  const updatedQ = await dbService.getQuestionById(createdQuestion.id);
  assert(updatedQ?.answers.some((a) => a.id === submittedAnswer.id && a.isAccepted), "Question thread reflects accepted solution badge");

  // Step 3: Collaborative Research Workspace & Skill Matching
  console.log("\n--- Step 3: Research Projects & Compatibility Scoring ---");
  const projects = await dbService.getProjects();
  assert(projects.length >= 3, `Discovered ${projects.length} inter-institutional research projects`);

  const floodSenseProj = projects.find((p) => p.id === "proj-826") || projects[0];
  const matchScore = computeCompatibility(loginRes.user, floodSenseProj);
  assert(matchScore >= 35 && matchScore <= 100, `Heuristic skill match score computed: ${matchScore}%`);
  const matchExp = buildMatchExplanation(loginRes.user, floodSenseProj);
  assert(matchExp.length > 20, "Compatibility explanation justification generated");

  // Apply to project
  const application = await dbService.applyToProject(
    floodSenseProj.id,
    loginRes.user,
    "Firmware Engineer",
    "Extensive experience deploying STM32 sub-GHz nodes with raft consensus algorithms.",
    matchScore
  );
  assert(application.status === "Pending" && application.matchScore === matchScore, "Project role application pitch submitted with match score");

  // Step 4: Faculty Mentorship Office Hours
  console.log("\n--- Step 4: Faculty Mentorship Office Hours Booking ---");
  const slots = await dbService.getMentorshipSlots();
  assert(slots.length >= 2, `Available advisory slots: ${slots.length}`);

  const targetSlot = slots[0];
  const initialBooked = targetSlot.bookedCount;
  const booking = await dbService.bookMentorshipSlot(
    targetSlot.id,
    loginRes.user,
    "Discussion on Raft sliding-window batching optimizations."
  );
  assert(booking.status === "Confirmed", "Faculty advisory slot reservation confirmed");
  assert(targetSlot.bookedCount === initialBooked + 1, "Slot capacity correctly incremented");

  // Check notification created
  const notifs = await dbService.getNotifications();
  assert(notifs.some((n) => n.type === "mentorship_confirmed"), "Confirmation notification dispatched to scholar queue");

  // Step 5: Consortia Membership & Direct Messages
  console.log("\n--- Step 5: Consortia Hubs & Direct Messaging ---");
  const communities = await dbService.getCommunities();
  assert(communities.length >= 3, "Research consortia loaded");

  const commId = communities[0].id;
  const initialMembers = communities[0].membersCount;
  const wasJoined = communities[0].joined;
  const joinRes = await dbService.toggleJoinCommunity(commId);
  assert(joinRes === !wasJoined, "Consortia join toggle updated");

  // Direct Peer Chat
  const sentMsg = await dbService.sendMessage(
    loginRes.user.id,
    facultyRes.user.id,
    "Dr. Varma, thank you for accepting my advisory session."
  );
  assert(Boolean(sentMsg.id && sentMsg.text), "Direct peer message sent and persisted");

  const conversationMsgs = await dbService.getMessagesByConversationId(facultyRes.user.id, loginRes.user.id);
  assert(conversationMsgs.some((m) => m.id === sentMsg.id), "Message retrieved in live conversation history");

  console.log("\n==================================================");
  console.log(`🎉 ALL E2E USER JOURNEY TESTS COMPLETED: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  return { passed, failed };
}

export default runIntegrationTests;
