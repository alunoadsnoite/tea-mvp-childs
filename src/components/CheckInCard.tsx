import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCheckInStore } from "@/stores/checkInStore";

const EMOJI_LEVELS = ["😞", "😕", "😐", "🙂", "😄"];

const getEmoji = (level: number) => {
  const index = Math.min(Math.max(level - 1, 0), EMOJI_LEVELS.length - 1);
  return EMOJI_LEVELS[index];
};

export function CheckInCard() {
  const lastEntry = useCheckInStore((state) => state.getLastEntry());

  if (!lastEntry) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          Como você está se sentindo hoje? 🤔
        </Text>
      </View>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você está?</Text>
      
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.happiness)}</Text>
          <Text style={styles.metricLabel}>Felicidade</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.energy)}</Text>
          <Text style={styles.metricLabel}>Energia</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.calm)}</Text>
          <Text style={styles.metricLabel}>Calma</Text>
        </View>
      </View>

      <Text style={styles.timestamp}>
        às {formatTime(lastEntry.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    width: "100%",
  },
  title: {
    color: "#2D3748",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  metric: {
    alignItems: "center",
  },
  metricEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  metricLabel: {
    color: "#718096",
    fontSize: 12,
  },
  timestamp: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: {
    color: "#718096",
    fontSize: 14,
    textAlign: "center",
  },
});
