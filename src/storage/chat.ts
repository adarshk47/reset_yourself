import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChatMessage } from "../data/types";
import { STORAGE_KEYS } from "./keys";

export async function getChatHistory(): Promise<ChatMessage[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.chatHistory);
  return raw ? JSON.parse(raw) : [];
}

export async function appendChatMessage(
  message: ChatMessage
): Promise<ChatMessage[]> {
  const history = await getChatHistory();
  const next = [...history, message];
  await AsyncStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(next));
  return next;
}

export async function clearChatHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.chatHistory);
}
