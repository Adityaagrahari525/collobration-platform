import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import { Question } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { SkillTag } from "../common/SkillTag";

export interface QuestionCardProps {
  question: Question;
  onPress: () => void;
  onVote?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  style?: ViewStyle;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onPress,
  onVote,
  onBookmark,
  isBookmarked = false,
  style,
}) => {
  const hasAccepted = question.answers?.some((a) => a.isAccepted);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header: Author & Date */}
      <View style={styles.headerRow}>
        <View style={styles.authorSection}>
          {question.authorAvatar && !question.isAnonymous ? (
            <Image source={{ uri: question.authorAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {question.isAnonymous ? "👤" : question.authorName ? question.authorName[0] : "S"}
              </Text>
            </View>
          )}
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>
                {question.isAnonymous ? "Anonymous Scholar" : question.authorName}
              </Text>
              {question.staffVerified ? (
                <Text style={styles.verifiedBadge}>✓</Text>
              ) : null}
            </View>
            <Text style={styles.dateText}>
              {question.department} • {question.createdAt}
            </Text>
          </View>
        </View>

        {onBookmark ? (
          <TouchableOpacity
            onPress={onBookmark}
            style={styles.bookmarkBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarked]}>
              {isBookmarked ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Question Title & Description Preview */}
      <Text style={styles.title} numberOfLines={2}>
        {question.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {question.description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {question.tags.slice(0, 3).map((tag) => (
          <SkillTag key={tag} skill={tag} variant="neutral" />
        ))}
        {question.tags.length > 3 ? (
          <Text style={styles.moreTags}>+{question.tags.length - 3} more</Text>
        ) : null}
      </View>

      {/* Footer: Upvotes & Answers count */}
      <View style={styles.footerRow}>
        <View style={styles.statsSection}>
          <TouchableOpacity
            style={[styles.voteButton, question.userVoted && styles.voteButtonActive]}
            onPress={onVote}
            activeOpacity={0.7}
          >
            <Text style={[styles.voteIcon, question.userVoted && styles.voteIconActive]}>
              ▲
            </Text>
            <Text style={[styles.voteCount, question.userVoted && styles.voteTextActive]}>
              {question.votes}
            </Text>
          </TouchableOpacity>

          <View style={[styles.answersBadge, hasAccepted && styles.answersBadgeAccepted]}>
            <Text style={styles.answersIcon}>💬</Text>
            <Text style={[styles.answersCount, hasAccepted && styles.answersCountAccepted]}>
              {question.answers?.length || 0} answers
            </Text>
          </View>
        </View>

        {hasAccepted ? (
          <View style={styles.solvedPill}>
            <Text style={styles.solvedText}>✓ Solved</Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  authorInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  verifiedBadge: {
    marginLeft: 4,
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 12,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bookmarkBtn: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 18,
    color: colors.textLight,
  },
  bookmarked: {
    color: colors.xpGold,
  },
  title: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  moreTags: {
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
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  voteButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  voteIcon: {
    fontSize: 10,
    color: colors.textMuted,
    marginRight: 4,
  },
  voteIconActive: {
    color: colors.primary,
  },
  voteCount: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  voteTextActive: {
    color: colors.primary,
  },
  answersBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  answersBadgeAccepted: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  answersIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  answersCount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  answersCountAccepted: {
    color: colors.secondary,
    fontWeight: "700",
  },
  solvedPill: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  solvedText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
});
