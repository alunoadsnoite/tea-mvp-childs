import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { CrisisCardModal } from "@/components/CrisisCardModal";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function CrisisCardScreen() {
  const { colors } = useThemeMode();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Preciso de Ajuda",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: "Voltar",
        }}
      />
      <CrisisCardModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
