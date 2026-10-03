/**
 * Node.js executable test runner for CampusLink Mobile
 */

const {
  computeCompatibility,
  getSkillOverlap,
  getComplementarySkills,
  buildMatchExplanation,
} = require("../src/utils/matchingAlgorithm");

const {
  tokenize,
  computeJaccardSimilarity,
  findSimilarQuestions,
} = require("../src/utils/duplicateDetector");

const {
  analyzeSkillGap,
  ROLE_SKILL_MAP,
} = require("../src/utils/aiService");

const {
  calculateLevel,
  checkBadges,
  calculateUpdatedStreak,
  LEVEL_THRESHOLDS,
} = require("../src/utils/userStats");

const { INITIAL_QUESTIONS, INITIAL_USERS } = require("../src/services/mockData");

let passed = 0;
let failed = 0;

function assert(condition, name, errorMsg) {
  if (condition) {
    passed++;
    console.log(`  ✓ [PASS] ${name}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${name}: ${errorMsg || "Assertion failed"}`);
  }
}

console.log("==================================================");
console.log("🧪 RUNNING CAMPUSLINK MOBILE VERIFICATION SUITE");
console.log("==================================================\n");

// Group 1
console.log("--- Group 1: Heuristic Skill-Matching Algorithm ---");
const user = { skills: ["React", "TypeScript", "Node.js"], availability: "Weekends", experience: "Advanced" };
const target = { skillsRequired: ["React", "TypeScript", "Docker"], availability: "Weekends", experience: "Intermediate" };
assert(getSkillOverlap(user.skills, target.skillsRequired).length === 2, "getSkillOverlap identifies shared skills");
assert(getComplementarySkills(user.skills, target.skillsRequired).includes("Docker"), "getComplementarySkills finds target gap");
const score = computeCompatibility(user, target);
assert(score >= 60 && score <= 100, `computeCompatibility returns valid score: ${score}%`);
assert(buildMatchExplanation(user, target).length > 10, "buildMatchExplanation produces justification");

// Group 2
console.log("\n--- Group 2: Jaccard Duplicate Question Detection ---");
const titleA = "How to optimize Raft consensus heartbeats in mesh networks?";
const titleB = "Optimizing raft consensus latency over mesh nodes";
const tokens = tokenize(titleA);
assert(tokens.includes("raft") && tokens.includes("consensus"), "tokenize filters stop words");
const sim = computeJaccardSimilarity(titleA, titleB);
assert(sim >= 0.4, `computeJaccardSimilarity detects high similarity: ${(sim * 100).toFixed(1)}%`);
const matches = findSimilarQuestions(titleB, INITIAL_QUESTIONS, 0.3);
assert(matches.length > 0 && matches[0].question.id === "q-101", "findSimilarQuestions identifies similar existing questions");

// Group 3
console.log("\n--- Group 3: Rule-Based Skill Gap & Learning Pathway ---");
const analysis = analyzeSkillGap(["Python", "Machine Learning"], "AI/ML Engineer");
assert(analysis.role === "AI/ML Engineer", "analyzeSkillGap matches target role");
assert(analysis.missingSkills.length > 0, "analyzeSkillGap identifies missing competencies");
assert(analysis.recommendedPath.length === 4, "analyzeSkillGap produces 4-Phase Pathway");

// Group 4
console.log("\n--- Group 4: Gamification XP & Level Progression ---");
assert(calculateLevel(50).level === 1, "calculateLevel(50) = Level 1 (Novice Academic)");
assert(calculateLevel(450).level === 3, "calculateLevel(450) = Level 3 (Scholar)");
assert(calculateLevel(6000).level === 6, "calculateLevel(6000) = Level 6 (Academic Fellow)");
const badges = checkBadges({ contributionScore: 1500, acceptedAnswersCount: 6, currentStreak: 10, role: "faculty", verified: true });
assert(badges.includes("Top Contributor") && badges.includes("Verified Mentor"), "checkBadges unlocks expected badges");

console.log("\n==================================================");
console.log(`📊 FINAL RESULT: ${passed} PASSED | ${failed} FAILED`);
console.log("==================================================");

if (failed > 0) process.exit(1);
