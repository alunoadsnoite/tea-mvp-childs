import { useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_STORAGE_KEY = "@tea-kids-theme-mode";

export function useThemeMode() {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (isMounted) {
        if (saved === "light" || saved === "dark" || saved === "auto") {
          setMode(saved);
        }
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const changeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newMode).catch(() => {
      // Silenciosamente falha se não conseguir salvar
    });
  }, []);

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
