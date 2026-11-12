import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCheckInStore } from "@/stores/checkInStore";
import { useThemeMode } from "@/hooks/useThemeMode";

const EMOJI_LEVELS = ["😞", "😕", "😐", "🙂", "😄"];

const getEmoji = (level: number) => {
  const index = Math.min(Math.max(level - 1, 0), EMOJI_LEVELS.length - 1);
  return EMOJI_LEVELS[index];
};

export function CheckInCard() {
  const { t, language } = useTranslation();
  const lastEntry = useCheckInStore((state) => state.getLastEntry());
  const { colors } = useThemeMode();

  if (!lastEntry) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t("Como você está se sentindo hoje? 🤔")}</Text>
      </View>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t("Como você está?")}</Text>
      
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.happiness)}</Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t("Felicidade")}</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.energy)}</Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t("Energia")}</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricEmoji}>{getEmoji(lastEntry.calm)}</Text>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{t("Calma")}</Text>
        </View>
      </View>

      <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{t("às {0}", formatTime(lastEntry.timestamp))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    width: "100%",
  },
  title: {
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
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
