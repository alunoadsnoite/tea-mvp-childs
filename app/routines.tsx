import { localizeRoutine } from "@/lib/localizedContent";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useRoutineStore } from "@/stores/routineStore";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function RoutinesListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const routines = useRoutineStore((state) => state.routines);
  const execution = useRoutineStore((state) => state.execution);
  const startExecution = useRoutineStore((state) => state.startExecution);
  const { colors } = useThemeMode();

  const handleStartRoutine = (routineId: string) => {
    // Opening the saved execution must not replace its pause/timer state.
    if (execution?.routineId !== routineId) startExecution(routineId);
    router.push("/routine-execution");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Minhas Rotinas"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {routines.map((routine) => localizeRoutine(routine, t)).map((routine) => (
          <View key={routine.id} style={styles.routineCard}>
            <View style={styles.routineHeader}>
              <Text style={styles.routineEmoji}>{routine.emoji}</Text>
              <View style={styles.routineInfo}>
                <Text style={styles.routineName}>{routine.name}</Text>
                {routine.description && (
                  <Text style={styles.routineDescription}>{routine.description}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.stepsPreview}>
              {routine.steps.slice(0, 3).map((step) => (
                <View key={step.id} style={styles.stepRow}>
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                  <Text style={styles.stepText}>{step.title}</Text>
                </View>
              ))}
              {routine.steps.length > 3 && (
                <Text style={styles.moreSteps}>{t("+{0} passos", routine.steps.length - 3)}</Text>
              )}
            </View>

            <Pressable
              style={styles.startButton}
              onPress={() => handleStartRoutine(routine.id)}
              accessibilityRole="button"
              accessibilityLabel={execution?.routineId === routine.id ? t("Voltar à rotina {0}", routine.name) : t("Começar {0}", routine.name)}
              accessibilityHint={t("Abre os passos e os controles da rotina")}
            >
              <Text style={styles.startButtonText}>
                {execution?.routineId === routine.id ? t("Voltar à rotina ▶️") : t("Começar 🚀")}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  routineCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    gap: 16,
  },
  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routineEmoji: {
    fontSize: 40,
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: 20,
    fontWeight: "700",
  },
  routineDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  stepsPreview: {
    gap: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepEmoji: {
    fontSize: 20,
  },
  stepText: {
    fontSize: 14,
  },
  moreSteps: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 28,
  },
  startButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
