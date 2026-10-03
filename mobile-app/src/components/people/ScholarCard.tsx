import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import { User } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Badge } from "../common/Badge";
import { SkillTag } from "../common/SkillTag";

export interface ScholarCardProps {
  scholar: User;
  onPress: () => void;
  onMessagePress?: () => void;
  style?: ViewStyle;
}

export const ScholarCard: React.FC<ScholarCardProps> = ({
  scholar,
  onPress,
  onMessagePress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          {scholar.avatar ? (
            <Image source={{ uri: scholar.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {scholar.name ? scholar.name[0] : "S"}
              </Text>
            </View>
          )}
          {scholar.verified ? (
            <View style={styles.verifiedDot}>
              <Text style={styles.verifiedCheck}>✓</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.nameBadgeRow}>
            <Text style={styles.name} numberOfLines={1}>
              {scholar.name}
            </Text>
            <Badge
              label={scholar.role === "faculty" ? "Faculty" : "Student"}
              variant={scholar.role === "faculty" ? "secondary" : "primary"}
              size="sm"
            />
          </View>

          <Text style={styles.institutionText} numberOfLines={1}>
            {scholar.institution}
          </Text>
          <Text style={styles.degreeText} numberOfLines={1}>
            {scholar.department} • {scholar.degree || (scholar.role === "faculty" ? "Professor" : "B.Tech")}
          </Text>
        </View>
      </View>

      {/* Bio snippet */}
      {scholar.bio ? (
        <Text style={styles.bioText} numberOfLines={2}>
          {scholar.bio}
        </Text>
      ) : null}

      {/* Skills */}
      <View style={styles.skillsRow}>
        {scholar.skills.slice(0, 3).map((skill) => (
          <SkillTag key={skill} skill={skill} variant="neutral" />
        ))}
        {scholar.skills.length > 3 ? (
          <Text style={styles.moreSkills}>+{scholar.skills.length - 3}</Text>
        ) : null}
      </View>

      {/* Footer: Contribution Score & Message Action */}
      <View style={styles.footerRow}>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreIcon}>⭐</Text>
          <Text style={styles.scoreText}>
            {scholar.contributionScore} Contribution Pts
          </Text>
        </View>

        {onMessagePress ? (
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={onMessagePress}
            activeOpacity={0.7}
          >
            <Text style={styles.messageBtnText}>Message 💬</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 18,
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  verifiedCheck: {
    color: colors.onSecondary,
    fontSize: 9,
    fontWeight: "800",
  },
  detailsContainer: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  institutionText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: "600",
  },
  degreeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bioText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  scoreText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  messageBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  messageBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});
