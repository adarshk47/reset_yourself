import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Goal } from "../data/types";
import { STORAGE_KEYS } from "./keys";

export async function getGoals(): Promise<Goal[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.goals);
  return raw ? JSON.parse(raw) : [];
}

export async function addGoal(goal: Goal): Promise<Goal[]> {
  const goals = await getGoals();
  const next = [...goals, goal];
  await AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(next));
  return next;
}

export async function deleteGoal(id: string): Promise<Goal[]> {
  const goals = await getGoals();
  const next = goals.filter((goal) => goal.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(next));
  return next;
}

export async function getGoal(id: string): Promise<Goal | undefined> {
  const goals = await getGoals();
  return goals.find((goal) => goal.id === id);
}
