import * as Haptics from "expo-haptics";

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning";

export function useHapticFeedback() {
  const trigger = (type: HapticType = "light") => {
    try {
      switch (type) {
        case "light":
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          break;
        case "medium":
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          break;
        case "heavy":
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
          break;
        case "success":
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          break;
        case "warning":
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          break;
      }
    } catch {
      // Silenciosamente falha se haptics não estiver disponível
    }
  };

  return { trigger };
}
