import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export function EmergencyFab() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.fab}
      onPress={() => router.push("/crisis-card")}
      accessibilityLabel="Preciso de ajuda"
      accessibilityHint="Toque para abrir o cartão de ajuda"
    >
      <Text style={styles.fabText}>🆘</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B6B",
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
