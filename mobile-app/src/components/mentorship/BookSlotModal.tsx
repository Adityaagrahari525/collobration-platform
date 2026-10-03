import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MentorshipSlot } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export interface BookSlotModalProps {
  visible: boolean;
  slot: MentorshipSlot | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookSlotModal: React.FC<BookSlotModalProps> = ({
  visible,
  slot,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { bookMentorshipSlot } = useApp();

  const [purpose, setPurpose] = useState<string>("");
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!slot) return null;

  const handleConfirm = async () => {
    if (!purpose || purpose.trim().length < 10) {
      setError("Please describe the research inquiry you wish to discuss (min 10 characters).");
      return;
    }

    setError("");
    setIsBooking(true);

    try {
      await bookMentorshipSlot(slot.id, purpose.trim());
      Alert.alert(
        "Advisory Session Reserved! 📅",
        `Your 1-on-1 mentorship session with ${slot.facultyName} on "${slot.topic}" has been confirmed for ${slot.availableDate}.`,
        [{ text: "Done", onPress: onSuccess }]
      );
      setPurpose("");
      onClose();
    } catch (e: any) {
      Alert.alert("Booking Error", e.message || "Failed to book session.");
    } finally {
      setIsBooking(false);
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
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Book Faculty Advisory Slot</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {slot.facultyName} • {slot.institution}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Slot summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTopic}>{slot.topic}</Text>
            <Text style={styles.summaryMeta}>
              📅 {slot.availableDate} • ⏱️ {slot.durationMinutes} Minutes
            </Text>
          </View>

          {/* Purpose Input */}
          <Input
            label="What specific research question will you discuss?"
            placeholder="e.g., Guidance on low-latency raft consensus timeout dynamics for our IoT sensor cluster..."
            value={purpose}
            onChangeText={(t) => {
              setPurpose(t);
              if (error) setError("");
            }}
            multiline={true}
            numberOfLines={3}
            inputStyle={{ minHeight: 75, textAlignVertical: "top" }}
            error={error}
            helperText="Faculty mentors review the agenda prior to meeting."
          />

          {/* Student identifier */}
          <View style={styles.studentCard}>
            <Text style={styles.studentLabel}>Booking as Student Scholar:</Text>
            <Text style={styles.studentName}>{user?.name} ({user?.institution})</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title="Cancel"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Confirm Booking"
              variant="secondary"
              size="md"
              loading={isBooking}
              onPress={handleConfirm}
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
    padding: spacing.lg,
    ...shadows.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryTopic: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  summaryMeta: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "600",
  },
  studentCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  studentLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  studentName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    paddingTop: spacing.sm,
  },
});
