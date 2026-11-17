import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckInEntry } from "@/types/checkin";

interface CheckInStore {
  entries: CheckInEntry[];
  addEntry: (entry: Omit<CheckInEntry, "id" | "timestamp">) => void;
  getTodayEntries: () => CheckInEntry[];
  getRecentEntries: (days: number) => CheckInEntry[];
  getLastEntry: () => CheckInEntry | null;
  clearHistory: () => Promise<void>;
}

// Keep asynchronous writes in order so a pending check-in cannot restore a cleared diary.
let pendingWrite: Promise<void> = Promise.resolve();
const diaryStorage = createJSONStorage<CheckInStore>(() => ({
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => {
    const write = pendingWrite.catch(() => {}).then(() => AsyncStorage.setItem(key, value));
    pendingWrite = write;
    // Zustand does not await ordinary writes. The erase action observes its own result.
    void write.catch(() => {});
    return write;
  },
  removeItem: (key) => AsyncStorage.removeItem(key),
}));

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: CheckInEntry = {
          ...entry,
          id: `checkin-${Date.now()}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },

      getTodayEntries: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();
        
        return get().entries.filter(
          (entry) => entry.timestamp >= todayTimestamp
        );
      },

      getRecentEntries: (days: number) => {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        return get()
          .entries.filter((entry) => entry.timestamp >= cutoff)
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      getLastEntry: () => {
        const entries = get().entries;
        return entries.length > 0 ? entries[entries.length - 1] : null;
      },

      clearHistory: async () => {
        const previous = get().entries;
        set({ entries: [] });
        try {
          await pendingWrite;
        } catch (error) {
          set((state) => ({ entries: [...previous, ...state.entries] }));
          throw error;
        }
      },
    }),
    {
      name: "checkin-storage-kids",
      storage: diaryStorage,
    }
  )
);
