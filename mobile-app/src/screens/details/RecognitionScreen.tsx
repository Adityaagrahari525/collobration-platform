import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export const RecognitionScreen = ({ navigation }: any) => {
  const { scholars } = useApp();
  const { user } = useAuth();

  const [tab, setTab] = useState<"national" | "campus">("national");

  const rankedScholars = useMemo(() => {
    let list = [...scholars];
    if (tab === "campus" && user?.institution) {
      list = list.filter((s) => s.institution.toLowerCase() === user.institution.toLowerCase());
    }
    return list.sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0));
  }, [scholars, tab, user]);

  const topThree = rankedScholars.slice(0, 3);
  const remaining = rankedScholars.slice(3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Honors & Leaderboard</Text>
        <Text style={styles.headerSubtitle}>
          Recognizing the top contributing scholars across research institutions
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "national" && styles.tabBtnActive]}
          onPress={() => setTab("national")}
        >
          <Text style={[styles.tabText, tab === "national" && styles.tabTextActive]}>
            National Rankings (All India)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "campus" && styles.tabBtnActive]}
          onPress={() => setTab("campus")}
        >
          <Text style={[styles.tabText, tab === "campus" && styles.tabTextActive]}>
            {user?.institution || "IIT Delhi"} Campus Rank
          </Text>
        </TouchableOpacity>
      </View>

      {/* Top 3 Podium */}
      {topThree.length >= 3 ? (
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <TouchableOpacity
            style={[styles.podiumCol, styles.podiumSecond]}
            onPress={() => navigation.navigate("PersonDetail", { id: topThree[1].id })}
            activeOpacity={0.8}
          >
            <Text style={styles.medalIcon}>🥈</Text>
            <Image source={{ uri: topThree[1].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName} numberOfLines={1}>
              {topThree[1].name.split(" ")[0]}
            </Text>
            <Text style={styles.podiumScore}>{topThree[1].contributionScore} pts</Text>
            <View style={styles.rankPill}>
              <Text style={styles.rankText}>#2</Text>
            </View>
          </TouchableOpacity>

          {/* 1st Place (Center / Tallest) */}
          <TouchableOpacity
            style={[styles.podiumCol, styles.podiumFirst]}
            onPress={() => navigation.navigate("PersonDetail", { id: topThree[0].id })}
            activeOpacity={0.8}
          >
            <Text style={styles.crownIcon}>👑</Text>
            <Text style={styles.medalIcon}>🥇</Text>
            <Image source={{ uri: topThree[0].avatar }} style={[styles.podiumAvatar, styles.avatarFirst]} />
            <Text style={styles.podiumName} numberOfLines={1}>
              {topThree[0].name.split(" ")[0]}
            </Text>
            <Text style={styles.podiumScore}>{topThree[0].contributionScore} pts</Text>
            <View style={[styles.rankPill, { backgroundColor: colors.xpGold }]}>
              <Text style={[styles.rankText, { color: "#ffffff" }]}>#1</Text>
            </View>
          </TouchableOpacity>

          {/* 3rd Place */}
          <TouchableOpacity
            style={[styles.podiumCol, styles.podiumThird]}
            onPress={() => navigation.navigate("PersonDetail", { id: topThree[2].id })}
            activeOpacity={0.8}
          >
            <Text style={styles.medalIcon}>🥉</Text>
            <Image source={{ uri: topThree[2].avatar }} style={styles.podiumAvatar} />
            <Text style={styles.podiumName} numberOfLines={1}>
              {topThree[2].name.split(" ")[0]}
            </Text>
            <Text style={styles.podiumScore}>{topThree[2].contributionScore} pts</Text>
            <View style={styles.rankPill}>
              <Text style={styles.rankText}>#3</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Remaining Leaderboard List */}
      <View style={styles.listCard}>
        <Text style={styles.listCardTitle}>Full Scholar Roster</Text>
        {rankedScholars.map((scholar, idx) => (
          <TouchableOpacity
            key={scholar.id}
            style={[
              styles.rosterRow,
              scholar.id === user?.id && styles.rosterRowCurrent,
            ]}
            onPress={() => navigation.navigate("PersonDetail", { id: scholar.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.rosterRank}>#{idx + 1}</Text>
            <Image source={{ uri: scholar.avatar }} style={styles.rosterAvatar} />
            <View style={styles.rosterInfo}>
              <Text style={styles.rosterName}>
                {scholar.name} {scholar.id === user?.id ? "(You)" : ""}
              </Text>
              <Text style={styles.rosterMeta}>
                {scholar.institution} • {scholar.department}
              </Text>
            </View>
            <Text style={styles.rosterScore}>{scholar.contributionScore} pts</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  podiumCol: {
    width: "30%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  podiumFirst: {
    height: 180,
    justifyContent: "flex-end",
    borderColor: colors.xpGold,
    backgroundColor: "#fffdfa",
  },
  podiumSecond: {
    height: 155,
    justifyContent: "flex-end",
  },
  podiumThird: {
    height: 140,
    justifyContent: "flex-end",
  },
  crownIcon: {
    fontSize: 16,
    marginBottom: -4,
  },
  medalIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  podiumAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceContainer,
    marginBottom: 4,
  },
  avatarFirst: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.xpGold,
  },
  podiumName: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  podiumScore: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
  rankPill: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: 4,
  },
  rankText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  listCardTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  rosterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rosterRowCurrent: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xs,
  },
  rosterRank: {
    ...typography.labelLarge,
    color: colors.textMuted,
    width: 28,
  },
  rosterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainer,
    marginRight: spacing.sm,
  },
  rosterInfo: {
    flex: 1,
  },
  rosterName: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  rosterMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rosterScore: {
    ...typography.labelLarge,
    color: colors.secondary,
    fontWeight: "700",
  },
});
