/**
 * Comprehensive Automated Algorithmic & Logic Test Suite
 * Validates:
 * 1. Heuristic Skill-Matching Engine
 * 2. Jaccard Duplicate Question Detection
 * 3. AI Skill Gap & 4-Phase Learning Path Recommendation
 * 4. Gamification XP, Streak, and Badge Engine
 */

import {
  computeCompatibility,
  getSkillOverlap,
  getComplementarySkills,
  experienceScore,
  availabilityScore,
  buildMatchExplanation,
} from "../src/utils/matchingAlgorithm";

import {
  tokenize,
  computeJaccardSimilarity,
  findSimilarQuestions,
} from "../src/utils/duplicateDetector";

import {
  analyzeSkillGap,
  ROLE_SKILL_MAP,
} from "../src/utils/aiService";

import {
  calculateLevel,
  checkBadges,
  calculateUpdatedStreak,
  LEVEL_THRESHOLDS,
} from "../src/utils/userStats";

import { INITIAL_QUESTIONS, INITIAL_USERS, INITIAL_PROJECTS } from "../src/services/mockData";

export function runAllTests(): { passed: number; failed: number; results: Array<{ name: string; status: "PASS" | "FAIL"; message?: string }> } {
  const results: Array<{ name: string; status: "PASS" | "FAIL"; message?: string }> = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorMsg?: string) {
    if (condition) {
      passed++;
      results.push({ name: testName, status: "PASS" });
    } else {
      failed++;
      results.push({ name: testName, status: "FAIL", message: errorMsg || "Assertion failed" });
      console.error(`❌ [FAIL] ${testName}: ${errorMsg}`);
    }
  }

  console.log("==================================================");
  console.log("🧪 RUNNING CAMPUSLINK MOBILE AUTOMATED TEST SUITE");
  console.log("==================================================\n");

  // ─── 1. SKILL MATCHING ALGORITHM TESTS ──────────────────────────
  console.log("--- Test Group 1: Heuristic Skill-Matching Algorithm ---");

  const testUser = {
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    interests: ["Distributed Systems", "Web Performance"],
    experience: "Advanced" as const,
    availability: "Weekends" as const,
  };

  const testProject = {
    skillsRequired: ["React", "TypeScript", "GraphQL", "Docker"],
    interests: ["Web Performance"],
    experience: "Intermediate" as const,
    availability: "Weekends" as const,
  };

  const overlap = getSkillOverlap(testUser.skills, testProject.skillsRequired);
  assert(overlap.length === 2 && overlap.includes("React") && overlap.includes("TypeScript"), "getSkillOverlap identifies shared core skills");

  const complementary = getComplementarySkills(testUser.skills, testProject.skillsRequired);
  assert(complementary.length === 2 && complementary.includes("GraphQL") && complementary.includes("Docker"), "getComplementarySkills identifies target skill gaps");

  const score = computeCompatibility(testUser, testProject);
  assert(score >= 60 && score <= 100, `computeCompatibility returns expected score (${score}%) for overlapping profile`);

  const explanation = buildMatchExplanation(testUser, testProject);
  assert(explanation.length > 20 && explanation.includes("%"), "buildMatchExplanation produces clear text justification");

  // ─── 2. JACCARD TOKEN SIMILARITY DUPLICATE DETECTOR ─────────────
  console.log("\n--- Test Group 2: Jaccard Duplicate Question Detection ---");

  const rawTitle = "How to optimize Raft consensus heartbeats in mesh networks?";
  const tokens = tokenize(rawTitle);
  assert(tokens.includes("optimize") && tokens.includes("raft") && tokens.includes("consensus"), "tokenize extracts meaningful tokens and filters stopwords");
  assert(!tokens.includes("to") && !tokens.includes("in") && !tokens.includes("how"), "tokenize strips English stopwords");

  const similarityExact = computeJaccardSimilarity(rawTitle, rawTitle);
  assert(similarityExact === 1.0, "computeJaccardSimilarity returns 1.0 for identical sentences");

  const similarQuery = "How to optimize raft consensus in mesh networks";
  const similarityHigh = computeJaccardSimilarity(rawTitle, similarQuery);
  assert(similarityHigh >= 0.35, `computeJaccardSimilarity detects high similarity (${similarityHigh.toFixed(2)}) for rephrased query`);

  const duplicates = findSimilarQuestions(similarQuery, INITIAL_QUESTIONS, 0.3);
  assert(duplicates.length > 0, "findSimilarQuestions flags existing questions exceeding threshold");
  assert(duplicates[0].question.id === "q-101", "findSimilarQuestions correctly ranks FloodSense Raft question as top match");

  // ─── 3. AI SKILL GAP & LEARNING PATH ENGINE ─────────────────────
  console.log("\n--- Test Group 3: Rule-Based Skill Gap & Career Roadmap ---");

  const currentSkills = ["Python", "Machine Learning"];
  const gapAnalysis = analyzeSkillGap(currentSkills, "AI/ML Engineer");

  assert(gapAnalysis.role === "AI/ML Engineer", "analyzeSkillGap preserves target career role");
  assert(gapAnalysis.missingSkills.length > 0, "analyzeSkillGap identifies missing competencies (PyTorch, TensorFlow, etc.)");
  assert(gapAnalysis.progress > 0 && gapAnalysis.progress < 100, `analyzeSkillGap calculates partial readiness (${gapAnalysis.progress}%)`);
  assert(gapAnalysis.recommendedPath.length === 4, "analyzeSkillGap generates 4 structured learning phases");

  // ─── 4. GAMIFICATION XP & LEVEL PROGRESSION ──────────────────────
  console.log("\n--- Test Group 4: Gamification, XP & Activity Streaks ---");

  const lvl1 = calculateLevel(50);
  assert(lvl1.level === 1 && lvl1.name === "Novice Academic", "calculateLevel(50) returns Level 1 (Novice Academic)");

  const lvl3 = calculateLevel(450);
  assert(lvl3.level === 3 && lvl3.name === "Scholar", "calculateLevel(450) returns Level 3 (Scholar)");

  const lvl6 = calculateLevel(6000);
  assert(lvl6.level === 6 && lvl6.name === "Academic Fellow", "calculateLevel(6000) returns Level 6 (Academic Fellow)");

  const badges = checkBadges({ contributionScore: 1200, acceptedAnswersCount: 8, currentStreak: 10, role: "faculty", verified: true });
  assert(badges.includes("Top Contributor"), "checkBadges unlocks Top Contributor");
  assert(badges.includes("Solution Architect"), "checkBadges unlocks Solution Architect");
  assert(badges.includes("Weekly Active Scholar"), "checkBadges unlocks Weekly Active Scholar");
  assert(badges.includes("Verified Mentor"), "checkBadges unlocks Verified Mentor for faculty");
  assert(badges.includes("Campus Verified"), "checkBadges unlocks Campus Verified");

  const streakContinuation = calculateUpdatedStreak(new Date().toISOString(), 5);
  assert(streakContinuation.streak === 5 && !streakContinuation.updated, "calculateUpdatedStreak maintains streak when accessed on the same day");

  console.log("\n==================================================");
  console.log(`📊 TEST EXECUTION SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  return { passed, failed, results };
}

export default runAllTests;
