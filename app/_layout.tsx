import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { AppSettingsProvider } from "../src/contexts/AppSettingsContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}
