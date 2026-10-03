import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Project } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { MatchScoreBadge } from "../common/MatchScoreBadge";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { computeCompatibility, buildMatchExplanation } from "../../utils/matchingAlgorithm";

export interface ApplyModalProps {
  visible: boolean;
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  visible,
  project,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { applyToProject } = useApp();

  const availableRoles = project.openRoles && project.openRoles.length > 0
    ? project.openRoles
    : ["Research Collaborator", "Systems Engineer", "Data Specialist"];

  const [selectedRole, setSelectedRole] = useState<string>(availableRoles[0]);
  const [pitch, setPitch] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pitchError, setPitchError] = useState<string>("");

  const matchScore = computeCompatibility(user || {}, project);
  const matchExplanation = buildMatchExplanation(user || {}, project);

  const handleApply = async () => {
    if (!pitch || pitch.trim().length < 20) {
      setPitchError("Please provide a pitch of at least 20 characters explaining your contribution.");
      return;
    }

    setPitchError("");
    setIsSubmitting(true);

    try {
      await applyToProject(project.id, selectedRole, pitch.trim(), matchScore);
      Alert.alert(
        "Application Submitted! 🎉",
        `Your pitch for '${selectedRole}' has been sent to ${project.lead}. You earned +10 contribution points.`,
        [{ text: "Great", onPress: onSuccess }]
      );
      setPitch("");
      onClose();
    } catch (e: any) {
      Alert.alert("Submission Error", e.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Join Research Team</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>
                {project.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Compatibility overview */}
            <View style={styles.matchContainer}>
              <View style={styles.matchTop}>
                <Text style={styles.matchLabel}>Your Algorithmic Match:</Text>
                <MatchScoreBadge score={matchScore} size="sm" />
              </View>
              <Text style={styles.matchExplanation}>{matchExplanation}</Text>
            </View>

            {/* Role Selection */}
            <Text style={styles.fieldLabel}>Select Role to Apply For:</Text>
            <View style={styles.rolesRow}>
              {availableRoles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.rolePill,
                    selectedRole === role && styles.rolePillActive,
                  ]}
                  onPress={() => setSelectedRole(role)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.rolePillText,
                      selectedRole === role && styles.rolePillTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pitch input */}
            <Input
              label="Why are you a great fit for this project?"
              placeholder="Detail your relevant experience, technical background, and how much time you can dedicate..."
              value={pitch}
              onChangeText={(t) => {
                setPitch(t);
                if (pitchError) setPitchError("");
              }}
              multiline={true}
              numberOfLines={4}
              inputStyle={{ minHeight: 90, textAlignVertical: "top" }}
              error={pitchError}
              helperText="Min 20 characters required."
            />

            {/* Applicant Summary */}
            <View style={styles.applicantPreview}>
              <Text style={styles.previewHeading}>Submitting as:</Text>
              <Text style={styles.previewName}>{user?.name}</Text>
              <Text style={styles.previewMeta}>
                {user?.institution} • {user?.department}
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Submit Pitch"
              variant="primary"
              size="md"
              loading={isSubmitting}
              onPress={handleApply}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "85%",
    padding: spacing.lg,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
  },
  modalTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    maxWidth: 260,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "700",
  },
  modalBody: {
    marginVertical: spacing.xs,
  },
  matchContainer: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  matchTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  matchLabel: {
    ...typography.labelSmall,
    color: colors.textPrimary,
  },
  matchExplanation: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  fieldLabel: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  rolesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  rolePill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  rolePillActive: {
    backgroundColor: colors.primary,
  },
  rolePillText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  rolePillTextActive: {
    color: colors.onPrimary,
    fontWeight: "700",
  },
  applicantPreview: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  previewHeading: {
    ...typography.caption,
    color: colors.textMuted,
  },
  previewName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginTop: 2,
  },
  previewMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modalFooter: {
    flexDirection: "row",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
