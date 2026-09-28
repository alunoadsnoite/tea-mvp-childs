import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "@tea-kids-theme-mode";

export function useThemeMode() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "auto") {
        setMode(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const changeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

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
