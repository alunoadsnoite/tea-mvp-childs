import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, AppState } from "react-native";
import { useThemeMode } from "@/hooks/useThemeMode";

interface VisualTimerBarProps {
  startTime: number;
  endTime: number;
  isPaused: boolean;
  color?: string;
  pausedAt?: number | null;
}

export function VisualTimerBar({
  startTime,
  endTime,
  isPaused,
  color,
  pausedAt,
}: VisualTimerBarProps) {
  const { colors } = useThemeMode();
  const fillColor = color || colors.accent;
  const progress = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      animationRef.current?.stop();
      const totalDuration = endTime - startTime;
      const now = isPaused ? pausedAt ?? Date.now() : Date.now();
      const remaining = Math.max(0, endTime - now);
      progress.setValue(totalDuration > 0 ? Math.min(1, remaining / totalDuration) : 0);
      if (isPaused) return;
      animationRef.current = Animated.timing(progress, {
        toValue: 0,
        duration: remaining,
        easing: Easing.linear,
        useNativeDriver: false,
      });
      animationRef.current.start();
    };
    updateProgress();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") updateProgress();
    });
    return () => {
      animationRef.current?.stop();
      subscription.remove();
    };
  }, [startTime, endTime, isPaused, pausedAt, progress]);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fillColor,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
  },
  track: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
});
