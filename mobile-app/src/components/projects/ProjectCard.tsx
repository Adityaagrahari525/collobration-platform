import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import { Project } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { MatchScoreBadge } from "../common/MatchScoreBadge";
import { SkillTag } from "../common/SkillTag";
import { Badge } from "../common/Badge";
import { useAuth } from "../../context/AuthContext";
import { computeCompatibility } from "../../utils/matchingAlgorithm";

export interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  style?: ViewStyle;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  style,
}) => {
  const { user } = useAuth();
  const matchScore = computeCompatibility(user || {}, project);

  const getStatusBadgeVariant = () => {
    switch (project.status) {
      case "Recruiting":
        return "secondary";
      case "In Progress":
      case "Active Sprint 4":
        return "primary";
      default:
        return "neutral";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header: Status and Match Score */}
      <View style={styles.topRow}>
        <Badge
          label={project.status || "Recruiting"}
          variant={getStatusBadgeVariant()}
          size="sm"
        />
        <MatchScoreBadge score={matchScore} size="sm" />
      </View>

      {/* Title & Tagline */}
      <Text style={styles.title} numberOfLines={2}>
        {project.title}
      </Text>
      <Text style={styles.tagline} numberOfLines={2}>
        {project.tagline || project.description}
      </Text>

      {/* Institution / Lead Info */}
      <View style={styles.institutionRow}>
        <Text style={styles.instIcon}>🏛️</Text>
        <Text style={styles.instText} numberOfLines={1}>
          {project.institution}
        </Text>
      </View>

      {/* Required Skills */}
      <View style={styles.skillsRow}>
        {project.skillsRequired.slice(0, 3).map((skill) => (
          <SkillTag key={skill} skill={skill} variant="primary" />
        ))}
        {project.skillsRequired.length > 3 ? (
          <Text style={styles.moreSkills}>+{project.skillsRequired.length - 3}</Text>
        ) : null}
      </View>

      {/* Footer: Team Avatars & Open Roles */}
      <View style={styles.footerRow}>
        <View style={styles.teamAvatars}>
          {project.team.slice(0, 3).map((member, idx) => (
            <View
              key={idx}
              style={[
                styles.avatarWrapper,
                idx > 0 && { marginLeft: -8 },
              ]}
            >
              {member.avatar ? (
                <Image source={{ uri: member.avatar }} style={styles.teamAvatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{member.name[0]}</Text>
                </View>
              )}
            </View>
          ))}
          <Text style={styles.teamCountText}>
            {project.team.length} {project.team.length === 1 ? "member" : "members"}
          </Text>
        </View>

        {project.openRoles && project.openRoles.length > 0 ? (
          <View style={styles.openRolesBadge}>
            <Text style={styles.openRolesText}>
              {project.openRoles.length} open {project.openRoles.length === 1 ? "role" : "roles"}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  institutionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  instIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  instText: {
    ...typography.caption,
    color: colors.textMuted,
    flex: 1,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  moreSkills: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  teamAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.surface,
    overflow: "hidden",
  },
  teamAvatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onPrimary,
    fontSize: 10,
    fontWeight: "700",
  },
  teamCountText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 8,
  },
  openRolesBadge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  openRolesText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
});
