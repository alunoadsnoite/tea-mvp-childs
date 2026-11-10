import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { EmergencyFab } from "@/components/EmergencyFab";
import { useThemeMode } from "@/hooks/useThemeMode";
import { View, Linking } from "react-native";

void SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { colors, isDark } = useThemeMode();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  useEffect(() => {
    if (!navigationState?.key) return;
    let active = true;
    // Replay the widget's cold-start intent only after the navigator is mounted.
    void Linking.getInitialURL().then((url) => {
      if (active && url?.split(/[?#]/)[0] === "tea-kids://crisis-card") {
        router.replace("/crisis-card");
      }
    });
    return () => { active = false; };
  }, [navigationState?.key, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      />
      <SafeAreaView edges={["bottom"]} style={{ paddingTop: 8, backgroundColor: colors.background }}>
        <EmergencyFab />
      </SafeAreaView>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemedStack />
    </SafeAreaProvider>
  );
}
