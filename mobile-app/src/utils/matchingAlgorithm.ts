/**
 * Heuristic Skill Matching Engine
 * Calculates candidate compatibility score (0-100) based on skill overlap,
 * complementary skill gaps, experience level deltas, and availability flags.
 */

import { User, Project } from "../types";

/** Calculate shared skills between two skill arrays */
export function getSkillOverlap(userSkills: string[] = [], targetSkills: string[] = []): string[] {
  const uSet = new Set(userSkills.map(s => String(s).toLowerCase().trim()));
  return targetSkills.filter(s => uSet.has(String(s).toLowerCase().trim()));
}

/** Calculate complementary skills (what target has that user doesn't) */
export function getComplementarySkills(userSkills: string[] = [], targetSkills: string[] = []): string[] {
  const uSet = new Set(userSkills.map(s => String(s).toLowerCase().trim()));
  return targetSkills.filter(s => !uSet.has(String(s).toLowerCase().trim())).slice(0, 4);
}

/** Calculate shared interests between two arrays */
export function getInterestOverlap(userInterests: string[] = [], targetInterests: string[] = []): string[] {
  const uSet = new Set(userInterests.map(i => String(i).toLowerCase().trim()));
  return targetInterests.filter(i => uSet.has(String(i).toLowerCase().trim()));
}

/** Experience compatibility score (0-25) */
export function experienceScore(userExp: string = "Beginner", targetExp: string = "Beginner"): number {
  const levels: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const uLevel = levels[userExp] || 1;
  const tLevel = levels[targetExp] || 1;
  const diff = Math.abs(uLevel - tLevel);
  if (diff === 0) return 25;
  if (diff === 1) return 15;
  return 5;
}

/** Availability compatibility score (0-20) */
export function availabilityScore(userAvail: string = "Weekends", targetAvail: string = "Weekends"): number {
  if (userAvail === targetAvail) return 20;
  if (
    (userAvail === "Full-time" && targetAvail === "Part-time") ||
    (userAvail === "Part-time" && targetAvail === "Full-time")
  ) {
    return 12;
  }
  return 6;
}

/** Skill score calculation (0-35) */
export function skillScore(userSkills: string[] = [], targetSkills: string[] = []): number {
  const overlapCount = getSkillOverlap(userSkills, targetSkills).length;
  const complementaryCount = getComplementarySkills(userSkills, targetSkills).length;
  const raw = overlapCount * 6 + complementaryCount * 4;
  return Math.min(35, raw);
}

/** Interest score calculation (0-20) */
export function interestScore(userInterests: string[] = [], targetInterests: string[] = []): number {
  const overlapCount = getInterestOverlap(userInterests, targetInterests).length;
  return Math.min(20, overlapCount * 7);
}

/**
 * Compute a heuristic compatibility score (0–100) between a user and project or another scholar
 */
export function computeCompatibility(
  user: Partial<User> = {},
  target: Partial<Project & User & { skills?: string[]; requiredSkills?: string[] }> = {}
): number {
  const userSkills = user.skills || [];
  const targetSkills = target.skillsRequired || target.requiredSkills || target.skills || [];
  const userInterests = user.interests || [];
  const targetInterests = target.interests || [];

  const sScore = skillScore(userSkills, targetSkills);
  const iScore = interestScore(userInterests, targetInterests);
  const eScore = experienceScore(user.experience, target.experience);
  const aScore = availabilityScore(user.availability, target.availability);

  const total = sScore + iScore + eScore + aScore;
  return Math.min(100, Math.max(15, Math.round(total)));
}

/** Generate textual explanation for match score */
export function buildMatchExplanation(
  user: Partial<User> = {},
  target: Partial<Project & User & { skills?: string[]; requiredSkills?: string[] }> = {}
): string {
  const score = computeCompatibility(user, target);
  const overlap = getSkillOverlap(user.skills || [], target.skillsRequired || target.skills || []);
  const complementary = getComplementarySkills(user.skills || [], target.skillsRequired || target.skills || []);

  if (score >= 80) {
    return `Stellar team match (${score}%)! Shares ${overlap.length} core skills and brings ${complementary.slice(0, 2).join(" & ") || "specialized expertise"} to your stack.`;
  }
  if (score >= 60) {
    return `Strong alignment (${score}%) on core technologies and project goals with solid skill coverage.`;
  }
  if (score >= 40) {
    return `Complementary skillset (${score}%) — fills technical gaps on the project team.`;
  }
  return `Potential fresh perspective (${score}%) — offers different background and learning opportunities.`;
}
