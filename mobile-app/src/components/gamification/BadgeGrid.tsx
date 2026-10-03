import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const ALL_BADGES = [
  { name: "Top Contributor", icon: "🏆", desc: "100+ Contribution points earned" },
  { name: "Solution Architect", icon: "⭐", desc: "5+ Answers marked as accepted" },
  { name: "Peer Helper", icon: "🤝", desc: "10+ Academic answers published" },
  { name: "Weekly Active Scholar", icon: "🔥", desc: "7+ Days active streak" },
  { name: "Campus Verified", icon: "🛡️", desc: "Official academic email validated" },
  { name: "Verified Mentor", icon: "👨‍🏫", desc: "Faculty advisory status verified" },
];

export interface BadgeGridProps {
  earnedBadges?: string[];
  style?: ViewStyle;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  earnedBadges = [],
  style,
}) => {
  const earnedSet = new Set(earnedBadges);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.sectionTitle}>Academic Badges & Honors</Text>
      <View style={styles.grid}>
        {ALL_BADGES.map((b) => {
          const isEarned = earnedSet.has(b.name);
          return (
            <View
              key={b.name}
              style={[
                styles.badgeCard,
                isEarned ? styles.badgeEarned : styles.badgeLocked,
              ]}
            >
              <Text style={[styles.badgeIcon, !isEarned && styles.iconLocked]}>
                {b.icon}
              </Text>
              <Text
                style={[
                  styles.badgeName,
                  isEarned ? styles.nameEarned : styles.nameLocked,
                ]}
                numberOfLines={1}
              >
                {b.name}
              </Text>
              <Text style={styles.badgeDesc} numberOfLines={2}>
                {b.desc}
              </Text>
              {isEarned ? (
                <View style={styles.unlockedPill}>
                  <Text style={styles.unlockedText}>Unlocked ✓</Text>
                </View>
              ) : (
                <View style={styles.lockedPill}>
                  <Text style={styles.lockedText}>Locked 🔒</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badgeCard: {
    width: "48%",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  badgeEarned: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface,
  },
  badgeLocked: {
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceContainerLow,
    opacity: 0.65,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  iconLocked: {
    opacity: 0.4,
  },
  badgeName: {
    ...typography.labelLarge,
    textAlign: "center",
    marginBottom: 2,
  },
  nameEarned: {
    color: colors.textPrimary,
  },
  nameLocked: {
    color: colors.textMuted,
  },
  badgeDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.sm,
    minHeight: 28,
  },
  unlockedPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.secondary,
  },
  lockedPill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
