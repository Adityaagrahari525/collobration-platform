import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak = 0,
  size = "md",
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        size === "lg" ? styles.large : size === "sm" ? styles.small : styles.medium,
        style,
      ]}
    >
      <Text style={size === "lg" ? styles.flameLg : styles.flame}>🔥</Text>
      <View>
        <Text
          style={[
            styles.streakCount,
            size === "lg" ? typography.titleLarge : typography.labelLarge,
          ]}
        >
          {streak} {size === "lg" ? "Day Streak" : "d"}
        </Text>
        {size === "lg" ? (
          <Text style={styles.streakSubtext}>Consecutive research activity</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tertiaryLight,
    borderColor: colors.tertiaryContainer,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  large: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignSelf: "stretch",
  },
  flame: {
    fontSize: 14,
    marginRight: 4,
  },
  flameLg: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  streakCount: {
    color: colors.streakOrange,
    fontWeight: "700",
  },
  streakSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
