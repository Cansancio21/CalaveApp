import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
     <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerTitle: "Calave",
        headerShown: false,
      }}/>
        <Stack.Screen name="About" options={{
        headerTitle: "About",
      }} />

      </Stack>
  );
}
