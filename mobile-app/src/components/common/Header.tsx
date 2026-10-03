import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showAvatar?: boolean;
  showStreak?: boolean;
  showNotifications?: boolean;
  onAvatarPress?: () => void;
  onNotificationPress?: () => void;
  onStreakPress?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showAvatar = true,
  showStreak = true,
  showNotifications = true,
  onAvatarPress,
  onNotificationPress,
  onStreakPress,
  leftAction,
  rightAction,
  style,
}) => {
  const { user } = useAuth();
  const { unreadNotificationsCount } = useApp();

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftSection}>
        {leftAction ? (
          leftAction
        ) : showAvatar && user ? (
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onAvatarPress}
            activeOpacity={0.8}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user.name ? user.name[0].toUpperCase() : "S"}
                </Text>
              </View>
            )}
            <View style={styles.onlineBadge} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title || (user ? `Hi, ${user.name.split(" ")[0]}` : "CampusLink")}
          </Text>
          {subtitle || user?.institution ? (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle || `${user?.institution} • ${user?.department || "Scholar"}`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {showStreak && user?.currentStreak ? (
              <TouchableOpacity
                style={styles.streakBadge}
                onPress={onStreakPress}
                activeOpacity={0.7}
              >
                <Text style={styles.flameIcon}>🔥</Text>
                <Text style={styles.streakCount}>{user.currentStreak}</Text>
              </TouchableOpacity>
            ) : null}

            {showNotifications ? (
              <TouchableOpacity
                style={styles.notifButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Text style={styles.notifIcon}>🔔</Text>
                {unreadNotificationsCount > 0 ? (
                  <View style={styles.notifDot}>
                    <Text style={styles.notifDotText}>
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarButton: {
    position: "relative",
    marginRight: spacing.sm,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.tertiaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.tertiaryContainer,
    marginRight: spacing.sm,
  },
  flameIcon: {
    fontSize: 13,
    marginRight: 3,
  },
  streakCount: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.streakOrange,
  },
  notifButton: {
    position: "relative",
    padding: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerLow,
  },
  notifIcon: {
    fontSize: 18,
  },
  notifDot: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  notifDotText: {
    color: colors.onError,
    fontSize: 9,
    fontWeight: "700",
  },
});
