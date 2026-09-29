import React, { useEffect, useState } from "react";
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
import { VisualTimerBar } from "@/components/VisualTimerBar";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function RoutineExecutionScreen() {
  const router = useRouter();
  const execution = useRoutineStore((state) => state.execution);
  const routines = useRoutineStore((state) => state.routines);
  const completeStep = useRoutineStore((state) => state.completeStep);
  const pauseExecution = useRoutineStore((state) => state.pauseExecution);
  const resumeExecution = useRoutineStore((state) => state.resumeExecution);
  const extendTime = useRoutineStore((state) => state.extendTime);
  const stopExecution = useRoutineStore((state) => state.stopExecution);
  const { colors } = useThemeMode();

  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!execution) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhuma rotina em andamento</Text>
          <Pressable
            style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const routine = routines.find((r) => r.id === execution.routineId);
  if (!routine) return null;

  const currentStep = routine.steps[execution.currentStepIndex];
  const isLastStep = execution.currentStepIndex === routine.steps.length - 1;
  const isCompleted = execution.completedAt !== null;

  const handleCompleteStep = () => {
    completeStep();
    if (isLastStep) {
      setTimeout(() => {
        stopExecution();
        router.replace("/routines");
      }, 1500);
    }
  };

  const handleStop = () => {
    stopExecution();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Passo {execution.currentStepIndex + 1} de {routine.steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((execution.currentStepIndex + 1) / routine.steps.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Título da rotina */}
        <View style={styles.routineHeader}>
          <Text style={styles.routineEmoji}>{routine.emoji}</Text>
          <Text style={styles.routineTitle}>{routine.name}</Text>
        </View>

        {/* Passo atual */}
        <View style={styles.stepCard}>
          <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          {currentStep.description && (
            <Text style={styles.stepDescription}>{currentStep.description}</Text>
          )}
        </View>

        {/* Timer visual */}
        {execution.stepStartedAt && execution.stepEndsAt && !isCompleted && (
          <View style={styles.timerContainer}>
            <VisualTimerBar
              startTime={execution.stepStartedAt}
              endTime={execution.stepEndsAt}
              isPaused={execution.isPaused}
            />
            {execution.isPaused && (
              <Text style={styles.pausedText}>⏸️ Pausado</Text>
            )}
          </View>
        )}

        {/* Conclusão */}
        {isCompleted && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedEmoji}>🎉</Text>
            <Text style={styles.completedText}>
              Parabéns! Você conseguiu!
            </Text>
          </View>
        )}

        {/* Ações */}
        {!isCompleted && (
          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={handleCompleteStep}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Terminar 🏁" : "Próximo ➡️"}
              </Text>
            </Pressable>

            <View style={styles.secondaryActions}>
              {execution.isPaused ? (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={resumeExecution}
                >
                  <Text style={styles.secondaryButtonText}>▶️ Continuar</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={pauseExecution}
                >
                  <Text style={styles.secondaryButtonText}>⏸️ Pausar</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.secondaryButton}
                onPress={() => extendTime(5)}
              >
                <Text style={styles.secondaryButtonText}>+5 min ⏰</Text>
              </Pressable>

              <Pressable
                style={styles.stopButton}
                onPress={handleStop}
              >
                <Text style={styles.stopButtonText}>Encerrar</Text>
              </Pressable>
            </View>
          </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    color: "#718096",
    fontSize: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  backButtonText: {
    color: "#4A5568",
    fontSize: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    color: "#718096",
    fontSize: 14,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#63B3ED",
    borderRadius: 4,
  },
  routineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  routineEmoji: {
    fontSize: 32,
  },
  routineTitle: {
    color: "#2D3748",
    fontSize: 20,
    fontWeight: "700",
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    gap: 16,
  },
  stepEmoji: {
    fontSize: 64,
  },
  stepTitle: {
    color: "#2D3748",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  stepDescription: {
    color: "#718096",
    fontSize: 16,
    textAlign: "center",
  },
  timerContainer: {
    gap: 8,
  },
  pausedText: {
    color: "#D69E2E",
    fontSize: 14,
    textAlign: "center",
  },
  completedContainer: {
    backgroundColor: "#C6F6D5",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  completedEmoji: {
    fontSize: 64,
  },
  completedText: {
    color: "#276749",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "600",
  },
  stopButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  stopButtonText: {
    color: "#A0AEC0",
    fontSize: 14,
  },
});
