import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { useAuth } from "../../context/AuthContext";

export const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const [pushNotifs, setPushNotifs] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [mentorshipReminders, setMentorshipReminders] = useState<boolean>(true);
  const [dataSaver, setDataSaver] = useState<boolean>(false);

  const handleClearCache = () => {
    Alert.alert("Cache Cleared", "Local temporary data and image cache have been refreshed.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Application Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage academic notifications, device preferences & verification status
        </Text>
      </View>

      {/* Account Info */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Scholar Verification</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Academic Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Institution</Text>
          <Text style={styles.infoValue}>{user?.institution}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Verification Status</Text>
          <Text style={[styles.infoValue, { color: colors.secondary, fontWeight: "700" }]}>
            Verified ({user?.verificationCode || "#IN-VERIFIED"})
          </Text>
        </View>
      </View>

      {/* Notification Preferences */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Notifications & Alerts</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Push Notifications</Text>
            <Text style={styles.toggleSubtitle}>Alerts for answers, mentorship and upvotes</Text>
          </View>
          <Switch
            value={pushNotifs}
            onValueChange={setPushNotifs}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryLight }}
            thumbColor={pushNotifs ? colors.primary : colors.surface}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Advisory Session Reminders</Text>
            <Text style={styles.toggleSubtitle}>Notifications 1 hour prior to faculty office hours</Text>
          </View>
          <Switch
            value={mentorshipReminders}
            onValueChange={setMentorshipReminders}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryLight }}
            thumbColor={mentorshipReminders ? colors.primary : colors.surface}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <Text style={styles.toggleTitle}>Email Digest</Text>
            <Text style={styles.toggleSubtitle}>Weekly top research questions from your campus</Text>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryLight }}
            thumbColor={emailAlerts ? colors.primary : colors.surface}
          />
        </View>
      </View>

      {/* Device & Storage */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Data & System</Text>
        <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
          <Text style={styles.actionTitle}>Clear Local Image & Query Cache</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => navigation.navigate("Help")}
        >
          <Text style={styles.actionTitle}>Academic Support & Guidelines</Text>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* App Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>CampusLink Mobile v1.0.0 (Build 2026.10)</Text>
        <Text style={styles.versionSub}>Engineered with Expo SDK & React Native</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  toggleText: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  toggleSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  actionTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  actionArrow: {
    fontSize: 16,
    color: colors.textMuted,
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  versionSub: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
});
