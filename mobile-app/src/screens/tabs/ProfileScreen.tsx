import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { XPProgressBar } from "../../components/gamification/XPProgressBar";
import { StreakBadge } from "../../components/gamification/StreakBadge";
import { BadgeGrid } from "../../components/gamification/BadgeGrid";
import { LearningPathWidget } from "../../components/gamification/LearningPathWidget";
import { SkillTag } from "../../components/common/SkillTag";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to end your academic session?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]
    );
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user.name[0]}</Text>
              </View>
            )}
            {user.verified ? (
              <View style={styles.verifiedDot}>
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.headerDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
            <Text style={styles.institutionText}>{user.institution}</Text>
            <Text style={styles.departmentText}>
              {user.department} • {user.degree || (user.role === "faculty" ? "Professor" : "Student")}
            </Text>
            <View style={styles.badgesRow}>
              <Badge
                label={user.role === "faculty" ? "Faculty Advisor" : "Verified Student"}
                variant={user.role === "faculty" ? "secondary" : "primary"}
                size="sm"
              />
              <Badge
                label={user.verificationCode || "#IN-VERIFIED"}
                variant="outline"
                size="sm"
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
        </View>

        {/* Bio */}
        {user.bio ? <Text style={styles.bioText}>{user.bio}</Text> : null}

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.contributionScore || 0}</Text>
            <Text style={styles.statLabel}>Reputation Pts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.answersCount || 0}</Text>
            <Text style={styles.statLabel}>Answers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.projectsCount || 0}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>

        {/* Navigation to Scorecard */}
        <Button
          title="View Contribution & Scorecard Breakdown →"
          variant="outline"
          size="sm"
          onPress={() => navigation.navigate("Contribution")}
          style={styles.scorecardBtn}
        />
      </View>

      {/* XP Level Progression */}
      <XPProgressBar xp={user.xpPoints || user.contributionScore || 0} />

      {/* Streak Badge */}
      <StreakBadge streak={user.currentStreak || 1} size="lg" style={{ marginBottom: spacing.md }} />

      {/* Rule-Based AI Skill Gap & Career Pathway Widget */}
      <LearningPathWidget currentSkills={user.skills} />

      {/* Verified Skills */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Academic Skills & Stack</Text>
        <View style={styles.skillsRow}>
          {user.skills.map((skill) => (
            <SkillTag key={skill} skill={skill} variant="primary" />
          ))}
        </View>
      </View>

      {/* Faculty Endorsements */}
      {user.endorsements && user.endorsements.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Faculty Endorsements</Text>
          {user.endorsements.map((end) => (
            <View key={end.id} style={styles.endorsementItem}>
              <Text style={styles.endorsementIcon}>📜</Text>
              <View style={styles.endorsementContent}>
                <Text style={styles.endorsementNote}>"{end.note}"</Text>
                <Text style={styles.endorsementBy}>
                  — {end.by} ({end.role})
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* Academic Badges */}
      <BadgeGrid earnedBadges={user.badges} />

      {/* Account / Settings Footer */}
      <View style={styles.footerActions}>
        <Button
          title="Settings & Academic Preferences"
          variant="outline"
          size="md"
          onPress={() => navigation.navigate("Settings")}
          style={{ marginBottom: spacing.sm }}
        />
        <Button
          title="Sign Out of Session"
          variant="danger"
          size="md"
          onPress={handleLogout}
        />
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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  verifiedCheck: {
    color: colors.onSecondary,
    fontSize: 10,
    fontWeight: "800",
  },
  headerDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  institutionText: {
    ...typography.labelLarge,
    color: colors.primary,
    fontWeight: "600",
  },
  departmentText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  bioText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginVertical: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    ...typography.titleLarge,
    color: colors.primary,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  scorecardBtn: {
    marginTop: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  endorsementItem: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  endorsementIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  endorsementContent: {
    flex: 1,
  },
  endorsementNote: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: "italic",
    lineHeight: 18,
  },
  endorsementBy: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
    marginTop: 4,
  },
  footerActions: {
    marginVertical: spacing.lg,
  },
});
