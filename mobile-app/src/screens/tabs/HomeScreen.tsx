import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Header } from "../../components/common/Header";
import { XPProgressBar } from "../../components/gamification/XPProgressBar";
import { QuestionCard } from "../../components/questions/QuestionCard";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const {
    questions,
    projects,
    isRefreshing,
    refreshAll,
    savedQuestionIds,
    toggleSaveQuestion,
    voteQuestion,
  } = useApp();

  const trendingQuestions = questions.slice(0, 3);
  const featuredProjects = projects.slice(0, 2);

  return (
    <View style={styles.container}>
      <Header
        onAvatarPress={() => navigation.navigate("ProfileTab")}
        onNotificationPress={() => navigation.navigate("Notifications")}
        onStreakPress={() => navigation.navigate("Contribution")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
      >
        {/* Verification Status Card */}
        {user?.verified ? (
          <View style={styles.verifiedCard}>
            <Text style={styles.verifiedIcon}>🛡️</Text>
            <View style={styles.verifiedTextContainer}>
              <Text style={styles.verifiedTitle}>
                {user.role === "faculty" ? "Faculty Advisor Verified" : "Academic Student Verified"}
              </Text>
              <Text style={styles.verifiedCode}>
                Auth Key: {user.verificationCode || "#IN-VERIFIED"} • {user.institution}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Gamification Level Progression */}
        <XPProgressBar xp={user?.xpPoints || user?.contributionScore || 0} />

        {/* Quick Action Shortcuts */}
        <View style={styles.shortcutsContainer}>
          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate("AskQuestion")}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.shortcutIcon}>❓</Text>
            </View>
            <Text style={styles.shortcutLabel}>Ask Question</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate("Mentorship")}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.shortcutIcon}>👨‍🏫</Text>
            </View>
            <Text style={styles.shortcutLabel}>Mentorship</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate("Communities")}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.surfaceContainer }]}>
              <Text style={styles.shortcutIcon}>🌐</Text>
            </View>
            <Text style={styles.shortcutLabel}>Consortia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate("Recognition")}
            activeOpacity={0.8}
          >
            <View style={[styles.shortcutIconWrap, { backgroundColor: colors.tertiaryLight }]}>
              <Text style={styles.shortcutIcon}>🏆</Text>
            </View>
            <Text style={styles.shortcutLabel}>Leaderboard</Text>
          </TouchableOpacity>
        </View>

        {/* Active Research Projects Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Inter-Campus Research Projects</Text>
            <Text style={styles.sectionSubtitle}>Collaborative labs actively recruiting</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ProjectsTab")}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onPress={() => navigation.navigate("ProjectDetail", { id: project.id })}
          />
        ))}

        {/* Trending Q&A Discussions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Academic Inquiries</Text>
            <Text style={styles.sectionSubtitle}>Peer-validated technical questions</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("QuestionsTab")}>
            <Text style={styles.seeAllText}>Explore Feed →</Text>
          </TouchableOpacity>
        </View>

        {trendingQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            isBookmarked={savedQuestionIds.includes(q.id)}
            onPress={() => navigation.navigate("QuestionDetail", { id: q.id })}
            onVote={() => voteQuestion(q.id)}
            onBookmark={() => toggleSaveQuestion(q.id)}
          />
        ))}
      </ScrollView>
    </View>
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
  verifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
    marginBottom: spacing.md,
  },
  verifiedIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  verifiedTextContainer: {
    flex: 1,
  },
  verifiedTitle: {
    ...typography.labelLarge,
    color: colors.secondary,
  },
  verifiedCode: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  shortcutsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  shortcutItem: {
    alignItems: "center",
    width: "23%",
  },
  shortcutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    ...shadows.sm,
  },
  shortcutIcon: {
    fontSize: 22,
  },
  shortcutLabel: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  seeAllText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});
