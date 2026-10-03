import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import { MentorshipSlot } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Button } from "../common/Button";

export interface MentorSlotCardProps {
  slot: MentorshipSlot;
  onBook: () => void;
  style?: ViewStyle;
}

export const MentorSlotCard: React.FC<MentorSlotCardProps> = ({
  slot,
  onBook,
  style,
}) => {
  const isFull = slot.bookedCount >= slot.maxCapacity;

  return (
    <View style={[styles.card, style]}>
      {/* Faculty Profile */}
      <View style={styles.facultyRow}>
        {slot.facultyAvatar ? (
          <Image source={{ uri: slot.facultyAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{slot.facultyName[0]}</Text>
          </View>
        )}
        <View style={styles.facultyInfo}>
          <Text style={styles.facultyName}>{slot.facultyName}</Text>
          <Text style={styles.facultyRole}>
            {slot.facultyRole} • {slot.institution}
          </Text>
        </View>
      </View>

      {/* Advisory Topic */}
      <View style={styles.topicSection}>
        <Text style={styles.topicLabel}>Advisory Topic:</Text>
        <Text style={styles.topicText}>{slot.topic}</Text>
      </View>

      {/* Timing and Capacity */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={styles.metaText}>{slot.availableDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⏱️</Text>
          <Text style={styles.metaText}>{slot.durationMinutes} mins</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>👥</Text>
          <Text style={styles.metaText}>
            {slot.bookedCount}/{slot.maxCapacity} Booked
          </Text>
        </View>
      </View>

      {/* Action */}
      <Button
        title={isFull ? "Slot Fully Booked" : "Book Advisory Session"}
        variant={isFull ? "outline" : "secondary"}
        size="sm"
        disabled={isFull}
        onPress={onBook}
        style={styles.bookBtn}
      />
    </View>
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
  facultyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onSecondary,
    fontWeight: "700",
    fontSize: 16,
  },
  facultyInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  facultyName: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  facultyRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
  topicSection: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  topicLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 2,
  },
  topicText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.sm,
    marginVertical: 2,
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  bookBtn: {
    marginTop: spacing.xs,
  },
});
