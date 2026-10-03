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
import { ScholarCard } from "../../components/people/ScholarCard";
import { EmptyState } from "../../components/common/EmptyState";
import { useApp } from "../../context/AppContext";

const INSTITUTIONS = [
  "All Campuses",
  "IIT Delhi",
  "IISc Bangalore",
  "IIT Bombay",
  "IIIT Hyderabad",
  "BITS Pilani",
  "NIT Trichy",
];

export const PeopleScreen = ({ navigation }: any) => {
  const { scholars, isRefreshing, refreshAll } = useApp();

  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "faculty">("all");
  const [selectedInst, setSelectedInst] = useState<string>("All Campuses");

  const filteredScholars = useMemo(() => {
    return scholars.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()));

      const matchRole = roleFilter === "all" || s.role === roleFilter;

      const matchInst =
        selectedInst === "All Campuses" ||
        s.institution.toLowerCase().includes(selectedInst.toLowerCase());

      return matchSearch && matchRole && matchInst;
    });
  }, [scholars, search, roleFilter, selectedInst]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Scholars & Faculty Directory</Text>
        <Text style={styles.screenSubtitle}>
          Discover verified peer researchers and faculty mentors
        </Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search by scholar name, skills (e.g. PyTorch, Raft)..."
        />

        {/* Role Segmented Filter */}
        <View style={styles.roleSegmentRow}>
          <TouchableOpacity
            style={[styles.segmentBtn, roleFilter === "all" && styles.segmentBtnActive]}
            onPress={() => setRoleFilter("all")}
          >
            <Text style={[styles.segmentText, roleFilter === "all" && styles.segmentTextActive]}>
              All Scholars ({scholars.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, roleFilter === "student" && styles.segmentBtnActive]}
            onPress={() => setRoleFilter("student")}
          >
            <Text style={[styles.segmentText, roleFilter === "student" && styles.segmentTextActive]}>
              Students
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, roleFilter === "faculty" && styles.segmentBtnActive]}
            onPress={() => setRoleFilter("faculty")}
          >
            <Text style={[styles.segmentText, roleFilter === "faculty" && styles.segmentTextActive]}>
              Faculty Mentors
            </Text>
          </TouchableOpacity>
        </View>

        {/* Campuses Horizontal list */}
        <FlatList
          data={INSTITUTIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.campusChip,
                selectedInst === item && styles.campusChipActive,
              ]}
              onPress={() => setSelectedInst(item)}
            >
              <Text
                style={[
                  styles.campusChipText,
                  selectedInst === item && styles.campusChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.campusList}
        />
      </View>

      {/* Scholars List */}
      <FlatList
        data={filteredScholars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshAll}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <ScholarCard
            scholar={item}
            onPress={() => navigation.navigate("PersonDetail", { id: item.id })}
            onMessagePress={() => navigation.navigate("Chat", { participantId: item.id, name: item.name })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="No Scholars Found"
            description="No academic profiles matched your current search filters."
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
  screenTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },
  screenSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  roleSegmentRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  segmentText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  campusList: {
    marginTop: 2,
    marginBottom: 4,
  },
  campusChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  campusChipActive: {
    backgroundColor: colors.primary,
  },
  campusChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  campusChipTextActive: {
    color: colors.onPrimary,
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
});
