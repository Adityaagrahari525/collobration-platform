import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { DuplicateWarningBanner } from "../../components/questions/DuplicateWarningBanner";
import { findSimilarQuestions } from "../../utils/duplicateDetector";
import { useApp } from "../../context/AppContext";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Distributed Systems",
  "Machine Learning / Systems",
  "Robotics & Control Systems",
  "Electronics & Communication",
  "Biotechnology & Bioinformatics",
];

export const AskQuestionScreen = ({ navigation }: any) => {
  const { questions, createQuestion } = useApp();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [tagsInput, setTagsInput] = useState<string>("Distributed Systems, Consensus");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time Jaccard duplicate detection
  const duplicateMatches = useMemo(() => {
    return findSimilarQuestions(title, questions, 0.35);
  }, [title, questions]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!title || title.trim().length < 10) {
      newErrors.title = "Question title must be at least 10 characters.";
    }

    if (!description || description.trim().length < 20) {
      newErrors.description = "Please provide detailed inquiry background (min 20 chars).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const created = await createQuestion({
        title: title.trim(),
        description: description.trim(),
        department,
        subject: department,
        tags: tags.length > 0 ? tags : ["General Academic"],
        isAnonymous,
      });

      Alert.alert(
        "Question Published! 🎉",
        "Your inquiry has been submitted to the academic peer network (+5 XP).",
        [
          {
            text: "View Question",
            onPress: () => {
              navigation.replace("QuestionDetail", { id: created.id });
            },
          },
        ]
      );
    } catch (e: any) {
      Alert.alert("Submission Error", e.message || "Failed to publish question.");
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ask Academic Question</Text>
          <Text style={styles.headerSubtitle}>
            Submit your research challenge for review by verified university scholars
          </Text>
        </View>

        {/* Live Duplicate Warning Banner */}
        <DuplicateWarningBanner
          matches={duplicateMatches}
          onSelectExisting={(qId) => navigation.navigate("QuestionDetail", { id: qId })}
        />

        <View style={styles.formCard}>
          {/* Question Title */}
          <Input
            label="Question Title"
            placeholder="e.g. How to optimize raft consensus heartbeats in high packet loss mesh networks?"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((e) => ({ ...e, title: "" }));
            }}
            error={errors.title}
            helperText="Clear, concise, and academically specific."
          />

          {/* Department Picker */}
          <Text style={styles.fieldLabel}>Academic Department / Field</Text>
          <View style={styles.deptOptions}>
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.deptPill,
                  department === dept && styles.deptPillActive,
                ]}
                onPress={() => setDepartment(dept)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.deptPillText,
                    department === dept && styles.deptPillTextActive,
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Detailed Description */}
          <Input
            label="Technical Inquiry Background"
            placeholder="Provide context on your research setup, benchmark configurations, observed errors, and what solutions you have already attempted..."
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (errors.description) setErrors((e) => ({ ...e, description: "" }));
            }}
            multiline={true}
            numberOfLines={6}
            inputStyle={{ minHeight: 130, textAlignVertical: "top" }}
            error={errors.description}
          />

          {/* Tags */}
          <Input
            label="Tags (Comma separated)"
            placeholder="Distributed Systems, Raft, C++, Mesh"
            value={tagsInput}
            onChangeText={setTagsInput}
            helperText="Add relevant keywords to help subject-matter experts find your query."
          />

          {/* Anonymous Toggle */}
          <View style={styles.anonToggleRow}>
            <View style={styles.anonTextContainer}>
              <Text style={styles.anonTitle}>Post Anonymously</Text>
              <Text style={styles.anonSubtitle}>
                Hides your identity from the public feed while preserving your internal contribution points.
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: colors.surfaceContainer, true: colors.primaryLight }}
              thumbColor={isAnonymous ? colors.primary : colors.surface}
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Publish Question (+5 XP)"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            onPress={handleSubmit}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  fieldLabel: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  deptOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  deptPill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  deptPillActive: {
    backgroundColor: colors.primary,
  },
  deptPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  deptPillTextActive: {
    color: colors.onPrimary,
  },
  anonToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  anonTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  anonTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  anonSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});
