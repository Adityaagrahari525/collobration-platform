import React from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { borderRadius, shadows, spacing } from "../../theme/spacing";

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "elevated" | "outlined" | "filled";
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = "elevated",
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    };

    switch (variant) {
      case "outlined":
        base.borderWidth = 1;
        base.borderColor = colors.border;
        break;
      case "filled":
        base.backgroundColor = colors.surfaceContainerLow;
        break;
      case "elevated":
      default:
        base.borderWidth = 1;
        base.borderColor = colors.borderLight;
        Object.assign(base, shadows.sm);
        break;
    }

    return base;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getContainerStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getContainerStyle(), style]}>{children}</View>;
};
