import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Language } from "../data/types";
import { STORAGE_KEYS } from "./keys";

const DEFAULT_LANGUAGE: Language = "en";

export async function getLanguage(): Promise<Language> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.language);
  return raw === "hi" || raw === "en" ? raw : DEFAULT_LANGUAGE;
}

export async function setLanguage(language: Language): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.language, language);
}
