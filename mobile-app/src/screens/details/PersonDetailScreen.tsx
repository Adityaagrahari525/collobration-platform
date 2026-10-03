import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Badge } from "../../components/common/Badge";
import { MatchScoreBadge } from "../../components/common/MatchScoreBadge";
import { SkillTag } from "../../components/common/SkillTag";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { computeCompatibility, buildMatchExplanation } from "../../utils/matchingAlgorithm";

export const PersonDetailScreen = ({ route, navigation }: any) => {
  const { id } = route.params || {};
  const { user } = useAuth();
  const { scholars } = useApp();

  const scholar = scholars.find((s) => s.id === id);

  if (!scholar) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Scholar profile not found.</Text>
        <Button title="Back to Directory" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const matchScore = computeCompatibility(user || {}, scholar);
  const matchExplanation = buildMatchExplanation(user || {}, scholar);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View style={styles.card}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            {scholar.avatar ? (
              <Image source={{ uri: scholar.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{scholar.name[0]}</Text>
              </View>
            )}
            {scholar.verified ? (
              <View style={styles.verifiedDot}>
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.details}>
            <Text style={styles.name}>{scholar.name}</Text>
            <Text style={styles.institution}>{scholar.institution}</Text>
            <Text style={styles.department}>
              {scholar.department} • {scholar.degree || (scholar.role === "faculty" ? "Professor" : "Student")}
            </Text>
            <View style={styles.badgesRow}>
              <Badge
                label={scholar.role === "faculty" ? "Faculty Mentor" : "Student Researcher"}
                variant={scholar.role === "faculty" ? "secondary" : "primary"}
                size="sm"
              />
              <Badge
                label={scholar.verificationCode || "#IN-VERIFIED"}
                variant="outline"
                size="sm"
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>
        </View>

        {/* Bio */}
        {scholar.bio ? <Text style={styles.bio}>{scholar.bio}</Text> : null}

        {/* Compatibility with Current Scholar */}
        <View style={styles.matchCallout}>
          <View style={styles.matchRow}>
            <Text style={styles.matchTitle}>Collaboration Compatibility:</Text>
            <MatchScoreBadge score={matchScore} size="sm" />
          </View>
          <Text style={styles.matchText}>{matchExplanation}</Text>
        </View>

        {/* Action Button */}
        <Button
          title={`Message ${scholar.name.split(" ")[0]} 💬`}
          variant="primary"
          size="md"
          onPress={() => navigation.navigate("Chat", { participantId: scholar.id, name: scholar.name })}
          style={styles.messageBtn}
        />
      </View>

      {/* Skills */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Technical Expertise</Text>
        <View style={styles.skillsRow}>
          {scholar.skills.map((skill) => (
            <SkillTag key={skill} skill={skill} variant="primary" />
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Academic Contributions</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{scholar.contributionScore}</Text>
            <Text style={styles.statLabel}>Contribution Pts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{scholar.answersCount || 0}</Text>
            <Text style={styles.statLabel}>Verified Answers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{scholar.projectsCount || 0}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>
      </View>

      {/* Endorsements */}
      {scholar.endorsements && scholar.endorsements.length > 0 ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Faculty & Peer Endorsements</Text>
          {scholar.endorsements.map((end) => (
            <View key={end.id} style={styles.endorsementItem}>
              <Text style={styles.endorsementIcon}>📜</Text>
              <View style={styles.endorsementTextWrap}>
                <Text style={styles.endorsementNote}>"{end.note}"</Text>
                <Text style={styles.endorsementBy}>
                  — {end.by} ({end.role})
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceContainer,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.onPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  verifiedCheck: {
    color: colors.onSecondary,
    fontSize: 10,
    fontWeight: "800",
  },
  details: {
    flex: 1,
  },
  name: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  institution: {
    ...typography.labelLarge,
    color: colors.primary,
    fontWeight: "600",
  },
  department: {
    ...typography.caption,
    color: colors.textMuted,
  },
  badgesRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  bio: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginVertical: spacing.sm,
  },
  matchCallout: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  matchTitle: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  matchText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  messageBtn: {
    marginTop: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    width: "31%",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  statValue: {
    ...typography.titleLarge,
    color: colors.primary,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  endorsementItem: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  endorsementIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  endorsementTextWrap: {
    flex: 1,
  },
  endorsementNote: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: "italic",
    lineHeight: 18,
  },
  endorsementBy: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
    marginTop: 4,
  },
});
