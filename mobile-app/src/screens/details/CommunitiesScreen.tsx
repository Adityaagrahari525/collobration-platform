import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import { CommunityCard } from "../../components/communities/CommunityCard";
import { useApp } from "../../context/AppContext";

export const CommunitiesScreen = () => {
  const { communities, isRefreshing, fetchCommunities, toggleJoinCommunity } = useApp();

  const handleToggleJoin = async (communityId: string, name: string) => {
    await toggleJoinCommunity(communityId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Research Consortia & Hubs</Text>
        <Text style={styles.headerSubtitle}>
          National inter-campus research collectives and specialized academic domains
        </Text>
      </View>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchCommunities}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <CommunityCard
            community={item}
            onPress={() => {
              Alert.alert(
                item.name,
                `${item.description}\n\nTopics: ${item.topics.join(", ")}\n\nActive Scholars: ${item.membersCount}`
              );
            }}
            onToggleJoin={() => handleToggleJoin(item.id, item.name)}
          />
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
});
