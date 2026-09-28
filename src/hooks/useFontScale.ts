import { PixelRatio } from "react-native";

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;

export function useFontScale() {
  const scale = PixelRatio.getFontScale();
  const clampedScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);

  return {
    scale: clampedScale,
    fontSize: (size: number) => Math.round(size * clampedScale),
  };
}
