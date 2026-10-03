import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { DuplicateMatch } from "../../utils/duplicateDetector";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export interface DuplicateWarningBannerProps {
  matches: DuplicateMatch[];
  onSelectExisting: (questionId: string) => void;
  style?: ViewStyle;
}

export const DuplicateWarningBanner: React.FC<DuplicateWarningBannerProps> = ({
  matches,
  onSelectExisting,
  style,
}) => {
  if (!matches || matches.length === 0) return null;

  const topMatch = matches[0];
  const similarityPct = Math.round(topMatch.similarity * 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Potential Duplicate Question ({similarityPct}% Similarity)
          </Text>
          <Text style={styles.subtitle}>
            A similar academic question may already have verified answers:
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.matchedCard}
        onPress={() => onSelectExisting(topMatch.question.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.matchedTitle} numberOfLines={2}>
          "{topMatch.question.title}"
        </Text>
        <View style={styles.matchedFooter}>
          <Text style={styles.matchedAnswers}>
            💬 {topMatch.question.answers?.length || 0} existing answers
          </Text>
          <Text style={styles.viewLink}>View Solution →</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warningBackground,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  alertIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    ...typography.labelLarge,
    color: colors.warningText,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  matchedCard: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.xs,
  },
  matchedTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  matchedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchedAnswers: {
    ...typography.caption,
    color: colors.textMuted,
  },
  viewLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});
