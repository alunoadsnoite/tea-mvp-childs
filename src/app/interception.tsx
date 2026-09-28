import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCheckInStore } from "@/stores/checkInStore";
import { COMMON_TRIGGERS, REGULATION_SUGGESTIONS } from "@/types/checkin";

const EMOJI_LEVELS = ["😞", "😕", "😐", "🙂", "😄"];

export default function EmotionCheckInScreen() {
  const addEntry = useCheckInStore((state) => state.addEntry);
  
  const [happiness, setHappiness] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [calm, setCalm] = useState(3);
  
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleTrigger = (triggerId: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(triggerId)
        ? prev.filter((t) => t !== triggerId)
        : [...prev, triggerId]
    );
  };

  const getSuggestions = () => {
    const currentEntry = { happiness, energy, calm, triggers: selectedTriggers };
    return REGULATION_SUGGESTIONS.filter((s) => s.condition(currentEntry));
  };

  const handleSave = () => {
    addEntry({
      happiness,
      energy,
      calm,
      triggers: selectedTriggers,
    });
    setShowFeedback(true);
    
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const suggestions = getSuggestions();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Como estou me sentindo",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Felicidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>😊 Felicidade</Text>
          <Text style={styles.sectionDescription}>
            Como está seu coração?
          </Text>
          
          <View style={styles.emojiSelector}>
            {EMOJI_LEVELS.map((emoji, index) => (
              <Pressable
                key={index}
                style={[
                  styles.emojiButton,
                  happiness === index + 1 && styles.emojiButtonActive,
                ]}
                onPress={() => setHappiness(index + 1)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Energia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Energia</Text>
          <Text style={styles.sectionDescription}>
            Como está seu corpo?
          </Text>
          
          <View style={styles.emojiSelector}>
            {EMOJI_LEVELS.map((emoji, index) => (
              <Pressable
                key={index}
                style={[
                  styles.emojiButton,
                  energy === index + 1 && styles.emojiButtonActive,
                ]}
                onPress={() => setEnergy(index + 1)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Calma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧘 Calma</Text>
          <Text style={styles.sectionDescription}>
            Você está tranquilo(a)?
          </Text>
          
          <View style={styles.emojiSelector}>
            {EMOJI_LEVELS.map((emoji, index) => (
              <Pressable
                key={index}
                style={[
                  styles.emojiButton,
                  calm === index + 1 && styles.emojiButtonActive,
                ]}
                onPress={() => setCalm(index + 1)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Gatilhos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤔 O que aconteceu?</Text>
          <Text style={styles.sectionDescription}>
            Toque no que você está sentindo (opcional)
          </Text>
          
          <View style={styles.chipsContainer}>
            {COMMON_TRIGGERS.map((trigger) => (
              <Pressable
                key={trigger.id}
                style={[
                  styles.chip,
                  selectedTriggers.includes(trigger.id) && styles.chipSelected,
                ]}
                onPress={() => toggleTrigger(trigger.id)}
              >
                <Text style={styles.chipEmoji}>{trigger.emoji}</Text>
                <Text
                  style={[
                    styles.chipText,
                    selectedTriggers.includes(trigger.id) && styles.chipTextSelected,
                  ]}
                >
                  {trigger.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Sugestões */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>💡 Ideias para você</Text>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionCard}>
                <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
                <Text style={styles.suggestionText}>{suggestion.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Feedback */}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              ✅ Pronto! Você foi muito bem!
            </Text>
          </View>
        )}

        {/* Botão Salvar */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar 💾</Text>
        </Pressable>
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
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#2D3748",
    fontSize: 20,
    fontWeight: "700",
  },
  sectionDescription: {
    color: "#718096",
    fontSize: 14,
  },
  emojiSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  emojiButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  emojiButtonActive: {
    borderColor: "#63B3ED",
    backgroundColor: "#EBF8FF",
  },
  emojiText: {
    fontSize: 32,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    gap: 4,
  },
  chipSelected: {
    backgroundColor: "#EBF8FF",
    borderColor: "#63B3ED",
  },
  chipEmoji: {
    fontSize: 20,
  },
  chipText: {
    color: "#4A5568",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#2B6CB0",
    fontWeight: "600",
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionsTitle: {
    color: "#2D3748",
    fontSize: 16,
    fontWeight: "700",
  },
  suggestionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#63B3ED",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestionEmoji: {
    fontSize: 24,
  },
  suggestionText: {
    color: "#4A5568",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  feedbackContainer: {
    backgroundColor: "#C6F6D5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  feedbackText: {
    color: "#276749",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
