import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routine, RoutineExecutionState, DEFAULT_ROUTINES } from "@/types/routine";

interface RoutineStore {
  routines: Routine[];
  execution: RoutineExecutionState | null;
  addRoutine: (routine: Omit<Routine, "id" | "createdAt">) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  startExecution: (routineId: string) => void;
  pauseExecution: () => void;
  resumeExecution: () => void;
  completeStep: () => void;
  extendTime: (minutes: number) => void;
  stopExecution: () => void;
  getRoutineById: (id: string) => Routine | undefined;
  resetToDefaults: () => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: DEFAULT_ROUTINES,
      execution: null,

      addRoutine: (routine) => {
        const newRoutine: Routine = {
          ...routine,
          id: `routine-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({
          routines: [...state.routines, newRoutine],
        }));
      },

      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRoutine: (id) => {
        const state = get();
        const routine = state.routines.find((r) => r.id === id);
        if (routine?.isDefault) return;

        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
          execution: state.execution?.routineId === id ? null : state.execution,
        }));
      },

      startExecution: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId);
        if (!routine || routine.steps.length === 0) return;

        const now = Date.now();
        const firstStep = routine.steps[0];
        
        set({
          execution: {
            routineId,
            currentStepIndex: 0,
            isRunning: true,
            isPaused: false,
            pausedAt: null,
            startedAt: now,
            completedAt: null,
            stepStartedAt: now,
            stepEndsAt: now + firstStep.estimatedMinutes * 60 * 1000,
            extendedMinutes: 0,
          },
        });
      },

      pauseExecution: () => {
        set((state) => {
          if (!state.execution || !state.execution.isRunning || state.execution.isPaused) return state;
          return {
            execution: {
              ...state.execution,
              isPaused: true,
              pausedAt: Date.now(),
            },
          };
        });
      },

      resumeExecution: () => {
        set((state) => {
          if (!state.execution || !state.execution.isPaused) return state;
          
          const pausedDuration = Math.max(0, Date.now() - (state.execution.pausedAt ?? Date.now()));
          return {
            execution: {
              ...state.execution,
              isPaused: false,
              pausedAt: null,
              stepStartedAt: (state.execution.stepStartedAt ?? Date.now()) + pausedDuration,
              stepEndsAt: (state.execution.stepEndsAt ?? Date.now()) + pausedDuration,
            },
          };
        });
      },

      completeStep: () => {
        set((state) => {
          if (!state.execution || !state.execution.isRunning) return state;

          const routine = get().routines.find(
            (r) => r.id === state.execution!.routineId
          );
          if (!routine) return state;

          const nextIndex = state.execution.currentStepIndex + 1;
          
          if (nextIndex >= routine.steps.length) {
            return {
              execution: {
                ...state.execution,
                isRunning: false,
                isPaused: false,
                pausedAt: null,
                completedAt: Date.now(),
              },
            };
          }

          const nextStep = routine.steps[nextIndex];
          const now = Date.now();
          
          return {
            execution: {
              ...state.execution,
              currentStepIndex: nextIndex,
              isPaused: false,
              pausedAt: null,
              stepStartedAt: now,
              stepEndsAt: now + nextStep.estimatedMinutes * 60 * 1000,
              extendedMinutes: 0,
            },
          };
        });
      },

      extendTime: (minutes) => {
        if (!Number.isFinite(minutes) || minutes <= 0) return;
        set((state) => {
          if (!state.execution || !state.execution.isRunning) return state;
          
          const now = state.execution.isPaused ? state.execution.pausedAt ?? Date.now() : Date.now();
          const newEndTime = Math.max(state.execution.stepEndsAt ?? now, now) + minutes * 60 * 1000;
          
          return {
            execution: {
              ...state.execution,
              stepEndsAt: newEndTime,
              extendedMinutes: state.execution.extendedMinutes + minutes,
            },
          };
        });
      },

      stopExecution: () => {
        set({ execution: null });
      },

      getRoutineById: (id) => {
        return get().routines.find((r) => r.id === id);
      },

      resetToDefaults: () => {
        set({
          routines: DEFAULT_ROUTINES,
          execution: null,
        });
      },
    }),
    {
      name: "routine-storage-kids",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
