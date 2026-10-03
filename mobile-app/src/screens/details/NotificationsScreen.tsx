import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { useApp } from "../../context/AppContext";

export const NotificationsScreen = ({ navigation }: any) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const handleNotificationPress = async (item: any) => {
    await markNotificationRead(item.id);
    if (item.targetScreen === "QuestionDetail" && item.targetId) {
      navigation.navigate("QuestionDetail", { id: item.targetId });
    } else if (item.targetScreen === "Mentorship") {
      navigation.navigate("Mentorship");
    } else if (item.targetScreen === "Profile") {
      navigation.navigate("ProfileTab");
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "answer_accepted":
        return "⭐";
      case "endorsement":
        return "📜";
      case "mentorship_confirmed":
        return "📅";
      case "project_invite":
        return "🔬";
      default:
        return "🔔";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications Center</Text>
          <Text style={styles.headerSubtitle}>
            Research alerts, answers & advisory milestones
          </Text>
        </View>
        {notifications.some((n) => !n.read) ? (
          <Button
            title="Mark All Read"
            variant="ghost"
            size="sm"
            onPress={markAllNotificationsRead}
          />
        ) : null}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notifCard,
              !item.read && styles.notifCardUnread,
            ]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{getNotifIcon(item.type)}</Text>
            </View>

            <View style={styles.notifContent}>
              <View style={styles.titleRow}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifTime}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔕"
            title="All Caught Up!"
            description="You have no pending notifications at this time."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "flex-start",
    ...shadows.sm,
  },
  notifCardUnread: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.primaryLight,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 18,
  },
  notifContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  notifTitle: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifTime: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});
