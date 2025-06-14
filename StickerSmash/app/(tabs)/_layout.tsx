import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { SubmissionProvider } from "./SubmissionContext";

export type Grade = {
  subject: string;
  grade: string;
};

export type Submission = {
  id: string;
  image: string | null;
  name: string;
  grades: Grade[];
};

export default function TabsLayout() {
  return (
    <SubmissionProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffd33d",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "Input Grades",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Submissions"
          options={{
            headerTitle: "Submissions",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "list-sharp" : "list-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            headerTitle: "About",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "information-circle" : "information-circle-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
      </Tabs>
    </SubmissionProvider>
  );
}