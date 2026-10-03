import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Community } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { SkillTag } from "../common/SkillTag";
import { Button } from "../common/Button";

export interface CommunityCardProps {
  community: Community;
  onPress: () => void;
  onToggleJoin: () => void;
  style?: ViewStyle;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
  onToggleJoin,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🌐</Text>
        </View>
        <View style={styles.titleInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {community.name}
          </Text>
          <Text style={styles.institution} numberOfLines={1}>
            {community.institution}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {community.description}
      </Text>

      {/* Topics */}
      <View style={styles.topicsRow}>
        {community.topics.slice(0, 3).map((topic) => (
          <SkillTag key={topic} skill={topic} variant="neutral" />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.membersCount}>
          👥 {community.membersCount} Research Scholars
        </Text>
        <Button
          title={community.joined ? "Joined ✓" : "Join Hub"}
          variant={community.joined ? "outline" : "primary"}
          size="sm"
          onPress={onToggleJoin}
          style={styles.joinBtn}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 20,
  },
  titleInfo: {
    flex: 1,
  },
  name: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  institution: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  topicsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  membersCount: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  joinBtn: {
    minWidth: 90,
  },
});
