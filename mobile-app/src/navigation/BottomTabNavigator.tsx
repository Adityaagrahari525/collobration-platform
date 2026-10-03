import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { QuestionsScreen } from "../screens/tabs/QuestionsScreen";
import { ProjectsScreen } from "../screens/tabs/ProjectsScreen";
import { PeopleScreen } from "../screens/tabs/PeopleScreen";
import { ProfileScreen } from "../screens/tabs/ProfileScreen";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused }) => {
          let icon = "🎓";
          if (route.name === "HomeTab") icon = "🏠";
          else if (route.name === "QuestionsTab") icon = "💬";
          else if (route.name === "ProjectsTab") icon = "🔬";
          else if (route.name === "PeopleTab") icon = "👥";
          else if (route.name === "ProfileTab") icon = "👤";

          return (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Text style={{ fontSize: focused ? 19 : 17 }}>{icon}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="QuestionsTab"
        component={QuestionsScreen}
        options={{ tabBarLabel: "Q&A Feed" }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectsScreen}
        options={{ tabBarLabel: "Projects" }}
      />
      <Tab.Screen
        name="PeopleTab"
        component={PeopleScreen}
        options={{ tabBarLabel: "Scholars" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    transform: [{ scale: 1.1 }],
  },
});
