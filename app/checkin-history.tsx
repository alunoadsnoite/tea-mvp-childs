import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import {
  Alert,
  Pressable,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COMMON_TRIGGERS } from "@/types/checkin";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";
import { useThemeMode } from "@/hooks/useThemeMode";

const EMOJI_LEVELS = ["😞", "😕", "😐", "🙂", "😄"];

const getEmoji = (level: number) => {
  const index = Math.min(Math.max(level - 1, 0), EMOJI_LEVELS.length - 1);
  return EMOJI_LEVELS[index];
};

export default function CheckInHistoryScreen() {
  const { t, language } = useTranslation();
  const storedEntries = useCheckInStore((state) => state.entries);
  const clearHistory = useCheckInStore((state) => state.clearHistory);
  const [erasing, setErasing] = React.useState(false);
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const entries = storedEntries.filter((entry) => entry.timestamp >= cutoff)
    .sort((a, b) => b.timestamp - a.timestamp);
  const { colors } = useThemeMode();

  const eraseDiary = async () => {
    setErasing(true);
    try {
      await clearHistory();
      Alert.alert(t("Seu diário foi apagado."));
    } catch {
      Alert.alert(t("Não foi possível apagar o diário."), t("Tente novamente."));
    } finally {
      setErasing(false);
    }
  };

  const confirmErase = () => {
    Alert.alert(t("Apagar meu diário"), t("Todos os registros do diário serão apagados deste aparelho. Suas rotinas, seus cartões e seus contatos de ajuda continuarão aqui."), [
      { text: t("Cancelar"), style: "cancel" },
      { text: t("Apagar"), style: "destructive", onPress: () => void eraseDiary() },
    ]);
  };

  const groupedByDay = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString(language, {
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
    return new Date(timestamp).toLocaleTimeString(language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Meu Diário"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {(erasing || storedEntries.length > 0) && (
          <Pressable accessibilityRole="button" onPress={confirmErase} disabled={erasing}
            accessibilityState={{ disabled: erasing, busy: erasing }}
            style={[styles.eraseButton, { borderColor: colors.accent }]}>
            <Text style={{ color: colors.text }}>{t(erasing ? "Apagando o diário…" : "Apagar meu diário")}</Text>
          </Pressable>
        )}
        {Object.keys(groupedByDay).length === 0 ? (
          <Text style={styles.emptyText}>{t("Nenhum registro nos últimos 7 dias")}</Text>
        ) : (
          Object.entries(groupedByDay).map(([date, dayEntries]) => (
            <View key={date} style={styles.daySection}>
              <Text style={styles.dayTitle}>{date}</Text>
              
              {dayEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                  
                  <View style={styles.metrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{getEmoji(entry.happiness)}</Text>
                      <Text style={styles.metricLabel}>{t("Felicidade")}</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{getEmoji(entry.energy)}</Text>
                      <Text style={styles.metricLabel}>{t("Energia")}</Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text style={styles.metricEmoji}>{getEmoji(entry.calm)}</Text>
                      <Text style={styles.metricLabel}>{t("Calma")}</Text>
                    </View>
                  </View>

                  {entry.triggers.length > 0 && (
                    <View style={styles.triggers}>
                      {entry.triggers.map((trigger) => {
                        const triggerDef = COMMON_TRIGGERS.find((t) => t.id === trigger);
                        const label = triggerDef ? t(triggerDef.label) : trigger;
                        const emoji = triggerDef?.emoji ?? "";
                        return (
                          <View key={trigger} style={styles.triggerChip}>
                            <Text style={styles.triggerText}>
                              {emoji} {label}
                            </Text>
                          </View>
                        );
                      })}
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
  eraseButton: {
    alignSelf: "flex-start",
    minHeight: 48,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  daySection: {
    gap: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  entryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  entryTime: {
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
