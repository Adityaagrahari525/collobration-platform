import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "outline" | "neutral";
  size?: "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderRadius: borderRadius.full,
      paddingHorizontal: size === "sm" ? 8 : 10,
      paddingVertical: size === "sm" ? 2 : 4,
    };

    switch (variant) {
      case "secondary":
        base.backgroundColor = colors.secondaryContainer;
        break;
      case "success":
        base.backgroundColor = colors.successBackground;
        break;
      case "warning":
        base.backgroundColor = colors.warningBackground;
        break;
      case "error":
        base.backgroundColor = colors.errorContainer;
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = 1;
        base.borderColor = colors.outlineVariant;
        break;
      case "neutral":
        base.backgroundColor = colors.surfaceContainer;
        break;
      case "primary":
      default:
        base.backgroundColor = colors.primaryLight;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: size === "sm" ? 11 : 12,
      fontWeight: "600",
    };

    switch (variant) {
      case "secondary":
        base.color = colors.onSecondaryContainer;
        break;
      case "success":
        base.color = colors.successText;
        break;
      case "warning":
        base.color = colors.warningText;
        break;
      case "error":
        base.color = colors.errorText;
        break;
      case "outline":
      case "neutral":
        base.color = colors.textSecondary;
        break;
      case "primary":
      default:
        base.color = colors.primary;
        break;
    }

    return base;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {icon ? <View style={{ marginRight: 4 }}>{icon}</View> : null}
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};
