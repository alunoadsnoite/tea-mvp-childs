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

export default function RoutinesListScreen() {
  const router = useRouter();
  const routines = useRoutineStore((state) => state.routines);
  const startExecution = useRoutineStore((state) => state.startExecution);

  const handleStartRoutine = (routineId: string) => {
    startExecution(routineId);
    router.push("/routine-execution");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Minhas Rotinas",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {routines.map((routine) => (
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
                <Text style={styles.moreSteps}>
                  +{routine.steps.length - 3} passos
                </Text>
              )}
            </View>

            <Pressable
              style={styles.startButton}
              onPress={() => handleStartRoutine(routine.id)}
            >
              <Text style={styles.startButtonText}>Começar 🚀</Text>
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
    backgroundColor: "#F0F4F8",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  routineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
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
    color: "#2D3748",
    fontSize: 20,
    fontWeight: "700",
  },
  routineDescription: {
    color: "#718096",
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
    color: "#4A5568",
    fontSize: 14,
  },
  moreSteps: {
    color: "#A0AEC0",
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
