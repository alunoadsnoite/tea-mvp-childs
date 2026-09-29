import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { BREATHING_EXERCISES, BreathingExerciseConfig } from "@/types/coping";

export default function BreathingGuideScreen() {

  const [selectedExercise, setSelectedExercise] = useState<BreathingExerciseConfig>(
    BREATHING_EXERCISES[0]
  );
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phaseLabels = ["Inspire", "Segure", "Solte", "Segure"];
  const pattern = selectedExercise.pattern;

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      return;
    }

    const phaseIndex = currentPhase % pattern.length;
    const phaseDuration = Math.max(pattern[phaseIndex] * 1000, 100);

    const isInhale = phaseIndex === 0;
    const isExhale = phaseIndex === 2;

    if (isInhale) {
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: phaseDuration,
        useNativeDriver: true,
      }).start();
    } else if (isExhale) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: phaseDuration,
        useNativeDriver: true,
      }).start();
    }

    intervalRef.current = setTimeout(() => {
      let nextPhase = (currentPhase + 1) % pattern.length;
      while (pattern[nextPhase] === 0) {
        nextPhase = (nextPhase + 1) % pattern.length;
        if (nextPhase === currentPhase) break;
      }

      const newCycle = nextPhase <= currentPhase ? cycleCount + 1 : cycleCount;

      if (newCycle >= selectedExercise.cycles) {
        setIsActive(false);
        setCurrentPhase(0);
        setCycleCount(0);
        scaleAnim.setValue(1);
        return;
      }

      setCurrentPhase(nextPhase);
      setCycleCount(newCycle);
    }, phaseDuration);

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhase(0);
    setCycleCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCycleCount(0);
    scaleAnim.setValue(1);
  };

  const currentPhaseLabel = phaseLabels[currentPhase % pattern.length];
  const progress = Math.min(
    100,
    ((cycleCount + (currentPhase + 1) / pattern.length) / selectedExercise.cycles) * 100
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Respiração Guiada",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
        }}
      />

      <View style={styles.content}>
        {/* Seleção de exercício */}
        <View style={styles.exerciseSelector}>
          {BREATHING_EXERCISES.map((exercise) => (
            <Pressable
              key={exercise.id}
              style={[
                styles.exerciseButton,
                selectedExercise.id === exercise.id && styles.exerciseButtonActive,
              ]}
              onPress={() => {
                handleStop();
                setSelectedExercise(exercise);
              }}
            >
              <Text style={styles.exerciseEmoji}>{exercise.emoji}</Text>
              <View style={styles.exerciseInfo}>
                <Text
                  style={[
                    styles.exerciseButtonText,
                    selectedExercise.id === exercise.id && styles.exerciseButtonTextActive,
                  ]}
                >
                  {exercise.name}
                </Text>
                <Text style={styles.exerciseDescription}>
                  {exercise.description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Círculo de respiração */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.circle,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.circleEmoji}>{selectedExercise.emoji}</Text>
            <Text style={styles.phaseLabel}>
              {isActive ? currentPhaseLabel : "Pronto?"}
            </Text>
            {isActive && (
              <Text style={styles.cycleLabel}>
                {cycleCount + 1} / {selectedExercise.cycles}
              </Text>
            )}
          </Animated.View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Padrão de respiração */}
        <View style={styles.patternContainer}>
          <Text style={styles.patternLabel}>Como fazer:</Text>
          <View style={styles.patternSteps}>
            {pattern.map((seconds, index) => (
              <View
                key={index}
                style={[
                  styles.patternStep,
                  isActive && currentPhase % pattern.length === index && styles.patternStepActive,
                ]}
              >
                <Text
                  style={[
                    styles.patternStepText,
                    isActive && currentPhase % pattern.length === index && styles.patternStepTextActive,
                  ]}
                >
                  {phaseLabels[index % phaseLabels.length]}
                </Text>
                <Text
                  style={[
                    styles.patternSeconds,
                    isActive && currentPhase % pattern.length === index && styles.patternSecondsActive,
                  ]}
                >
                  {seconds}s
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão de controle */}
        <Pressable
          style={[styles.controlButton, isActive && styles.controlButtonStop]}
          onPress={isActive ? handleStop : handleStart}
        >
          <Text style={styles.controlButtonText}>
            {isActive ? "Parar ⏹️" : "Começar ▶️"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  exerciseSelector: {
    gap: 12,
  },
  exerciseButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseButtonActive: {
    borderColor: "#63B3ED",
    backgroundColor: "#EBF8FF",
  },
  exerciseEmoji: {
    fontSize: 32,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseButtonText: {
    color: "#2D3748",
    fontSize: 16,
    fontWeight: "700",
  },
  exerciseButtonTextActive: {
    color: "#2B6CB0",
  },
  exerciseDescription: {
    color: "#718096",
    fontSize: 14,
    marginTop: 2,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: "60%",
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: "#63B3ED",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  circleEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  phaseLabel: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  cycleLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
  },
  progressTrack: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#63B3ED",
    borderRadius: 6,
  },
  patternContainer: {
    gap: 12,
  },
  patternLabel: {
    color: "#718096",
    fontSize: 14,
    textAlign: "center",
  },
  patternSteps: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  patternStep: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    minWidth: 70,
  },
  patternStepActive: {
    backgroundColor: "#63B3ED",
    borderColor: "#63B3ED",
  },
  patternStepText: {
    color: "#4A5568",
    fontSize: 12,
  },
  patternStepTextActive: {
    color: "#FFFFFF",
  },
  patternSeconds: {
    color: "#718096",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  patternSecondsActive: {
    color: "#FFFFFF",
  },
  controlButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  controlButtonStop: {
    backgroundColor: "#FC8181",
  },
  controlButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
