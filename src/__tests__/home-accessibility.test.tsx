import React from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../../app/index";

jest.mock("expo-router", () => ({ Link: "Link" }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));
jest.mock("../components/CheckInCard", () => ({ CheckInCard: "CheckInCard" }));

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)!.map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

test.each(["light", "dark"])("Home Help label has at least 4.5:1 contrast in %s theme", async mode => {
  await AsyncStorage.setItem("@tea-kids-theme-mode", mode);
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<HomeScreen />); });
  const button = tree.root.findAllByType(Pressable).find(node => node.props.accessibilityLabel === "Preciso de ajuda")!;
  const label = button.findAllByType(Text).find(node => node.props.children === "Preciso de ajuda")!;
  const foreground = luminance(StyleSheet.flatten(label.props.style).color);
  const background = luminance(StyleSheet.flatten(button.props.style).backgroundColor);
  expect((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)).toBeGreaterThanOrEqual(4.5);
  const scroll = tree.root.findByType(ScrollView);
  expect(scroll.findAllByType(Text).some(node => node.props.children === "Configurar")).toBe(true);
  act(() => tree.unmount());
});
