import React, { useEffect } from "react";
import renderer, { act } from "react-test-renderer";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { EmergencyFab } from "../components/EmergencyFab";
import CrisisSettingsScreen from "../../app/crisis-settings";
import { ThemeMode, useThemeMode } from "../hooks/useThemeMode";
import { useCrisisStore } from "../stores/crisisStore";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({ Stack: { Screen: () => null }, useRouter: () => ({ push: mockPush }) }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

function ThemedEditor({ mode }: { mode: ThemeMode }) {
  const { changeMode } = useThemeMode();
  useEffect(() => { changeMode(mode); }, [changeMode, mode]);
  return <CrisisSettingsScreen />;
}

beforeEach(() => {
  mockPush.mockClear();
  useCrisisStore.getState().resetToDefaults();
});

test("footer SOS keeps a fixed decorative glyph while its accessible button opens Help", () => {
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<EmergencyFab />); });
  const button = tree.root.findByType(Pressable);
  const glyph = tree.root.findByType(Text);
  expect(glyph.props.allowFontScaling).toBe(false);
  expect(glyph.props.accessible).toBe(false);
  const touch = StyleSheet.flatten(button.props.style);
  expect(touch).toMatchObject({ width: 64, height: 64 });
  expect(StyleSheet.flatten(glyph.props.style).fontSize).toBe(28);
  expect(button.props.accessibilityLabel).toBe("Preciso de ajuda");
  act(() => button.props.onPress());
  expect(mockPush).toHaveBeenCalledTimes(1);
  expect(mockPush).toHaveBeenCalledWith("/crisis-card");
  act(() => tree.unmount());
});

test.each(["light", "dark"])("editor uses explicit readable text and field colors in %s", async mode => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => { tree = renderer.create(<ThemedEditor mode={mode as ThemeMode} />); });
  const expectedText = mode === "dark" ? "#E8E6E3" : "#2D3748";
  for (const value of ["💬 Mensagens", useCrisisStore.getState().messages[0].title, useCrisisStore.getState().messages[0].content, "Nova mensagem", "👥 Contatos de Emergência"]) {
    const text = tree.root.findAllByType(Text).find(node => node.props.children === value)!;
    expect(StyleSheet.flatten(text.props.style).color).toBe(expectedText);
  }
  const fields = tree.root.findAllByType(TextInput);
  expect(fields).toHaveLength(5);
  for (const field of fields) {
    expect(StyleSheet.flatten(field.props.style)).toMatchObject({
      color: expectedText, backgroundColor: mode === "dark" ? "#1A1D23" : "#F0F4F8",
    });
    expect(field.props.placeholderTextColor).toBe(expectedText);
    expect(field.props.accessibilityLabel).toBeTruthy();
  }
  const before = useCrisisStore.getState().messages.length;
  act(() => fields[0].props.onChangeText("Cartão fictício"));
  act(() => fields[1].props.onChangeText("Preciso de uma pausa tranquila."));
  const save = tree.root.findAllByType(Pressable).find(node => node.findAllByType(Text).some(text => text.props.children === "Salvar"))!;
  act(() => save.props.onPress());
  expect(useCrisisStore.getState().messages).toHaveLength(before + 1);
  expect(useCrisisStore.getState().messages.slice(-1)[0]).toMatchObject({ title: "Cartão fictício", content: "Preciso de uma pausa tranquila." });
  act(() => tree.unmount());
});
