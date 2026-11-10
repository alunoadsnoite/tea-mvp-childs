import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";

export function EmergencyFab() {
  const router = useRouter();
  const { colors } = useThemeMode();

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.fab, { backgroundColor: colors.accent }]}
      onPress={() => router.push("/crisis-card")}
      accessibilityLabel="Preciso de ajuda"
      accessibilityHint="Toque para abrir o cartão de ajuda"
    >
      {/* Decorative icon: keep its glyph inside the fixed 64 dp touch target. */}
      <Text style={styles.fabText} allowFontScaling={false} accessible={false}>🆘</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
  },
});
