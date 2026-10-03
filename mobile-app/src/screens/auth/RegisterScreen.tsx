import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
import { useAuth } from "../../context/AuthContext";

export const RegisterScreen = ({ navigation }: any) => {
  const { register } = useAuth();

  const [role, setRole] = useState<"student" | "faculty">("student");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [institution, setInstitution] = useState<string>("IIT Delhi");
  const [department, setDepartment] = useState<string>("Computer Science & Engineering");
  const [degree, setDegree] = useState<string>("B.Tech CSE '26");
  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full academic name.";
    }

    if (!email || !email.includes("@")) {
      newErrors.email = "Enter a valid academic email (@*.edu, @*.ac.in).";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await register({
      name: fullName.trim(),
      email: email.trim(),
      password,
      role,
      institution,
      department,
      degree: role === "faculty" ? "Faculty Advisor" : degree,
      skills: ["Computer Science", "Academic Research"],
    });

    setLoading(false);

    if (res.success) {
      Alert.alert(
        "Academic Profile Verified! 🎉",
        `Welcome to CampusLink, ${fullName}! Your ${role === "faculty" ? "faculty verification code #FAC-VERIFIED" : "student verification code #IN-VERIFIED"} has been generated.`,
        [{ text: "Start Exploring" }]
      );
    } else {
      Alert.alert("Registration Error", res.error || "Could not complete registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Register Academic Scholar</Text>
          <Text style={styles.subtitle}>
            Connect with peer researchers, cross-campus projects & faculty labs
          </Text>
        </View>

        {/* Role Toggle */}
        <View style={styles.roleToggleContainer}>
          <TouchableOpacity
            style={[styles.roleOption, role === "student" && styles.roleOptionActive]}
            onPress={() => setRole("student")}
            activeOpacity={0.8}
          >
            <Text style={styles.roleIcon}>🎓</Text>
            <Text style={[styles.roleLabel, role === "student" && styles.roleLabelActive]}>
              Student / Ph.D.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleOption, role === "faculty" && styles.roleOptionActive]}
            onPress={() => setRole("faculty")}
            activeOpacity={0.8}
          >
            <Text style={styles.roleIcon}>👨‍🏫</Text>
            <Text style={[styles.roleLabel, role === "faculty" && styles.roleLabelActive]}>
              Faculty / Mentor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Input
            label="Full Academic Name"
            placeholder="e.g. Dr. Ananya Roy or Rohan Kulkarni"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
          />

          <Input
            label="Institutional Email"
            placeholder="scholar@iitd.ac.in"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            helperText="Official university domain verification"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            error={errors.password}
          />

          <Input
            label="University / Institution"
            placeholder="e.g. IIT Delhi, IISc Bangalore, BITS Pilani"
            value={institution}
            onChangeText={setInstitution}
          />

          <Input
            label="Department / Lab"
            placeholder="e.g. Computer Science & Engineering"
            value={department}
            onChangeText={setDepartment}
          />

          {role === "student" ? (
            <Input
              label="Academic Program / Year"
              placeholder="e.g. B.Tech CSE '26 or Ph.D. Scholar '25"
              value={degree}
              onChangeText={setDegree}
            />
          ) : null}

          <Button
            title="Create Verified Profile"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleRegister}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleToggleContainer: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginRight: spacing.xs,
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  roleLabel: {
    ...typography.labelLarge,
    color: colors.textSecondary,
  },
  roleLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  formCard: {
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
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerPrompt: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: "700",
  },
});
