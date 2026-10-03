import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useApp } from "../../context/AppContext";

export const CreateProjectScreen = ({ navigation }: any) => {
  const { createProject } = useApp();

  const [title, setTitle] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string>("Computer Science & Engineering");
  const [skillsInput, setSkillsInput] = useState<string>("C++, Distributed Systems, LoRa");
  const [rolesInput, setRolesInput] = useState<string>("Firmware Engineer, Signal Processing Lead");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreate = async () => {
    const newErrors: Record<string, string> = {};

    if (!title || title.trim().length < 6) {
      newErrors.title = "Project title must be at least 6 characters.";
    }

    if (!description || description.trim().length < 25) {
      newErrors.description = "Provide a comprehensive research abstract (min 25 chars).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const skillsRequired = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const openRoles = rolesInput
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const created = await createProject({
        title: title.trim(),
        tagline: tagline.trim() || title.trim(),
        description: description.trim(),
        department,
        skillsRequired,
        openRoles,
      });

      Alert.alert(
        "Research Project Posted! 🎉",
        "Your project workspace has been created (+20 XP). Scholars across partner universities can now discover and apply.",
        [
          {
            text: "View Project",
            onPress: () => navigation.replace("ProjectDetail", { id: created.id }),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to create project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post New Research Project</Text>
          <Text style={styles.headerSubtitle}>
            Form an inter-campus team for academic labs, hackathons & research papers
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            label="Project Title"
            placeholder="e.g. FloodSense — Sub-GHz IoT Flood Telemetry Mesh Network"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((e) => ({ ...e, title: "" }));
            }}
            error={errors.title}
          />

          <Input
            label="One-line Tagline"
            placeholder="e.g. Real-time river basin monitoring using sub-GHz LoRa mesh..."
            value={tagline}
            onChangeText={setTagline}
          />

          <Input
            label="Department / Focus Area"
            placeholder="e.g. Computer Science / Robotics / Hydrology"
            value={department}
            onChangeText={setDepartment}
          />

          <Input
            label="Research Abstract & Scope"
            placeholder="Describe the problem formulation, methodology, architectural challenges, and target paper/deliverable milestones..."
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (errors.description) setErrors((e) => ({ ...e, description: "" }));
            }}
            multiline={true}
            numberOfLines={6}
            inputStyle={{ minHeight: 120, textAlignVertical: "top" }}
            error={errors.description}
          />

          <Input
            label="Required Skills (Comma separated)"
            placeholder="Embedded C++, Raft Consensus, PostGIS, Edge AI"
            value={skillsInput}
            onChangeText={setSkillsInput}
            helperText="Used by our skill-matching algorithm to score candidate compatibility."
          />

          <Input
            label="Open Roles Needed (Comma separated)"
            placeholder="Firmware Engineer, Signal Processing Lead, Dataset Specialist"
            value={rolesInput}
            onChangeText={setRolesInput}
          />

          <Button
            title="Publish Research Workspace (+20 XP)"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            onPress={handleCreate}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
