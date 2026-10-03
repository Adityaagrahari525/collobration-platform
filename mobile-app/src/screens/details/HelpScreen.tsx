import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";

const FAQ_ITEMS = [
  {
    q: "How does the Heuristic Skill Matching algorithm calculate compatibility?",
    a: "Our skill-matching algorithm computes a weighted compatibility score (0-100%) between your verified profile and research project requirements. It factors in core skill overlap (up to 35 pts), complementary skill gaps (up to 20 pts), experience deltas (25 pts), and time availability (20 pts).",
  },
  {
    q: "How do faculty office hours and mentorship bookings work?",
    a: "Faculty mentors post recurring advisory slots with designated research focus areas. Students can reserve a 1-on-1 slot by providing an academic agenda pitch. Once confirmed, you will receive notifications with meeting details.",
  },
  {
    q: "What is Jaccard Token Duplicate Detection on Ask Question?",
    a: "To prevent fragmentation and duplicate questions in the peer forum, CampusLink tokenizes your inquiry title in real-time, strips common stop-words, and calculates Jaccard set overlap against existing questions. If similarity exceeds 35%, a helpful banner links you directly to existing answers.",
  },
  {
    q: "How are reputation points and XP tiers calculated?",
    a: "Points are earned transparently: +10 pts for accepted solutions, +20 pts for joining approved research projects, +15 pts for faculty endorsements, and +5 pts for questions. As your XP grows, you advance across 6 academic tiers from 'Novice Academic' to 'Academic Fellow'.",
  },
  {
    q: "Is CampusLink available across different Indian universities?",
    a: "Yes! CampusLink is an inter-institutional consortium connecting IIT Delhi, IISc Bangalore, IIT Bombay, IIIT Hyderabad, BITS Pilani, NIT Trichy, and partner national research laboratories.",
  },
];

export const HelpScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Help & FAQ</Text>
        <Text style={styles.headerSubtitle}>
          Platform guidelines, scoring rules & collaboration standards
        </Text>
      </View>

      <View style={styles.faqCard}>
        {FAQ_ITEMS.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <View key={idx} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(idx)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.q}</Text>
                <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
              </TouchableOpacity>
              {isExpanded ? (
                <Text style={styles.answerText}>{item.a}</Text>
              ) : null}
            </View>
          );
        })}
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
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  faqItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    ...typography.titleSmall,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.primary,
  },
  answerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
