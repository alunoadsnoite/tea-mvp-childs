import React, { useEffect } from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { ThemeMode, useThemeMode } from "../hooks/useThemeMode";
import HomeScreen from "../../app/index";
import SettingsScreen from "../../app/settings";

// Cold React Native initialization can exceed Jest's 5 s default on a busy host.
jest.setTimeout(15000);

const mockPush = jest.fn();
// Exercise the real locked Slot style merge used by Link asChild. Only the
// navigation hook is replaced; replacing Link with a host string hid TAB02.
jest.mock("expo-router", () => {
  const React = jest.requireActual("react");
  const { Slot } = jest.requireActual("@radix-ui/react-slot");
  return { Stack: { Screen: () => null }, Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    React.createElement(Slot, { onPress: () => mockPush(href) }, children) };
});

function ThemedHome({ mode }: { mode: ThemeMode }) {
  const { changeMode } = useThemeMode();
  useEffect(() => { changeMode(mode); }, [changeMode, mode]);
  return <HomeScreen />;
}

beforeEach(() => mockPush.mockClear());
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));
jest.mock("../components/CheckInCard", () => ({ CheckInCard: "CheckInCard" }));
jest.mock("../hooks/useHapticFeedback", () => ({ useHapticFeedback: () => ({ trigger: jest.fn() }) }));

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)!.map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

test.each(["light", "dark"])("Home Help label has at least 4.5:1 contrast in %s theme", async mode => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<ThemedHome mode={mode as ThemeMode} />); });
  const button = tree.root.findAllByType(Pressable).find(node => node.props.accessibilityLabel === "Preciso de ajuda")!;
  const effectiveStyle = StyleSheet.flatten(button.props.style);
  expect(effectiveStyle.backgroundColor).toBe(mode === "dark" ? "#7B9EA8" : "#63B3ED");
  expect(effectiveStyle).toMatchObject({ width: "100%", minHeight: 80, paddingVertical: 24 });
  expect(Object.keys(effectiveStyle)).not.toContain("0");
  const label = button.findAllByType(Text).find(node => node.props.children === "Preciso de ajuda")!;
  const foreground = luminance(StyleSheet.flatten(label.props.style).color);
  const background = luminance(StyleSheet.flatten(button.props.style).backgroundColor);
  expect((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)).toBeGreaterThanOrEqual(4.5);
  const scroll = tree.root.findByType(ScrollView);
  expect(scroll.findAllByType(Text).some(node => node.props.children === "Configurar")).toBe(true);
  act(() => tree.unmount());
});

test("all Home navigation buttons retain their surfaces and forward one tap", async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<ThemedHome mode="dark" />); });
  const buttons = tree.root.findAllByType(Pressable);
  expect(buttons).toHaveLength(5);
  for (const button of buttons) {
    const style = StyleSheet.flatten(button.props.style);
    expect(style.backgroundColor).toMatch(/^#[0-9A-F]{6}$/i);
    expect(style.paddingVertical).toBeGreaterThan(0);
    expect(Object.keys(style)).not.toContain("0");
    act(() => button.props.onPress());
  }
  expect(mockPush.mock.calls).toEqual([
    ["/crisis-card"], ["/interception"], ["/routines"], ["/regulation"], ["/settings"],
  ]);
  act(() => tree.unmount());
});

test("Settings help-card link retains its surface through Slot", async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<SettingsScreen />); });
  act(() => tree.root.findAllByType(Pressable).find(node => node.props.accessibilityLabel === "Escuro")!.props.onPress());
  const button = tree.root.findAllByType(Pressable).find(node => node.props.accessibilityLabel === "Configurar cartões de ajuda")!;
  const style = StyleSheet.flatten(button.props.style);
  expect(style.backgroundColor).toBe("#22262E");
  expect(style).toMatchObject({ padding: 20, borderWidth: 2, borderRadius: 16 });
  act(() => button.props.onPress());
  expect(mockPush).toHaveBeenCalledTimes(1);
  expect(mockPush).toHaveBeenCalledWith("/crisis-settings");
  act(() => tree.unmount());
});
