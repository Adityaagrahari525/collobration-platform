import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";
import { calculateLevel } from "../../utils/userStats";

export interface XPProgressBarProps {
  xp?: number;
  style?: ViewStyle;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({ xp = 0, style }) => {
  const levelInfo = calculateLevel(xp);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelIcon}>🎓</Text>
          <Text style={styles.levelText}>
            Lvl {levelInfo.level} • {levelInfo.name}
          </Text>
        </View>
        <Text style={styles.xpText}>
          <Text style={styles.xpNumber}>{xp}</Text> XP
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${levelInfo.progressPercent}%` },
          ]}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.progressInfo}>
          {levelInfo.progressPercent}% of current tier
        </Text>
        {levelInfo.xpToNext > 0 ? (
          <Text style={styles.nextTierInfo}>
            {levelInfo.xpToNext} XP to {levelInfo.nextLevelName}
          </Text>
        ) : (
          <Text style={styles.maxTierInfo}>Top Tier Scholar ★</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  levelIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  levelText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: "700",
  },
  xpText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  xpNumber: {
    fontWeight: "700",
    color: colors.xpGold,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: spacing.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressInfo: {
    ...typography.caption,
    color: colors.textMuted,
  },
  nextTierInfo: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  maxTierInfo: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
});
