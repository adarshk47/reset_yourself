import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeMobileAds } from "../src/ads/initializeMobileAds";

export default function RootLayout() {
  useEffect(() => {
    initializeMobileAds();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="goal/[id]" options={{ title: "Goal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
