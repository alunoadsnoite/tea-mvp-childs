import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";

export default function CopingCardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const getCardById = useCopingCardsStore((state) => state.getCardById);
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const card = getCardById(id as string);

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cartão não encontrado</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isLastStep = currentStep === card.steps.length - 1;

  const handleNextStep = () => {
    if (isLastStep) {
      setIsComplete(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: card.title,
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
          headerRight: () => (
            <Pressable
              onPress={() => toggleFavorite(card.id)}
              style={styles.headerFavorite}
            >
              <Text style={styles.headerFavoriteIcon}>
                {card.isFavorite ? "⭐" : "☆"}
              </Text>
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Descrição */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={styles.description}>{card.description}</Text>
        </View>

        {/* Progresso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Passo {Math.min(currentStep + 1, card.steps.length)} de {card.steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentStep + 1) / card.steps.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Passo atual */}
        {!isComplete ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>Passo {currentStep + 1}</Text>
            <Text style={styles.stepText}>{card.steps[currentStep]}</Text>
          </View>
        ) : (
          <View style={styles.completedCard}>
            <Text style={styles.completedEmoji}>🎉</Text>
            <Text style={styles.completedText}>
              Muito bem! Você conseguiu!
            </Text>
          </View>
        )}

        {/* Navegação entre passos */}
        {!isComplete && (
          <View style={styles.actions}>
            {currentStep > 0 && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.secondaryButtonText}>⬅️ Voltar</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={handleNextStep}
            >
              <Text style={styles.primaryButtonText}>
                {isLastStep ? "Terminar 🏁" : "Próximo ➡️"}
              </Text>
            </Pressable>
          </View>
        )}

        {isComplete && (
          <View style={styles.actions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={handleRestart}
            >
              <Text style={styles.secondaryButtonText}>🔄 Recomeçar</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryButtonText}>Voltar</Text>
            </Pressable>
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
  headerFavorite: {
    padding: 8,
    marginRight: 8,
  },
  headerFavoriteIcon: {
    color: "#D69E2E",
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  descriptionContainer: {
    alignItems: "center",
    gap: 12,
  },
  cardEmoji: {
    fontSize: 64,
  },
  description: {
    color: "#4A5568",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
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
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    gap: 16,
  },
  stepNumber: {
    color: "#718096",
    fontSize: 14,
    textAlign: "center",
  },
  stepText: {
    color: "#2D3748",
    fontSize: 24,
    lineHeight: 34,
    textAlign: "center",
    fontWeight: "600",
  },
  completedCard: {
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
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#4A5568",
    fontSize: 16,
  },
});
