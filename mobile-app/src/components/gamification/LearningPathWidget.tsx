import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";
import { analyzeSkillGap, ROLE_SKILL_MAP } from "../../utils/aiService";
import { SkillTag } from "../common/SkillTag";

export interface LearningPathWidgetProps {
  currentSkills?: string[];
  style?: ViewStyle;
}

export const LearningPathWidget: React.FC<LearningPathWidgetProps> = ({
  currentSkills = [],
  style,
}) => {
  const roles = Object.keys(ROLE_SKILL_MAP);
  const [selectedRole, setSelectedRole] = useState<string>("Distributed Systems Engineer");

  const analysis = analyzeSkillGap(currentSkills, selectedRole);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Career Skill Gap & Roadmap</Text>
          <Text style={styles.subtitle}>Rule-based learning path recommendation</Text>
        </View>
        <View style={styles.matchPill}>
          <Text style={styles.matchText}>{analysis.progress}% Ready</Text>
        </View>
      </View>

      {/* Role Picker horizontal chips */}
      <View style={styles.roleChips}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleChip, selectedRole === r && styles.roleChipActive]}
            onPress={() => setSelectedRole(r)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.roleChipText,
                selectedRole === r && styles.roleChipTextActive,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Missing Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>
          Recommended Skill Additions ({analysis.missingSkills.length}):
        </Text>
        <View style={styles.skillsRow}>
          {analysis.missingSkills.length > 0 ? (
            analysis.missingSkills.map((s) => (
              <SkillTag key={s} skill={`+ ${s}`} variant="accent" />
            ))
          ) : (
            <Text style={styles.allSkillsMatched}>
              All core competencies verified for this role! 🎉
            </Text>
          )}
        </View>
      </View>

      {/* 4-Phase Step-by-Step Roadmap */}
      <View style={styles.roadmapContainer}>
        <Text style={styles.sectionHeading}>Structured 4-Phase Pathway:</Text>
        {analysis.recommendedPath.map((step, idx) => (
          <View key={idx} style={styles.stepItem}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>{idx + 1}</Text>
              </View>
              {idx < analysis.recommendedPath.length - 1 ? (
                <View style={styles.stepLine} />
              ) : null}
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  matchPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  matchText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondary,
  },
  roleChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  roleChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
  },
  roleChipText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: colors.onPrimary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeading: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  allSkillsMatched: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontStyle: "italic",
  },
  roadmapContainer: {
    marginTop: spacing.xs,
  },
  stepItem: {
    flexDirection: "row",
    minHeight: 48,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: spacing.md,
    width: 24,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
