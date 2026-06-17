import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

const MAX_HISTORY = 5;

export async function getRecentVerseIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.recentVerseIds);
  return raw ? JSON.parse(raw) : [];
}

export async function recordShownVerse(verseId: string): Promise<void> {
  const recent = await getRecentVerseIds();
  const next = [verseId, ...recent.filter((id) => id !== verseId)].slice(
    0,
    MAX_HISTORY
  );
  await AsyncStorage.setItem(STORAGE_KEYS.recentVerseIds, JSON.stringify(next));
}
