/**
 * Heuristic Skill Matching Engine
 * Calculates candidate compatibility score (0-100) based on skill overlap,
 * complementary skill gaps, experience level deltas, and availability flags.
 */

/** Calculate shared skills between two users or user and project requirements */
export function getSkillOverlap(userSkills = [], targetSkills = []) {
  const uSet = new Set(userSkills.map(s => String(s).toLowerCase()));
  return targetSkills.filter(s => uSet.has(String(s).toLowerCase()));
}

/** Calculate complementary skills (what target has that user doesn't) */
export function getComplementarySkills(userSkills = [], targetSkills = []) {
  const uSet = new Set(userSkills.map(s => String(s).toLowerCase()));
  return targetSkills.filter(s => !uSet.has(String(s).toLowerCase())).slice(0, 4);
}

/** Calculate shared interests between two users */
export function getInterestOverlap(userInterests = [], targetInterests = []) {
  const uSet = new Set(userInterests.map(i => String(i).toLowerCase()));
  return targetInterests.filter(i => uSet.has(String(i).toLowerCase()));
}

/** Experience compatibility score (0-25) */
export function experienceScore(userExp = "Beginner", targetExp = "Beginner") {
  const levels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const uLevel = levels[userExp] || 1;
  const tLevel = levels[targetExp] || 1;
  const diff = Math.abs(uLevel - tLevel);
  if (diff === 0) return 25;
  if (diff === 1) return 15;
  return 5;
}

/** Availability compatibility score (0-20) */
export function availabilityScore(userAvail = "Weekends", targetAvail = "Weekends") {
  if (userAvail === targetAvail) return 20;
  if (
    (userAvail === "Full-time" && targetAvail === "Part-time") ||
    (userAvail === "Part-time" && targetAvail === "Full-time")
  )
    return 12;
  return 6;
}

/** Skill score calculation (0-35) */
export function skillScore(userSkills = [], targetSkills = []) {
  const overlapCount = getSkillOverlap(userSkills, targetSkills).length;
  const complementaryCount = getComplementarySkills(userSkills, targetSkills).length;
  const raw = overlapCount * 4 + complementaryCount * 5;
  return Math.min(35, raw);
}

/** Interest score calculation (0-20) */
export function interestScore(userInterests = [], targetInterests = []) {
  const overlapCount = getInterestOverlap(userInterests, targetInterests).length;
  return Math.min(20, overlapCount * 7);
}

/**
 * Compute a heuristic compatibility score (0–100) between a user and candidate/project
 */
export function computeCompatibility(user = {}, target = {}) {
  const userSkills = user.skills || [];
  const targetSkills = target.requiredSkills || target.skills || [];
  const userInterests = user.interests || [];
  const targetInterests = target.interests || [];

  const sScore = skillScore(userSkills, targetSkills);
  const iScore = interestScore(userInterests, targetInterests);
  const eScore = experienceScore(user.experience, target.experience);
  const aScore = availabilityScore(user.availability, target.availability);

  const total = sScore + iScore + eScore + aScore;
  return Math.min(100, Math.round(total));
}

/** Generate textual explanation for match score */
export function buildMatchExplanation(user = {}, target = {}) {
  const score = computeCompatibility(user, target);
  const targetName = target.name || target.title || "Project";
  const overlap = getSkillOverlap(user.skills, target.requiredSkills || target.skills);
  const complementary = getComplementarySkills(user.skills, target.requiredSkills || target.skills);

  if (score >= 80) {
    return `Stellar team match! Shares ${overlap.length} core skills and brings ${complementary.slice(0, 2).join(" & ") || "complementary expertise"} to your stack.`;
  }
  if (score >= 60) {
    return `Strong alignment on core technologies and project goals with good skill coverage.`;
  }
  if (score >= 40) {
    return `Complementary skillset — fills technical gaps on the project team.`;
  }
  return `Potential fresh perspective — offers different background and learning opportunities.`;
}
