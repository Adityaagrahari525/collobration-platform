/**
 * Gamification & User Reputation Statistics Engine
 * Manages level thresholds (1-6), XP progression, daily streak calculations,
 * and badge unlocking criteria.
 */

import { LevelInfo, User } from "../types";

export const LEVEL_THRESHOLDS: Array<{ level: number; name: string; minXp: number; maxXp: number }> = [
  { level: 1, name: "Novice Academic", minXp: 0, maxXp: 99 },
  { level: 2, name: "Contributor", minXp: 100, maxXp: 299 },
  { level: 3, name: "Scholar", minXp: 300, maxXp: 699 },
  { level: 4, name: "Researcher", minXp: 700, maxXp: 1499 },
  { level: 5, name: "Master Mentor", minXp: 1500, maxXp: 4999 },
  { level: 6, name: "Academic Fellow", minXp: 5000, maxXp: Infinity }
];

export function calculateLevel(xp: number = 0): LevelInfo {
  const current = LEVEL_THRESHOLDS.find(l => xp >= l.minXp && xp <= l.maxXp) || LEVEL_THRESHOLDS[0];
  const next = LEVEL_THRESHOLDS.find(l => l.level === current.level + 1) || current;
  const xpInLevel = xp - current.minXp;
  const levelSpan = next.minXp - current.minXp || 1;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100)));

  return {
    ...current,
    nextLevelName: next.name,
    xpToNext: Math.max(0, next.minXp - xp),
    progressPercent
  };
}

export function checkBadges(user: Partial<User> = {}): string[] {
  const badges = new Set<string>(user.badges || []);
  const points = user.contributionScore || user.xpPoints || 0;
  const answers = user.answersCount || 0;
  const accepted = user.acceptedAnswersCount || 0;
  const streak = user.currentStreak || 0;

  if (points >= 100) badges.add("Top Contributor");
  if (accepted >= 5) badges.add("Solution Architect");
  if (answers >= 10) badges.add("Peer Helper");
  if (streak >= 7) badges.add("Weekly Active Scholar");
  if (user.role === "faculty") badges.add("Verified Mentor");
  if (user.verified) badges.add("Campus Verified");

  return Array.from(badges);
}

export function calculateUpdatedStreak(lastActiveDateStr?: string, currentStreak: number = 0): { streak: number; updated: boolean } {
  if (!lastActiveDateStr) return { streak: 1, updated: true };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = new Date(lastActiveDateStr);
  lastActive.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { streak: currentStreak || 1, updated: false };
  } else if (diffDays === 1) {
    return { streak: (currentStreak || 0) + 1, updated: true };
  } else {
    return { streak: 1, updated: true };
  }
}
