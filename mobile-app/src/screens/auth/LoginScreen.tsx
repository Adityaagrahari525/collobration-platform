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
import { INITIAL_USERS } from "../../services/mockData";

export const LoginScreen = ({ navigation }: any) => {
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState<string>("aditya.sharma@iitd.ac.in");
  const [password, setPassword] = useState<string>("academicPass123");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passError, setPassError] = useState<string>("");

  const handleLogin = async () => {
    let valid = true;
    if (!email || !email.includes("@")) {
      setEmailError("Please provide a valid academic email address (@*.edu, @*.ac.in).");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPassError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPassError("");
    }

    if (!valid) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Login Failed", res.error || "Please check your academic credentials.");
    }
  };

  const handleQuickDemoFill = async (userIndex: number) => {
    const demo = INITIAL_USERS[userIndex];
    if (demo) {
      setEmail(demo.email);
      setPassword("academicPass123");
      await switchDemoUser(demo.id);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Academic Header Banner */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.brandTitle}>CampusLink</Text>
          <Text style={styles.brandTagline}>
            Inter-Institutional Academic Collaboration & Peer Network
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Sign In to Scholar Portal</Text>
          <Text style={styles.cardSubheading}>
            Access research projects, faculty mentorship & peer Q&A
          </Text>

          <Input
            label="Institutional Email"
            placeholder="scholar@iitd.ac.in"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (emailError) setEmailError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (passError) setPassError("");
            }}
            secureTextEntry={true}
            error={passError}
          />

          <Button
            title="Authenticate with Campus"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleLogin}
            style={styles.submitBtn}
          />

          {/* Quick Demo Switcher */}
          <View style={styles.demoSection}>
            <Text style={styles.demoHeading}>Quick Demo Roles:</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleQuickDemoFill(0)}
              >
                <Text style={styles.demoChipText}>Student Lead (IITD)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleQuickDemoFill(1)}
              >
                <Text style={styles.demoChipText}>Faculty Mentor (IITD)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => handleQuickDemoFill(2)}
              >
                <Text style={styles.demoChipText}>Ph.D. Scholar (IISc)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Navigation Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerPrompt}>New scholar to CampusLink?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}> Register Profile</Text>
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
    justifyContent: "center",
    minHeight: "100%",
  },
  brandHeader: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  logoIcon: {
    fontSize: 30,
  },
  brandTitle: {
    ...typography.displayMedium,
    color: colors.primary,
  },
  brandTagline: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    maxWidth: 280,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  cardHeading: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubheading: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
  demoSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  demoHeading: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  demoButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  demoChip: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  demoChipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
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
