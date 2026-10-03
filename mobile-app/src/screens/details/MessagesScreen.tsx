import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Conversation } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";

export const MessagesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadConversations = async () => {
    if (!user) return;
    const data = await dbService.getConversations(user);
    setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Messages</Text>
        <Text style={styles.headerSubtitle}>
          Direct research communication with peers and faculty advisors
        </Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.convCard}
            onPress={() =>
              navigation.navigate("Chat", {
                participantId: item.participantId,
                name: item.participantName,
              })
            }
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.participantAvatar }}
              style={styles.avatar}
            />
            <View style={styles.convDetails}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{item.participantName}</Text>
                <Text style={styles.timestamp}>{item.lastMessageTimestamp}</Text>
              </View>
              <Text style={styles.role}>{item.participantRole}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
  convCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    ...shadows.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainer,
    marginRight: spacing.md,
  },
  convDetails: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  role: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  lastMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
