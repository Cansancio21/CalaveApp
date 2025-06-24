import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import React from "react"; 

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, assume the user is not logged in initially
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking auth token:", error);
        router.replace("/login"); // Fallback to login on error
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: "Calave",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="About"
        options={{
          headerTitle: "About",
        }}
      />
    </Stack>
  );
}