import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SubmissionProvider } from "./SubmissionContext";

export type Submission = {
  id: string;
  image: string | null;
  name: string;
  grades: { subject: string; grade: string }[];
  yearLevel: string;
  course: string;
};

export default function Layout() {
  return (
    <SubmissionProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffd33d",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Submissions"
          options={{
            title: "Submissions",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="AddSubmissions"
          options={{
            href: null,
            headerTitle: "Add Submission",
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </SubmissionProvider>
  );
}