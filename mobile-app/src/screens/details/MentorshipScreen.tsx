import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { MentorshipSlot } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { MentorSlotCard } from "../../components/mentorship/MentorSlotCard";
import { BookSlotModal } from "../../components/mentorship/BookSlotModal";
import { useApp } from "../../context/AppContext";

export const MentorshipScreen = () => {
  const { mentorshipSlots, isRefreshing, fetchMentorshipSlots } = useApp();

  const [selectedSlot, setSelectedSlot] = useState<MentorshipSlot | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleOpenBooking = (slot: MentorshipSlot) => {
    setSelectedSlot(slot);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faculty Office Hours & Mentorship</Text>
        <Text style={styles.headerSubtitle}>
          Reserve 1-on-1 advisory sessions with leading university professors
        </Text>
      </View>

      <FlatList
        data={mentorshipSlots}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchMentorshipSlots}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <MentorSlotCard
            slot={item}
            onBook={() => handleOpenBooking(item)}
          />
        )}
      />

      <BookSlotModal
        visible={modalVisible}
        slot={selectedSlot}
        onClose={() => setModalVisible(false)}
        onSuccess={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
});
