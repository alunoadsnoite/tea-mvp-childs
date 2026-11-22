import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import renderer, { act } from "react-test-renderer";
import { ScrollView, Pressable } from "react-native";
import { CrisisCardModal } from "../components/CrisisCardModal";
import { useCrisisStore } from "../stores/crisisStore";
import { useRoutineStore } from "../stores/routineStore";
import RoutinesListScreen from "../../app/routines";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ push: mockPush }),
}));
jest.mock("../hooks/useHapticFeedback", () => ({ useHapticFeedback: () => ({ trigger: jest.fn() }) }));
jest.mock("../hooks/useThemeMode", () => ({ useThemeMode: () => ({ colors: { text: "black", textSecondary: "gray", background: "white", accent: "blue" } }) }));
jest.mock("react-native-safe-area-context", () => ({ SafeAreaView: "SafeAreaView" }));

beforeEach(() => {
  useCrisisStore.getState().resetToDefaults();
  useRoutineStore.getState().resetToDefaults();
  mockPush.mockClear();
});

function cardTree() {
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<CrisisCardModal />); });
  return tree;
}

test("reopening card 2 aligns its saved selection, page offset and counter", () => {
  useCrisisStore.getState().setActiveMessage(useCrisisStore.getState().messages[1].id);
  const tree = cardTree();
  const pages = tree.root.findAllByType(ScrollView);
  expect(pages[0].props.contentOffset.x).toBeGreaterThan(0);
  expect(JSON.stringify(tree.toJSON())).toContain('2');
  act(() => tree.unmount());
});

test("deleting the active final card immediately falls back to a visible default", () => {
  useCrisisStore.getState().addMessage({ title: "Test help", content: "Quiet moment", emoji: "💬" });
  const id = useCrisisStore.getState().messages.slice(-1)[0].id;
  useCrisisStore.getState().setActiveMessage(id);
  const tree = cardTree();
  act(() => useCrisisStore.getState().deleteMessage(id));
  expect(tree.toJSON()).not.toBeNull();
  expect(tree.root.findAllByType(ScrollView)[0].props.contentOffset.x).toBe(0);
  expect(JSON.stringify(tree.toJSON())).toContain("Preciso de ajuda");
  act(() => tree.unmount());
});

test("each help page can scroll vertically instead of shrinking enlarged text", () => {
  const tree = cardTree();
  const pages = tree.root.findAllByType(ScrollView).filter(v => !v.props.horizontal);
  expect(pages).toHaveLength(useCrisisStore.getState().messages.length);
  for (const page of pages) expect(page.props.nestedScrollEnabled).toBe(true);
  act(() => tree.unmount());
});

test("opening a persisted paused routine preserves all execution timestamps", () => {
  const routine = useRoutineStore.getState().routines[0];
  useRoutineStore.getState().startExecution(routine.id);
  useRoutineStore.getState().pauseExecution();
  const saved = { ...useRoutineStore.getState().execution };
  let tree!: renderer.ReactTestRenderer;
  act(() => { tree = renderer.create(<RoutinesListScreen />); });
  const button = tree.root.findAllByType(Pressable).find(p => p.props.accessibilityLabel === `Voltar à rotina ${routine.name}`)!;
  act(() => button.props.onPress());
  expect(useRoutineStore.getState().execution).toEqual(saved);
  expect(mockPush).toHaveBeenCalledWith("/routine-execution");
  act(() => tree.unmount());
});


test("rehydrating a paused routine keeps its remaining time when reopened and resumed", async () => {
  const clock = jest.spyOn(Date, "now");
  let tree: renderer.ReactTestRenderer | undefined;
  try {
    clock.mockReturnValue(1000000);
    const routine = useRoutineStore.getState().routines[0];
    useRoutineStore.getState().startExecution(routine.id);
    clock.mockReturnValue(1030000);
    useRoutineStore.getState().pauseExecution();
    const paused = { ...useRoutineStore.getState().execution! };
    const saved = await AsyncStorage.getItem("routine-storage-kids");
    expect(saved).not.toBeNull();
    // Simulate the in-memory state being lost, then load the saved bytes again.
    useRoutineStore.setState({ execution: null });
    await AsyncStorage.setItem("routine-storage-kids", saved!);
    clock.mockReturnValue(1630000);
    await act(async () => { await useRoutineStore.persist.rehydrate(); });
    expect(useRoutineStore.getState().execution).toEqual(paused);
    act(() => { tree = renderer.create(<RoutinesListScreen />); });
    const button = tree!.root.findAllByType(Pressable).find(p => p.props.accessibilityLabel === `Voltar à rotina ${routine.name}`)!;
    act(() => button.props.onPress());
    expect(useRoutineStore.getState().execution).toEqual(paused);
    act(() => useRoutineStore.getState().resumeExecution());
    const resumed = useRoutineStore.getState().execution!;
    expect(resumed.isPaused).toBe(false);
    expect(resumed.stepEndsAt! - Date.now()).toBe(paused.stepEndsAt! - paused.pausedAt!);
    expect(resumed.currentStepIndex).toBe(paused.currentStepIndex);
  } finally {
    if (tree) act(() => tree!.unmount());
    clock.mockRestore();
  }
});
