import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCheckInStore } from "@/stores/checkInStore";

const diaryKey = "checkin-storage-kids";
const routinesKey = "routine-storage-kids";
const entry = { happiness: 3, energy: 4, calm: 2, triggers: ["noise"], note: "Teste" };

afterEach(async () => {
  jest.restoreAllMocks();
  await useCheckInStore.getState().clearHistory();
  await AsyncStorage.clear();
});

test("waits for a pending check-in before clearing the entire persisted diary", async () => {
  await AsyncStorage.setItem(diaryKey, JSON.stringify({
    state: { entries: [{ ...entry, id: "old", timestamp: Date.now() - 10 * 86400000 }] },
    version: 0,
  }));
  await AsyncStorage.setItem(routinesKey, "rotinas");
  await useCheckInStore.persist.rehydrate();
  useCheckInStore.getState().addEntry(entry);

  await useCheckInStore.getState().clearHistory();
  await useCheckInStore.persist.rehydrate();

  expect(useCheckInStore.getState().entries).toEqual([]);
  expect(JSON.parse((await AsyncStorage.getItem(diaryKey))!).state.entries).toEqual([]);
  expect(await AsyncStorage.getItem(routinesKey)).toBe("rotinas");
});

test("restores the diary and reports an unsuccessful write", async () => {
  await AsyncStorage.setItem(diaryKey, JSON.stringify({
    state: { entries: [{ ...entry, id: "saved", timestamp: Date.now() }] },
    version: 0,
  }));
  await useCheckInStore.persist.rehydrate();
  jest.spyOn(AsyncStorage, "setItem").mockRejectedValueOnce(new Error("storage unavailable"));

  await expect(useCheckInStore.getState().clearHistory()).rejects.toThrow("storage unavailable");
  expect(useCheckInStore.getState().entries).toHaveLength(1);
});
