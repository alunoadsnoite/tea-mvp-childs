import React, { useEffect } from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable, StyleSheet, Text } from "react-native";
import RoutinesListScreen from "../../app/routines";
import { ThemeMode, useThemeMode } from "../hooks/useThemeMode";
import { useRoutineStore } from "../stores/routineStore";

jest.mock("expo-router", () => ({ Stack: { Screen: () => null }, useRouter: () => ({ push: jest.fn() }) }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

function Screen({ mode }: { mode: ThemeMode }) {
  const { changeMode } = useThemeMode();
  useEffect(() => { changeMode(mode); }, [changeMode, mode]);
  return <RoutinesListScreen />;
}

function luminance(hex: string) {
  const rgb = hex.slice(1).match(/../g)!.map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test.each(["light", "dark"])("routine labels and primary actions remain readable in %s", async mode => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<Screen mode={mode as ThemeMode} />); });
  const surface = mode === "dark" ? "#22262E" : "#FFFFFF";
  const routine = useRoutineStore.getState().routines[0];
  for (const value of [routine.name, routine.description, routine.steps[0].title]) {
    const label = tree.root.findAllByType(Text).find(node => node.props.children === value)!;
    expect(label).toBeDefined();
    expect(contrast(StyleSheet.flatten(label.props.style).color, surface)).toBeGreaterThanOrEqual(4.5);
  }
  const button = tree.root.findAllByType(Pressable)[0];
  const label = button.findByType(Text);
  expect(contrast(StyleSheet.flatten(label.props.style).color, StyleSheet.flatten(button.props.style).backgroundColor)).toBeGreaterThanOrEqual(4.5);
  act(() => tree.unmount());
});
