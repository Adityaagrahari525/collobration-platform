import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  style?: ViewStyle;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = "md",
  showLabel = true,
  style,
}) => {
  const getBadgeColors = () => {
    if (score >= 80) {
      return {
        bg: colors.secondaryLight,
        border: colors.secondary,
        text: colors.secondary,
        label: "High Match",
      };
    }
    if (score >= 60) {
      return {
        bg: colors.primaryLight,
        border: colors.primary,
        text: colors.primary,
        label: "Good Fit",
      };
    }
    if (score >= 40) {
      return {
        bg: colors.tertiaryLight,
        border: colors.tertiary,
        text: colors.tertiary,
        label: "Complementary",
      };
    }
    return {
      bg: colors.surfaceContainer,
      border: colors.outlineVariant,
      text: colors.textSecondary,
      label: "Potential Match",
    };
  };

  const badgeColor = getBadgeColors();

  const getContainerPadding = () => {
    switch (size) {
      case "sm":
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case "lg":
        return { paddingHorizontal: 12, paddingVertical: 6 };
      case "md":
      default:
        return { paddingHorizontal: 8, paddingVertical: 3 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 11;
      case "lg":
        return 14;
      case "md":
      default:
        return 12;
    }
  };

  return (
    <View
      style={[
        styles.container,
        getContainerPadding(),
        {
          backgroundColor: badgeColor.bg,
          borderColor: badgeColor.border,
        },
        style,
      ]}
    >
      <Text style={[styles.scoreText, { color: badgeColor.text, fontSize: getFontSize() }]}>
        {score}% {showLabel ? `• ${badgeColor.label}` : "Match"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  scoreText: {
    ...typography.labelSmall,
    fontWeight: "700",
  },
});
