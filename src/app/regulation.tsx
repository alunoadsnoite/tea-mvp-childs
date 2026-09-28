import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useCopingCardsStore } from "@/stores/copingCardsStore";
import { CopingCardCategory } from "@/types/coping";

export default function CopingCardsScreen() {
  const router = useRouter();
  const cards = useCopingCardsStore((state) => state.cards);
  const toggleFavorite = useCopingCardsStore((state) => state.toggleFavorite);
  
  const [selectedCategory, setSelectedCategory] = useState<CopingCardCategory | "all">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories: { key: CopingCardCategory | "all"; label: string; emoji: string }[] = [
    { key: "all", label: "Todos", emoji: "📋" },
    { key: "breathing", label: "Respiração", emoji: "🌬️" },
    { key: "grounding", label: "Acalmar", emoji: "🧘" },
    { key: "movement", label: "Movimento", emoji: "🏃" },
    { key: "creative", label: "Criativo", emoji: "🎨" },
  ];

  const filteredCards = cards.filter((card) => {
    const categoryMatch = selectedCategory === "all" || card.category === selectedCategory;
    const favoriteMatch = !showFavoritesOnly || card.isFavorite;
    return categoryMatch && favoriteMatch;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });

  const handleCardPress = (cardId: string) => {
    router.push(`/coping-card/${cardId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Hora de Acalmar",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
        }}
      />
      
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryFilters}>
            {categories.map((cat) => (
              <Pressable
                key={cat.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.key && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === cat.key && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable
          style={[
            styles.favoriteFilter,
            showFavoritesOnly && styles.favoriteFilterActive,
          ]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Text
            style={[
              styles.favoriteFilterText,
              showFavoritesOnly && styles.favoriteFilterTextActive,
            ]}
          >
            {showFavoritesOnly ? "⭐ Favoritos" : "☆ Favoritos"}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {sortedCards.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum cartão encontrado
          </Text>
        ) : (
          sortedCards.map((card) => (
            <View key={card.id} style={styles.cardContainer}>
              <Pressable
                style={styles.card}
                onPress={() => handleCardPress(card.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{card.emoji}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                  </View>
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(card.id)}
                    accessibilityLabel={card.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  >
                    <Text style={styles.favoriteIcon}>
                      {card.isFavorite ? "⭐" : "☆"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          ))
        )}

        {/* Atalho para respiração guiada */}
        <Pressable
          style={styles.breathingShortcut}
          onPress={() => router.push("/breathing-guide")}
        >
          <Text style={styles.breathingShortcutEmoji}>🌬️</Text>
          <Text style={styles.breathingShortcutTitle}>
            Respiração Guiada
          </Text>
          <Text style={styles.breathingShortcutDescription}>
            Exercícios divertidos para acalmar
          </Text>
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
  filters: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  categoryFilters: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryButtonActive: {
    backgroundColor: "#EBF8FF",
    borderColor: "#63B3ED",
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryButtonText: {
    color: "#4A5568",
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: "#2B6CB0",
    fontWeight: "600",
  },
  favoriteFilter: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  favoriteFilterActive: {
    backgroundColor: "#FEFCBF",
    borderColor: "#D69E2E",
  },
  favoriteFilterText: {
    color: "#4A5568",
    fontSize: 14,
  },
  favoriteFilterTextActive: {
    color: "#975A16",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyText: {
    color: "#A0AEC0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  cardContainer: {
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#2D3748",
    fontSize: 18,
    fontWeight: "700",
  },
  cardDescription: {
    color: "#718096",
    fontSize: 14,
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  breathingShortcut: {
    backgroundColor: "#EBF8FF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#63B3ED",
    marginTop: 8,
    alignItems: "center",
    gap: 8,
  },
  breathingShortcutEmoji: {
    fontSize: 40,
  },
  breathingShortcutTitle: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "700",
  },
  breathingShortcutDescription: {
    color: "#718096",
    fontSize: 14,
  },
});
