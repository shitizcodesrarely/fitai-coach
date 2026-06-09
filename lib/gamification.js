// Core gamification logic
// XP calculation, level ups, badge checking, streak tracking

import { prisma } from "./db.js";
import { BADGES } from "../constants/badges.js";
import { getXpForLevel } from "../constants/ranks.js";

// ── XP rewards ────────────────────────────────────────────────────────────
const XP_REWARDS = {
  COMPLETE_WORKOUT:    50,
  HIT_ALL_SETS:        25,
  PERSONAL_BEST:       100,
  UPLOAD_FORM_CHECK:   30,
  LOG_BODY_WEIGHT:     10,
  STREAK_7_DAYS:       200,
  STREAK_30_DAYS:      1000,
  COMPLETE_ONBOARDING: 100,
};

/**
 * Calculate level from total XP
 */
export function calculateLevel(xp) {
  let level = 1;
  while (level < 50 && xp >= getXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

/**
 * Main function called after every workout session completes.
 * Updates XP, level, streak, total volume, checks for new badges.
 * Returns { xpEarned, newLevel, leveledUp, newBadges, streak }
 */
export async function processWorkoutCompletion(userId, sessionData) {
  const { totalVolumeKg, hitAllSets, personalBests, sessionId, startedAt } = sessionData;

  // ── Calculate XP earned this session ─────────────────────────────────
  let xpEarned = XP_REWARDS.COMPLETE_WORKOUT;
  if (hitAllSets)           xpEarned += XP_REWARDS.HIT_ALL_SETS;
  if (personalBests > 0)    xpEarned += XP_REWARDS.PERSONAL_BEST * personalBests;

  // Check time of day for secret badges
  const hour = new Date(startedAt).getHours();
  const isDawnCrusader = hour < 7;
  const isNightLords   = hour >= 22;

  // ── Fetch current stats ───────────────────────────────────────────────
  let stats = await prisma.userStats.findUnique({ where: { userId } });

  if (!stats) {
    // First workout ever — create stats record
    stats = await prisma.userStats.create({
      data: { userId }
    });
  }

  // ── Update streak ─────────────────────────────────────────────────────
  const today     = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = 1;
  if (stats.lastWorkoutDate === yesterday) {
    // Worked out yesterday — streak continues
    newStreak = stats.currentStreak + 1;
  } else if (stats.lastWorkoutDate === today) {
    // Already worked out today — keep current streak
    newStreak = stats.currentStreak;
  }
  // else: missed a day — streak resets to 1

  // Bonus XP for streak milestones
  if (newStreak === 7)  xpEarned += XP_REWARDS.STREAK_7_DAYS;
  if (newStreak === 30) xpEarned += XP_REWARDS.STREAK_30_DAYS;

  // ── Calculate new totals ──────────────────────────────────────────────
  const newXp           = stats.xp + xpEarned;
  const newTotalVolume  = stats.totalVolumeKg + totalVolumeKg;
  const newTotalSessions= stats.totalSessions + 1;
  const oldLevel        = stats.level;
  const newLevel        = calculateLevel(newXp);
  const leveledUp       = newLevel > oldLevel;

  // ── Update stats in DB ────────────────────────────────────────────────
  await prisma.userStats.update({
    where: { userId },
    data: {
      xp:                newXp,
      level:             newLevel,
      totalVolumeKg:     newTotalVolume,
      totalSessions:     newTotalSessions,
      currentStreak:     newStreak,
      longestStreak:     Math.max(stats.longestStreak, newStreak),
      lastWorkoutDate:   today,
      weeklyVolume:      stats.weeklyVolume + totalVolumeKg,
      weeklySessionCount: stats.weeklySessionCount + 1,
    },
  });

  // Update session record with XP earned
  await prisma.workoutSession.update({
    where: { id: sessionId },
    data:  { xpEarned, totalVolumeKg },
  });

  // ── Check and award badges ────────────────────────────────────────────
  const newBadges = await checkAndAwardBadges(userId, {
    totalSessions:  newTotalSessions,
    totalVolumeKg:  newTotalVolume,
    currentStreak:  newStreak,
    sessionVolumeKg: totalVolumeKg,
    personalBests,
    isDawnCrusader,
    isNightLords,
    isFirstWorkout: newTotalSessions === 1,
  });

  return {
    xpEarned,
    newLevel,
    oldLevel,
    leveledUp,
    newBadges,
    streak:      newStreak,
    totalVolume: newTotalVolume,
  };
}

/**
 * Check which badges the user just earned and award them
 * Returns array of newly earned badge objects
 */
async function checkAndAwardBadges(userId, context) {
  const {
    totalSessions, totalVolumeKg, currentStreak,
    sessionVolumeKg, personalBests,
    isDawnCrusader, isNightLords, isFirstWorkout,
  } = context;

  // Get badges user already has
  const existing = await prisma.userBadge.findMany({
    where:  { userId },
    select: { badge: { select: { key: true } } },
  });
  const earnedKeys = new Set(existing.map((ub) => ub.badge.key));

  // Which badges should be awarded now
  const toAward = [];

  if (isFirstWorkout          && !earnedKeys.has("baptism_of_iron"))    toAward.push("baptism_of_iron");
  if (currentStreak >= 3      && !earnedKeys.has("burning_crusade"))    toAward.push("burning_crusade");
  if (currentStreak >= 7      && !earnedKeys.has("oath_of_moment"))     toAward.push("oath_of_moment");
  if (currentStreak >= 30     && !earnedKeys.has("eternal_warrior"))    toAward.push("eternal_warrior");
  if (totalSessions >= 100    && !earnedKeys.has("hundred_worlds"))     toAward.push("hundred_worlds");
  if (sessionVolumeKg >= 1000 && !earnedKeys.has("whale_shark_protocol")) toAward.push("whale_shark_protocol");
  if (personalBests > 0       && !earnedKeys.has("mjolnir_lift"))       toAward.push("mjolnir_lift");
  if (isDawnCrusader          && !earnedKeys.has("dawn_crusader"))      toAward.push("dawn_crusader");
  if (isNightLords            && !earnedKeys.has("night_lords"))        toAward.push("night_lords");
  if (totalVolumeKg >= 10000  && !earnedKeys.has("leviathan_class"))    toAward.push("leviathan_class");

  // Check weekly sessions for unbroken chain
  const stats = await prisma.userStats.findUnique({ where: { userId } });
  if (stats?.weeklySessionCount >= 4 && !earnedKeys.has("unbroken_chain")) {
    toAward.push("unbroken_chain");
  }

  if (toAward.length === 0) return [];

  // Look up badge records
  const badgeRecords = await prisma.badge.findMany({
    where: { key: { in: toAward } },
  });

  // Award each badge and add XP
  const newBadges = [];
  for (const badge of badgeRecords) {
    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });
    // Add badge XP reward
    await prisma.userStats.update({
      where: { userId },
      data:  { xp: { increment: badge.xpReward } },
    });
    newBadges.push(badge);
  }

  return newBadges;
}

/**
 * Award the onboarding badge when user completes setup
 */
export async function awardOnboardingBadge(userId) {
  const badge = await prisma.badge.findUnique({
    where: { key: "gene_seed_activated" },
  });
  if (!badge) return;

  const already = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (already) return;

  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });

  let stats = await prisma.userStats.findUnique({ where: { userId } });
  if (!stats) {
    await prisma.userStats.create({ data: { userId, xp: badge.xpReward } });
  } else {
    await prisma.userStats.update({
      where: { userId },
      data:  { xp: { increment: badge.xpReward } },
    });
  }
}

/**
 * Award form check badge
 */
export async function awardFormCheckBadge(userId) {
  const badge = await prisma.badge.findUnique({
    where: { key: "servo_skull_vision" },
  });
  if (!badge) return;

  const already = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (already) return;

  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
  await prisma.userStats.update({
    where: { userId },
    data:  { xp: { increment: badge.xpReward } },
  });
}
