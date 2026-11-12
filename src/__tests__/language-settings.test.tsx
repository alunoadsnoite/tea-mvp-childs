import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking, Pressable } from "react-native";
import renderer, { act } from "react-test-renderer";
import Settings from "../../app/settings";
import english from "@/lib/en-US.json";
import spanish from "@/lib/es-ES.json";
import { translate } from "@/lib/i18n";
import { localizeCrisisMessage, localizeRoutine } from "@/lib/localizedContent";
import { useLanguageStore } from "@/stores/languageStore";
import { DEFAULT_MESSAGES } from "@/types/crisis";
import { DEFAULT_ROUTINES } from "@/types/routine";

jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "View" }));

const languageKey = "language-storage";

beforeEach(async () => {
  await AsyncStorage.clear();
  useLanguageStore.getState().setLanguage("pt-BR");
});

afterEach(() => jest.restoreAllMocks());

test.each([
  ["English", "Choose how the app looks"],
  ["Español", "Elige la apariencia de la aplicación"],
])("updates the interface and restores %s from storage", async (label, text) => {
  let screen!: renderer.ReactTestRenderer;
  await act(async () => { screen = renderer.create(<Settings />); });
  const radio = (name: string) => screen.root.findAllByType(Pressable).find(
    (button) => button.props.accessibilityRole === "radio" && button.props.accessibilityLabel === name
  )!;
  expect(radio("Português (Brasil)").props.accessibilityState.checked).toBe(true);
  act(() => radio(label).props.onPress());
  expect(radio(label).props.accessibilityState.checked).toBe(true);
  expect(JSON.stringify(screen.toJSON())).toContain(text);
  const saved = (await AsyncStorage.getItem(languageKey))!;
  act(() => useLanguageStore.getState().setLanguage("pt-BR"));
  await AsyncStorage.setItem(languageKey, saved);
  await act(async () => { await useLanguageStore.persist.rehydrate(); });
  expect(radio(label).props.accessibilityState.checked).toBe(true);
  act(() => screen.unmount());
});

test("opens the developer address and explains what to do when email cannot open", async () => {
  const open = jest.spyOn(Linking, "openURL").mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error("No email app"));
  const alert = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  useLanguageStore.getState().setLanguage("es-ES");
  let screen!: renderer.ReactTestRenderer;
  await act(async () => { screen = renderer.create(<Settings />); });
  const link = screen.root.findAllByType(Pressable).find(
    (button) => button.props.accessibilityRole === "link" &&
      button.props.accessibilityLabel === "Enviar un correo al desarrollador"
  )!;
  await act(async () => { await link.props.onPress(); });
  expect(open).toHaveBeenCalledWith("mailto:valdenorsa@proton.me");
  expect(alert).not.toHaveBeenCalled();
  await act(async () => { await link.props.onPress(); });
  expect(alert).toHaveBeenCalledWith(
    "No se pudo abrir el correo", "Envía un correo a valdenorsa@proton.me."
  );
  act(() => screen.unmount());
});

test("translates built-in content while keeping saved edits and identifiers", () => {
  const t = translate["en-US"];
  const message = { ...DEFAULT_MESSAGES[0], content: "Meu texto personalizado {0}" };
  expect(localizeCrisisMessage(message, t)).toMatchObject({
    id: message.id, content: message.content, title: "I need help",
  });
  const routine = DEFAULT_ROUTINES[0];
  expect(localizeRoutine(routine, t).steps[0]).toMatchObject({
    id: routine.steps[0].id, title: "Wake up", estimatedMinutes: routine.steps[0].estimatedMinutes,
  });
});

test("both catalogs preserve the same interpolation tokens", () => {
  const tokens = (value: string) => (value.match(/\{\d+\}/g) ?? []).sort();
  expect(Object.keys(spanish).sort()).toEqual(Object.keys(english).sort());
  for (const [key, value] of Object.entries(english)) {
    expect(tokens(value)).toEqual(tokens(key));
    expect(tokens(spanish[key as keyof typeof spanish])).toEqual(tokens(key));
  }
});
