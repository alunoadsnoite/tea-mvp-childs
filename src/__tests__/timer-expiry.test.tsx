import React from "react";
import renderer, { act } from "react-test-renderer";
import { Animated, AppState, AppStateStatus, Easing } from "react-native";
import { VisualTimerBar } from "../components/VisualTimerBar";
import { useRoutineStore } from "../stores/routineStore";

jest.mock("../hooks/useThemeMode", () => ({
  useThemeMode: () => ({ colors: { accent: "blue", surface: "white" } }),
}));

let now = 1_800_000_000_000;
let onAppState: ((state: AppStateStatus) => void) | undefined;
const removeListener = jest.fn();
const startAnimation = jest.fn();
const stopAnimation = jest.fn();
let trees: renderer.ReactTestRenderer[];

beforeEach(() => {
  trees = [];
  now = 1_800_000_000_000;
  onAppState = undefined;
  jest.spyOn(Date, "now").mockImplementation(() => now);
  jest.spyOn(AppState, "addEventListener").mockImplementation((_event, listener) => {
    onAppState = listener;
    return { remove: removeListener };
  });
  jest.spyOn(Animated, "timing").mockReturnValue({
    start: startAnimation,
    stop: stopAnimation,
    reset: jest.fn(),
  });
  jest.spyOn(Animated.Value.prototype, "setValue");
  useRoutineStore.getState().resetToDefaults();
});

afterEach(() => {
  act(() => trees.forEach(tree => tree.unmount()));
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

function mount(startTime: number, endTime: number, isPaused = false, pausedAt?: number) {
  let tree!: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<VisualTimerBar startTime={startTime} endTime={endTime}
      isPaused={isPaused} pausedAt={pausedAt} />);
  });
  trees.push(tree);
  return tree;
}

test("a fresh two-minute step animates from full to empty over its remaining time", () => {
  mount(now, now + 120_000);
  expect(Animated.Value.prototype.setValue).toHaveBeenLastCalledWith(1);
  expect(Animated.timing).toHaveBeenLastCalledWith(expect.any(Animated.Value), {
    toValue: 0, duration: 120_000, easing: Easing.linear, useNativeDriver: false,
  });
});

test("reopening an expired running step starts empty instead of restarting its duration", () => {
  mount(now - 121_000, now - 1_000);
  expect(Animated.Value.prototype.setValue).toHaveBeenLastCalledWith(0);
  expect(Animated.timing).toHaveBeenLastCalledWith(expect.any(Animated.Value),
    expect.objectContaining({ toValue: 0, duration: 0 }));
});

test("returning from background after the deadline recalculates an empty timer", () => {
  const start = now;
  mount(start, start + 120_000);
  now += 121_000;
  act(() => onAppState?.("active"));
  expect(stopAnimation).toHaveBeenCalled();
  expect(Animated.Value.prototype.setValue).toHaveBeenLastCalledWith(0);
  expect(Animated.timing).toHaveBeenLastCalledWith(expect.any(Animated.Value),
    expect.objectContaining({ toValue: 0, duration: 0 }));
});

test("a paused step reopened after its old deadline retains the progress at pause", () => {
  const start = now;
  now += 150_000;
  mount(start, start + 120_000, true, start + 30_000);
  expect(Animated.Value.prototype.setValue).toHaveBeenLastCalledWith(0.75);
  expect(Animated.timing).not.toHaveBeenCalled();
});

test("rehydrating a paused routine and resuming preserves the remainder until expiry", async () => {
  const store = useRoutineStore;
  const routine = store.getState().routines.find(r => r.id === "default-morning")!;
  store.getState().startExecution(routine.id);
  now += 30_000;
  store.getState().pauseExecution();
  const saved = { ...store.getState().execution! };
  expect(saved.stepEndsAt! - saved.pausedAt!).toBe(90_000);
  // Allow AsyncStorage persistence, then discard only in-memory execution.
  await act(async () => { await Promise.resolve(); });
  const storage = store.persist.getOptions().storage!;
  const persisted = await storage.getItem("routine-storage-kids");
  expect(persisted).toEqual(expect.objectContaining({
    state: expect.objectContaining({ execution: saved }),
  }));
  store.setState({ execution: null });
  // Rehydrate the actual payload captured before the simulated process restart.
  await storage.setItem("routine-storage-kids", persisted!);
  now += 180_000;
  await store.persist.rehydrate();
  expect(store.getState().execution).toEqual(saved);
  store.getState().resumeExecution();
  const resumed = store.getState().execution!;
  expect(resumed.isPaused).toBe(false);
  expect(resumed.currentStepIndex).toBe(saved.currentStepIndex);
  expect(resumed.stepEndsAt! - now).toBe(90_000);
  now += 91_000;
  mount(resumed.stepStartedAt!, resumed.stepEndsAt!, resumed.isPaused);
  expect(Animated.Value.prototype.setValue).toHaveBeenLastCalledWith(0);
  // Timer expiry is visual: advancing the task remains the user's action.
  expect(store.getState().execution!.currentStepIndex).toBe(0);
  expect(store.getState().execution!.completedAt).toBeNull();
});

test("unmounting stops the animation and removes the app-state listener", () => {
  const tree = mount(now, now + 120_000);
  act(() => tree.unmount());
  trees = [];
  expect(stopAnimation).toHaveBeenCalled();
  expect(removeListener).toHaveBeenCalled();
});
