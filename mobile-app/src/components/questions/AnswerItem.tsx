import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import { Answer } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface AnswerItemProps {
  answer: Answer;
  isAuthorOfQuestion?: boolean;
  onAccept?: () => void;
  onVote?: () => void;
  style?: ViewStyle;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
  answer,
  isAuthorOfQuestion = false,
  onAccept,
  onVote,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        answer.isAccepted && styles.acceptedContainer,
        style,
      ]}
    >
      {/* Accepted Solution Banner */}
      {answer.isAccepted ? (
        <View style={styles.acceptedHeader}>
          <Text style={styles.acceptedCheck}>✓</Text>
          <Text style={styles.acceptedHeaderText}>Accepted Solution</Text>
        </View>
      ) : null}

      {/* Author Details */}
      <View style={styles.authorRow}>
        {answer.authorAvatar ? (
          <Image source={{ uri: answer.authorAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {answer.authorName ? answer.authorName[0] : "S"}
            </Text>
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{answer.authorName || "Contributing Scholar"}</Text>
          <Text style={styles.authorRole}>{answer.authorRole} • {answer.createdAt}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{answer.content}</Text>

      {/* Footer / Actions */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.voteBtn, answer.userVoted && styles.voteBtnActive]}
          onPress={onVote}
          activeOpacity={0.7}
        >
          <Text style={styles.voteArrow}>▲</Text>
          <Text style={styles.voteText}>{answer.votes} Helpful</Text>
        </TouchableOpacity>

        {isAuthorOfQuestion ? (
          <TouchableOpacity
            style={[styles.acceptBtn, answer.isAccepted && styles.acceptBtnActive]}
            onPress={onAccept}
            activeOpacity={0.7}
          >
            <Text style={[styles.acceptBtnText, answer.isAccepted && styles.acceptBtnTextActive]}>
              {answer.isAccepted ? "✓ Accepted" : "Mark as Accepted"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  acceptedContainer: {
    borderColor: colors.secondary,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  acceptedHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  acceptedCheck: {
    color: colors.secondary,
    fontWeight: "700",
    fontSize: 12,
    marginRight: 4,
  },
  acceptedHeaderText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
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
  },
  authorName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  authorRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
  content: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  voteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  voteBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  voteArrow: {
    fontSize: 10,
    color: colors.textSecondary,
    marginRight: 4,
  },
  voteText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  acceptBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptBtnActive: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondary,
  },
  acceptBtnText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  acceptBtnTextActive: {
    color: colors.secondary,
    fontWeight: "700",
  },
});
