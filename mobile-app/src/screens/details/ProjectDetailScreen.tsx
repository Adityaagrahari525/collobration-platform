import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { MatchScoreBadge } from "../../components/common/MatchScoreBadge";
import { SkillTag } from "../../components/common/SkillTag";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ApplyModal } from "../../components/projects/ApplyModal";
import { CodePreviewModal } from "../../components/projects/CodePreviewModal";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { computeCompatibility, buildMatchExplanation } from "../../utils/matchingAlgorithm";

export const ProjectDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params || {};
  const { user } = useAuth();
  const { projects } = useApp();

  const project = projects.find((p) => p.id === id);

  const [applyModalVisible, setApplyModalVisible] = useState<boolean>(false);
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);

  if (!project) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Project workspace not found.</Text>
        <Button title="Back to Projects" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const matchScore = computeCompatibility(user || {}, project);
  const matchExplanation = buildMatchExplanation(user || {}, project);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Top Banner Card */}
      <View style={styles.bannerCard}>
        <View style={styles.statusMatchRow}>
          <Badge
            label={project.status || "Recruiting"}
            variant={project.status === "Recruiting" ? "secondary" : "primary"}
            size="sm"
          />
          <MatchScoreBadge score={matchScore} size="md" />
        </View>

        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.tagline}>{project.tagline || project.description}</Text>

        {/* Lead & Institution Info */}
        <View style={styles.leadSection}>
          <Text style={styles.leadIcon}>🏛️</Text>
          <View style={styles.leadInfo}>
            <Text style={styles.leadName}>Led by {project.lead}</Text>
            <Text style={styles.institutionName}>
              {project.institution} • {project.department}
            </Text>
          </View>
        </View>

        {/* Match explanation callout */}
        <View style={styles.matchCallout}>
          <Text style={styles.matchCalloutTitle}>Compatibility Assessment:</Text>
          <Text style={styles.matchCalloutText}>{matchExplanation}</Text>
        </View>
      </View>

      {/* Action Triggers Bar */}
      <View style={styles.actionTriggersRow}>
        <Button
          title="Apply for Role"
          variant="primary"
          size="md"
          onPress={() => setApplyModalVisible(true)}
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <Button
          title="💻 Monaco Code"
          variant="outline"
          size="md"
          onPress={() => setCodeModalVisible(true)}
          style={{ flex: 1 }}
        />
      </View>

      {/* Full Description */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Project Abstract & Goals</Text>
        <Text style={styles.bodyText}>{project.description}</Text>
      </View>

      {/* Research Metrics Dashboard (if available) */}
      {project.metrics ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Lab Telemetry & Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            {project.metrics.nodesDeployed ? (
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{project.metrics.nodesDeployed}</Text>
                <Text style={styles.metricLabel}>Mesh Nodes Deployed</Text>
              </View>
            ) : null}
            {project.metrics.accuracyPct ? (
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{project.metrics.accuracyPct}%</Text>
                <Text style={styles.metricLabel}>Consensus Accuracy</Text>
              </View>
            ) : null}
            {project.metrics.latencyMs ? (
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{project.metrics.latencyMs}ms</Text>
                <Text style={styles.metricLabel}>Avg Telemetry Latency</Text>
              </View>
            ) : null}
            {project.metrics.tokensBillion ? (
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>{project.metrics.tokensBillion}B</Text>
                <Text style={styles.metricLabel}>Tokens Processed</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Open Recruiting Roles */}
      {project.openRoles && project.openRoles.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Open Research Positions</Text>
          {project.openRoles.map((role) => (
            <View key={role} style={styles.roleItem}>
              <Text style={styles.roleIcon}>⚡</Text>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>{role}</Text>
                <Text style={styles.roleSubtext}>Accepting applicant pitches</Text>
              </View>
              <Button
                title="Apply"
                variant="secondary"
                size="sm"
                onPress={() => setApplyModalVisible(true)}
              />
            </View>
          ))}
        </View>
      ) : null}

      {/* Required Skills */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Required Technology Stack</Text>
        <View style={styles.skillsRow}>
          {project.skillsRequired.map((skill) => (
            <SkillTag key={skill} skill={skill} variant="primary" />
          ))}
        </View>
      </View>

      {/* Sprint Milestones */}
      {project.milestones && project.milestones.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sprint Roadmap & Milestones</Text>
          {project.milestones.map((m, idx) => (
            <View key={idx} style={styles.milestoneItem}>
              <View style={styles.milestoneDot}>
                <Text style={styles.milestoneCheck}>
                  {m.status === "Completed" ? "✓" : m.status === "In Progress" ? "⏳" : "○"}
                </Text>
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text style={styles.milestoneMeta}>
                  {m.status} • {m.date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* Team Members */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Research Team ({project.team.length})</Text>
        {project.team.map((member, idx) => (
          <View key={idx} style={styles.teamMemberItem}>
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
            ) : (
              <View style={styles.memberAvatarPlaceholder}>
                <Text style={styles.memberInitial}>{member.name[0]}</Text>
              </View>
            )}
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>
                {member.role} • {member.institution}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Apply Modal */}
      <ApplyModal
        visible={applyModalVisible}
        project={project}
        onClose={() => setApplyModalVisible(false)}
        onSuccess={() => setApplyModalVisible(false)}
      />

      {/* Code Workspace Preview Modal */}
      <CodePreviewModal
        visible={codeModalVisible}
        projectTitle={project.title}
        onClose={() => setCodeModalVisible(false)}
      />
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
    paddingBottom: spacing.xxxl,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.headlineSmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statusMatchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  leadSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  leadIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  institutionName: {
    ...typography.caption,
    color: colors.textMuted,
  },
  matchCallout: {
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  matchCalloutTitle: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: 2,
  },
  matchCalloutText: {
    ...typography.caption,
    color: colors.primary,
    lineHeight: 18,
  },
  actionTriggersRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bodyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricBox: {
    width: "48%",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...typography.headlineMedium,
    color: colors.primary,
    fontWeight: "700",
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  roleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  roleIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  roleSubtext: {
    ...typography.caption,
    color: colors.secondary,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  milestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  milestoneCheck: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  milestoneMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  teamMemberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
    paddingVertical: 4,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainer,
  },
  memberAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInitial: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  memberInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  memberName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  memberRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
