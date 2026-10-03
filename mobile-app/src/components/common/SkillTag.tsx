import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface SkillTagProps {
  skill: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "accent" | "neutral";
}

export const SkillTag: React.FC<SkillTagProps> = ({
  skill,
  selected = false,
  onPress,
  onRemove,
  style,
  variant = "primary",
}) => {
  const getBackgroundColor = () => {
    if (selected) return colors.primary;
    switch (variant) {
      case "secondary":
        return colors.secondaryLight;
      case "accent":
        return colors.tertiaryLight;
      case "neutral":
        return colors.surfaceContainer;
      case "primary":
      default:
        return colors.primaryLight;
    }
  };

  const getTextColor = () => {
    if (selected) return colors.onPrimary;
    switch (variant) {
      case "secondary":
        return colors.secondary;
      case "accent":
        return colors.tertiary;
      case "neutral":
        return colors.textSecondary;
      case "primary":
      default:
        return colors.primary;
    }
  };

  const content = (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
      <Text style={[styles.text, { color: getTextColor() }]}>{skill}</Text>
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.removeText, { color: getTextColor() }]}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  text: {
    ...typography.labelSmall,
    fontWeight: "600",
  },
  removeBtn: {
    marginLeft: 6,
  },
  removeText: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 14,
  },
});
