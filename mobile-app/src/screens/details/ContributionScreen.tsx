import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { useAuth } from "../../context/AuthContext";
import { calculateLevel } from "../../utils/userStats";

const RULES = [
  { action: "Answer Marked as Accepted Solution", points: "+10 Pts", icon: "⭐" },
  { action: "Joined Approved Research Project", points: "+20 Pts", icon: "🔬" },
  { action: "Faculty Skill Endorsement Received", points: "+15 Pts", icon: "📜" },
  { action: "High-Quality Academic Question Posted", points: "+5 Pts", icon: "❓" },
  { action: "Faculty Mentorship Advisory Completed", points: "+25 Pts", icon: "👨‍🏫" },
];

export const ContributionScreen = () => {
  const { user } = useAuth();
  const level = calculateLevel(user?.xpPoints || user?.contributionScore || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Scorecard Hero */}
      <View style={styles.scoreHero}>
        <Text style={styles.scoreLabel}>Total Verified Academic Reputation</Text>
        <Text style={styles.scoreNumber}>{user?.contributionScore || 0}</Text>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>Tier {level.level}: {level.name}</Text>
        </View>
        <Text style={styles.scoreSubtitle}>
          Ranked based on peer answers, verified projects, and faculty validations
        </Text>
      </View>

      {/* Point Rules Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reputation & Point Award Mechanics</Text>
        <Text style={styles.cardSubtitle}>
          Deterministic contribution scoring designed for academic integrity
        </Text>

        {RULES.map((rule, idx) => (
          <View key={idx} style={styles.ruleItem}>
            <Text style={styles.ruleIcon}>{rule.icon}</Text>
            <Text style={styles.ruleAction}>{rule.action}</Text>
            <Text style={styles.rulePoints}>{rule.points}</Text>
          </View>
        ))}
      </View>

      {/* Verified Certificate Card */}
      <View style={styles.certCard}>
        <View style={styles.certHeader}>
          <Text style={styles.certSeal}>🛡️</Text>
          <View>
            <Text style={styles.certTitle}>National Academic Network Certificate</Text>
            <Text style={styles.certMeta}>
              Issued to {user?.name} ({user?.institution})
            </Text>
          </View>
        </View>
        <Text style={styles.certBody}>
          This digital credential verifies authentic academic participation, peer endorsements, and peer-reviewed code artifacts across Indian academic institutions.
        </Text>
        <View style={styles.certFooter}>
          <Text style={styles.certCode}>
            VERIFICATION CODE: {user?.verificationCode || "#IN-VERIFIED"}
          </Text>
        </View>
      </View>

      {/* Contributions History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Contribution Log</Text>
        {user?.contributions && user.contributions.length > 0 ? (
          user.contributions.map((cnt) => (
            <View key={cnt.id} style={styles.logItem}>
              <View style={styles.logIconCircle}>
                <Text style={styles.logIcon}>✓</Text>
              </View>
              <View style={styles.logContent}>
                <Text style={styles.logDesc}>{cnt.description}</Text>
                <Text style={styles.logDate}>{cnt.date}</Text>
              </View>
              <Text style={styles.logPoints}>+{cnt.points} pts</Text>
            </View>
          ))
        ) : (
          <View style={styles.defaultLog}>
            <View style={styles.logItem}>
              <View style={styles.logIconCircle}>
                <Text style={styles.logIcon}>✓</Text>
              </View>
              <View style={styles.logContent}>
                <Text style={styles.logDesc}>Profile registered with verified academic email</Text>
                <Text style={styles.logDate}>Recently</Text>
              </View>
              <Text style={styles.logPoints}>+100 pts</Text>
            </View>
          </View>
        )}
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
  scoreHero: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.md,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.primaryLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.onPrimary,
    marginVertical: 4,
  },
  levelPill: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  levelText: {
    ...typography.labelSmall,
    color: colors.onPrimaryContainer,
    fontWeight: "700",
  },
  scoreSubtitle: {
    ...typography.caption,
    color: colors.primaryLight,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  ruleIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  ruleAction: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  rulePoints: {
    ...typography.labelLarge,
    color: colors.secondary,
    fontWeight: "700",
  },
  certCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    marginBottom: spacing.md,
  },
  certHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  certSeal: {
    fontSize: 26,
    marginRight: spacing.sm,
  },
  certTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  certMeta: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "600",
  },
  certBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  certFooter: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: "center",
  },
  certCode: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: "800",
    letterSpacing: 1,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  logIcon: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: "700",
  },
  logContent: {
    flex: 1,
  },
  logDesc: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  logDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  logPoints: {
    ...typography.labelLarge,
    color: colors.secondary,
    fontWeight: "700",
  },
  defaultLog: {},
});
