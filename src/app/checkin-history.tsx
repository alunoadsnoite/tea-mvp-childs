import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";

const EMOJI_LEVELS = ["😞", "😕", "😐", "🙂", "😄"];

export default function CheckInHistoryScreen() {
  const getRecentEntries = useCheckInStore((state) => state.getRecentEntries);
  const entries = getRecentEntries(7);

  const groupedByDay = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Meu Diário",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {Object.keys(groupedByDay).length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum registro nos últimos 7 dias
          </Text>
        ) : (
          Object.entries(groupedByDay).map(([date, dayEntries]) => (
            <View key={date} style={styles.daySection}>
              <Text style={styles.dayTitle}>{date}</Text>
              
              {dayEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                  
                  <View style={styles.metrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{EMOJI_LEVELS[entry.happiness - 1]}</Text>
                      <Text style={styles.metricLabel}>Felicidade</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{EMOJI_LEVELS[entry.energy - 1]}</Text>
                      <Text style={styles.metricLabel}>Energia</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{EMOJI_LEVELS[entry.calm - 1]}</Text>
                      <Text style={styles.metricLabel}>Calma</Text>
                    </View>
                  </View>

                  {entry.triggers.length > 0 && (
                    <View style={styles.triggers}>
                      {entry.triggers.map((trigger, index) => (
                        <View key={index} style={styles.triggerChip}>
                          <Text style={styles.triggerText}>{trigger}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  emptyText: {
    color: "#A0AEC0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  daySection: {
    gap: 12,
  },
  dayTitle: {
    color: "#4A5568",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  entryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  entryTime: {
    color: "#A0AEC0",
    fontSize: 14,
  },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metric: {
    alignItems: "center",
  },
  metricEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  metricLabel: {
    color: "#718096",
    fontSize: 12,
  },
  triggers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  triggerChip: {
    backgroundColor: "#EBF8FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  triggerText: {
    color: "#2B6CB0",
    fontSize: 12,
  },
});
