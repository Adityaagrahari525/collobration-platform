import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: borderRadius.md,
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (size) {
      case "sm":
        base.paddingVertical = 8;
        base.paddingHorizontal = 12;
        break;
      case "lg":
        base.paddingVertical = 16;
        base.paddingHorizontal = 24;
        break;
      case "md":
      default:
        base.paddingVertical = 12;
        base.paddingHorizontal = 18;
        break;
    }

    switch (variant) {
      case "secondary":
        base.backgroundColor = colors.secondary;
        break;
      case "outline":
        base.backgroundColor = "transparent";
        base.borderWidth = 1.5;
        base.borderColor = colors.primary;
        break;
      case "danger":
        base.backgroundColor = colors.error;
        break;
      case "ghost":
        base.backgroundColor = "transparent";
        break;
      case "primary":
      default:
        base.backgroundColor = colors.primary;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    switch (size) {
      case "sm":
        base.fontSize = typography.labelSmall.fontSize;
        break;
      case "lg":
        base.fontSize = typography.titleMedium.fontSize;
        break;
      case "md":
      default:
        base.fontSize = typography.labelLarge.fontSize;
        break;
    }

    switch (variant) {
      case "outline":
      case "ghost":
        base.color = colors.primary;
        break;
      case "secondary":
      case "danger":
      case "primary":
      default:
        base.color = colors.onPrimary;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.onPrimary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={[getTextStyle(), icon ? { marginLeft: spacing.sm } : {}, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
