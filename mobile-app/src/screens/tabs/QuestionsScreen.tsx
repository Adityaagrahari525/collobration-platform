import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { SearchBar } from "../../components/common/SearchBar";
import { QuestionCard } from "../../components/questions/QuestionCard";
import { EmptyState } from "../../components/common/EmptyState";
import { useApp } from "../../context/AppContext";

const DEPARTMENTS = [
  "All",
  "Distributed Systems",
  "Machine Learning / Systems",
  "Robotics",
  "Sensors & Telemetry",
];

export const QuestionsScreen = ({ navigation }: any) => {
  const {
    questions,
    isRefreshing,
    fetchQuestions,
    savedQuestionIds,
    toggleSaveQuestion,
    voteQuestion,
  } = useApp();

  const [search, setSearch] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        !search ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchDept =
        selectedDept === "All" ||
        q.department.toLowerCase().includes(selectedDept.toLowerCase()) ||
        q.subject.toLowerCase().includes(selectedDept.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(selectedDept.toLowerCase()));

      return matchSearch && matchDept;
    });
  }, [questions, search, selectedDept]);

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Academic Q&A Forum</Text>
            <Text style={styles.screenSubtitle}>
              Peer-reviewed technical inquiries & verified solutions
            </Text>
          </View>
          <TouchableOpacity
            style={styles.askHeaderBtn}
            onPress={() => navigation.navigate("AskQuestion")}
            activeOpacity={0.8}
          >
            <Text style={styles.askBtnIcon}>+</Text>
            <Text style={styles.askBtnText}>Ask</Text>
          </TouchableOpacity>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by topic, tag, or keyword..."
        />

        {/* Department / Category Filter Chips */}
        <FlatList
          data={DEPARTMENTS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.deptChip,
                selectedDept === item && styles.deptChipActive,
              ]}
              onPress={() => setSelectedDept(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.deptChipText,
                  selectedDept === item && styles.deptChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.chipsList}
        />
      </View>

      {/* Questions Feed */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchQuestions}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <QuestionCard
            question={item}
            isBookmarked={savedQuestionIds.includes(item.id)}
            onPress={() => navigation.navigate("QuestionDetail", { id: item.id })}
            onVote={() => voteQuestion(item.id)}
            onBookmark={() => toggleSaveQuestion(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No Questions Found"
            description={
              search
                ? `No questions matching "${search}". Be the first scholar to ask about this topic!`
                : "No questions in this academic department yet."
            }
            actionTitle="Ask a Question"
            onAction={() => navigation.navigate("AskQuestion")}
          />
        }
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
    ...shadows.sm,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  screenTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  screenSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  askHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  askBtnIcon: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
    marginRight: 4,
    lineHeight: 16,
  },
  askBtnText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  chipsList: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  deptChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  deptChipActive: {
    backgroundColor: colors.primary,
  },
  deptChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  deptChipTextActive: {
    color: colors.onPrimary,
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
});
