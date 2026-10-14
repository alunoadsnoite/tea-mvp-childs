import { useEffect } from "react";
import { create } from "zustand";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "@tea-kids-theme-mode";

interface ThemeState {
  mode: ThemeMode;
  isLoaded: boolean;
  changeMode: (mode: ThemeMode) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  isLoaded: false,
  changeMode: (mode) => {
    set({ mode, isLoaded: true });
    void AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  },
}));

let hydration: Promise<void> | null = null;
function loadTheme() {
  if (!hydration) {
    hydration = AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (!useThemeStore.getState().isLoaded && (saved === "light" || saved === "dark" || saved === "auto")) {
          useThemeStore.setState({ mode: saved });
        }
      })
      .catch(() => {})
      .finally(() => useThemeStore.setState({ isLoaded: true }));
  }
  return hydration;
}

export function useThemeMode() {
  const systemColorScheme = useColorScheme();
  const { mode, isLoaded, changeMode } = useThemeStore();
  useEffect(() => { void loadTheme(); }, []);

  // Quando systemColorScheme é null (indisponível), usa light como padrão
  const isDark = mode === "dark" || (mode === "auto" && systemColorScheme === "dark");

  return {
    mode,
    isDark,
    changeMode,
    isLoaded,
    colors: isDark
      ? {
          background: "#1A1D23",
          surface: "#22262E",
          text: "#E8E6E3",
          textSecondary: "#8A8782",
          accent: "#7B9EA8",
          accentLight: "#A8C5D1",
        }
      : {
          background: "#F0F4F8",
          surface: "#FFFFFF",
          text: "#2D3748",
          textSecondary: "#718096",
          accent: "#63B3ED",
          accentLight: "#90CDF4",
        },
  };
}
