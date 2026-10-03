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
import { ProjectCard } from "../../components/projects/ProjectCard";
import { EmptyState } from "../../components/common/EmptyState";
import { useApp } from "../../context/AppContext";

const DOMAIN_FILTERS = ["All", "Recruiting", "In Progress", "Distributed Systems", "AI & NLP", "Robotics"];

export const ProjectsScreen = ({ navigation }: any) => {
  const { projects, isRefreshing, fetchProjects } = useApp();

  const [search, setSearch] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.institution.toLowerCase().includes(search.toLowerCase()) ||
        p.skillsRequired.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      let matchFilter = true;
      if (selectedFilter === "Recruiting") {
        matchFilter = p.status === "Recruiting";
      } else if (selectedFilter === "In Progress") {
        matchFilter = p.status.includes("Progress") || p.status.includes("Phase");
      } else if (selectedFilter !== "All") {
        matchFilter =
          p.department.toLowerCase().includes(selectedFilter.toLowerCase()) ||
          p.title.toLowerCase().includes(selectedFilter.toLowerCase()) ||
          p.skillsRequired.some((s) => s.toLowerCase().includes(selectedFilter.toLowerCase()));
      }

      return matchSearch && matchFilter;
    });
  }, [projects, search, selectedFilter]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>Research Workspaces</Text>
            <Text style={styles.screenSubtitle}>
              Cross-university lab projects & recruiting teams
            </Text>
          </View>
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => navigation.navigate("CreateProject")}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>+ Post Lab</Text>
          </TouchableOpacity>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search research labs by tech, college, lead..."
        />

        <FlatList
          data={DOMAIN_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.chipsList}
        />
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchProjects}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate("ProjectDetail", { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔬"
            title="No Research Labs Found"
            description="No active projects matched your criteria. Start a new collaborative project today!"
            actionTitle="Post a Project"
            onAction={() => navigation.navigate("CreateProject")}
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
  postBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  postBtnText: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  chipsList: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  filterChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  listContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
});
