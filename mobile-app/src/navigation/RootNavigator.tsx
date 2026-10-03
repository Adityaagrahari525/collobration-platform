import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";

// Auth Screens
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";

// Main App Tabs
import { BottomTabNavigator } from "./BottomTabNavigator";

// Detail & Action Screens
import { QuestionDetailScreen } from "../screens/details/QuestionDetailScreen";
import { AskQuestionScreen } from "../screens/details/AskQuestionScreen";
import { ProjectDetailScreen } from "../screens/details/ProjectDetailScreen";
import { CreateProjectScreen } from "../screens/details/CreateProjectScreen";
import { PersonDetailScreen } from "../screens/details/PersonDetailScreen";
import { MentorshipScreen } from "../screens/details/MentorshipScreen";
import { CommunitiesScreen } from "../screens/details/CommunitiesScreen";
import { ContributionScreen } from "../screens/details/ContributionScreen";
import { RecognitionScreen } from "../screens/details/RecognitionScreen";
import { MessagesScreen } from "../screens/details/MessagesScreen";
import { ChatScreen } from "../screens/details/ChatScreen";
import { NotificationsScreen } from "../screens/details/NotificationsScreen";
import { SettingsScreen } from "../screens/details/SettingsScreen";
import { HelpScreen } from "../screens/details/HelpScreen";

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        ) : (
          // Authenticated App Shell Stack
          <Stack.Group>
            <Stack.Screen
              name="MainTabs"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />

            {/* Questions sub-routes */}
            <Stack.Screen
              name="QuestionDetail"
              component={QuestionDetailScreen}
              options={{ title: "Question Thread" }}
            />
            <Stack.Screen
              name="AskQuestion"
              component={AskQuestionScreen}
              options={{ title: "Ask Inquiry", presentation: "modal" }}
            />

            {/* Projects sub-routes */}
            <Stack.Screen
              name="ProjectDetail"
              component={ProjectDetailScreen}
              options={{ title: "Research Workspace" }}
            />
            <Stack.Screen
              name="CreateProject"
              component={CreateProjectScreen}
              options={{ title: "Post Lab Project", presentation: "modal" }}
            />

            {/* Scholars sub-routes */}
            <Stack.Screen
              name="PersonDetail"
              component={PersonDetailScreen}
              options={{ title: "Scholar Profile" }}
            />

            {/* Specialized Academic Screens */}
            <Stack.Screen
              name="Mentorship"
              component={MentorshipScreen}
              options={{ title: "Faculty Mentorship" }}
            />
            <Stack.Screen
              name="Communities"
              component={CommunitiesScreen}
              options={{ title: "Research Consortia" }}
            />
            <Stack.Screen
              name="Contribution"
              component={ContributionScreen}
              options={{ title: "Reputation & Scorecard" }}
            />
            <Stack.Screen
              name="Recognition"
              component={RecognitionScreen}
              options={{ title: "National Leaderboard" }}
            />
            <Stack.Screen
              name="Messages"
              component={MessagesScreen}
              options={{ title: "Peer Messages" }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ route }: any) => ({
                title: route.params?.name || "Academic Chat",
              })}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{ title: "Notifications" }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: "Preferences & Settings" }}
            />
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: "Academic Help & FAQ" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
