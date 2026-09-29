import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface VisualTimerBarProps {
  startTime: number;
  endTime: number;
  isPaused: boolean;
  color?: string;
}

export function VisualTimerBar({
  startTime,
  endTime,
  isPaused,
  color = "#63B3ED",
}: VisualTimerBarProps) {
  const progress = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const totalDuration = endTime - startTime;
    const remaining = Math.max(0, endTime - Date.now());
    const progressValue = totalDuration > 0 ? remaining / totalDuration : 0;

    progress.setValue(1);

    if (isPaused) {
      animationRef.current?.stop();
      return;
    }

    animationRef.current = Animated.timing(progress, {
      toValue: progressValue,
      duration: remaining,
      useNativeDriver: false,
    });

    animationRef.current.start();

    return () => {
      animationRef.current?.stop();
    };
  }, [startTime, endTime, isPaused]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
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
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
});
