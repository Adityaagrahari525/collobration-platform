import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { AnswerItem } from "../../components/questions/AnswerItem";
import { SkillTag } from "../../components/common/SkillTag";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export const QuestionDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params || {};
  const { user } = useAuth();
  const {
    questions,
    voteQuestion,
    addAnswer,
    acceptAnswer,
    toggleSaveQuestion,
    savedQuestionIds,
  } = useApp();

  const question = questions.find((q) => q.id === id);

  const [newAnswer, setNewAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!question) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Question not found or removed.</Text>
        <Button title="Back to Feed" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const isAuthor = user?.id === question.authorId;
  const isBookmarked = savedQuestionIds.includes(question.id);

  const handleSubmitAnswer = async () => {
    if (!newAnswer || newAnswer.trim().length < 15) {
      setError("Please provide a constructive answer of at least 15 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await addAnswer(question.id, newAnswer.trim());
      setNewAnswer("");
      Alert.alert("Answer Published! ⭐", "Thank you for contributing. You earned +10 points & XP!");
    } catch (e: any) {
      Alert.alert("Submission Error", e.message || "Failed to submit answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Question Card */}
        <View style={styles.questionCard}>
          {/* Author Header */}
          <View style={styles.authorRow}>
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
              <Text style={styles.authorName}>
                {question.isAnonymous ? "Anonymous Scholar" : question.authorName}
              </Text>
              <Text style={styles.metaText}>
                {question.department} • {question.createdAt}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bookmarkBtn}
              onPress={() => toggleSaveQuestion(question.id)}
            >
              <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarked]}>
                {isBookmarked ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>{question.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{question.description}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {question.tags.map((tag) => (
              <SkillTag key={tag} skill={tag} variant="neutral" />
            ))}
          </View>

          {/* Upvote & Solved status row */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={[styles.voteButton, question.userVoted && styles.voteButtonActive]}
              onPress={() => voteQuestion(question.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.voteIcon, question.userVoted && styles.voteIconActive]}>
                ▲
              </Text>
              <Text style={[styles.voteCount, question.userVoted && styles.voteTextActive]}>
                {question.votes} Helpful Upvotes
              </Text>
            </TouchableOpacity>

            <Text style={styles.answersBadgeText}>
              💬 {question.answers?.length || 0} Answers
            </Text>
          </View>
        </View>

        {/* Answers Thread Header */}
        <View style={styles.threadHeader}>
          <Text style={styles.threadTitle}>
            Answers & Solutions ({question.answers?.length || 0})
          </Text>
        </View>

        {/* Answers List */}
        {question.answers && question.answers.length > 0 ? (
          question.answers.map((answer) => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              isAuthorOfQuestion={isAuthor}
              onAccept={() => acceptAnswer(question.id, answer.id)}
            />
          ))
        ) : (
          <View style={styles.noAnswersCard}>
            <Text style={styles.noAnswersIcon}>💡</Text>
            <Text style={styles.noAnswersText}>
              No peer answers yet. Be the first academic to solve this inquiry!
            </Text>
          </View>
        )}

        {/* Submit Answer Form */}
        <View style={styles.answerFormCard}>
          <Text style={styles.formTitle}>Submit Academic Answer</Text>
          <Text style={styles.formSubtitle}>
            Provide detailed rationale, code snippets, or peer citations.
          </Text>

          <Input
            placeholder="Write your constructive response here..."
            value={newAnswer}
            onChangeText={(t) => {
              setNewAnswer(t);
              if (error) setError("");
            }}
            multiline={true}
            numberOfLines={5}
            inputStyle={{ minHeight: 110, textAlignVertical: "top" }}
            error={error}
          />

          <Button
            title="Post Answer (+10 XP)"
            variant="primary"
            size="md"
            loading={isSubmitting}
            onPress={handleSubmitAnswer}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  authorInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bookmarkBtn: {
    padding: 6,
  },
  bookmarkIcon: {
    fontSize: 22,
    color: colors.textLight,
  },
  bookmarked: {
    color: colors.xpGold,
  },
  title: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  voteButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  voteIcon: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 6,
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
  answersBadgeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "600",
  },
  threadHeader: {
    marginBottom: spacing.sm,
  },
  threadTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  noAnswersCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  noAnswersIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  noAnswersText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: "center",
  },
  answerFormCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  formTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  formSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
});
