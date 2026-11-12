import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isLanguage, type Language } from "@/lib/i18n";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

const useLanguageLoadingStore = create(() => ({ finished: false }));

export function useLanguageHydrated() {
  return useLanguageLoadingStore((state) => state.finished);
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "pt-BR",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        const saved = (persisted as Partial<LanguageStore> | undefined)?.language;
        return { ...current, language: isLanguage(saved) ? saved : current.language };
      },
      onRehydrateStorage: () => () => {
        useLanguageLoadingStore.setState({ finished: true });
      },
    }
  )
);
