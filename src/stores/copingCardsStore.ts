import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CopingCard, DEFAULT_COPING_CARDS } from "@/types/coping";

interface CopingCardsStore {
  cards: CopingCard[];
  addCard: (card: Omit<CopingCard, "id" | "createdAt" | "isDefault">) => void;
  updateCard: (id: string, updates: Partial<CopingCard>) => void;
  deleteCard: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getCardsByCategory: (category: string) => CopingCard[];
  getFavoriteCards: () => CopingCard[];
  getCardById: (id: string) => CopingCard | undefined;
  resetToDefaults: () => void;
}

export const useCopingCardsStore = create<CopingCardsStore>()(
  persist(
    (set, get) => ({
      cards: DEFAULT_COPING_CARDS,

      addCard: (card) => {
        const newCard: CopingCard = {
          ...card,
          id: `card-${Date.now()}`,
          isDefault: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          cards: [...state.cards, newCard],
        }));
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCard: (id) => {
        const state = get();
        const card = state.cards.find((c) => c.id === id);
        if (card?.isDefault) return;

        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
          ),
        }));
      },

      getCardsByCategory: (category) => {
        return get().cards.filter((c) => c.category === category);
      },

      getFavoriteCards: () => {
        return get().cards.filter((c) => c.isFavorite);
      },

      getCardById: (id) => {
        return get().cards.find((c) => c.id === id);
      },

      resetToDefaults: () => {
        set({ cards: DEFAULT_COPING_CARDS });
      },
    }),
    {
      name: "coping-cards-storage-kids",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
