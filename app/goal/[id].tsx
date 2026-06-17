import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { VerseCard } from "../../src/components/VerseCard";
import versesData from "../../src/data/verses.json";
import type { GitaData, Goal, Language, Verse } from "../../src/data/types";
import { deleteGoal, getGoal } from "../../src/storage/goals";
import { getLanguage } from "../../src/storage/settings";

const verses = (versesData as GitaData).verses;
const versesById = new Map(verses.map((verse) => [verse.id, verse]));

export default function GoalDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [verse, setVerse] = useState<Verse | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [storedGoal, lang] = await Promise.all([getGoal(id), getLanguage()]);
        setGoal(storedGoal ?? null);
        setLanguage(lang);
        setVerse(storedGoal ? versesById.get(storedGoal.guidingVerseId) ?? null : null);
      })();
    }, [id])
  );

  const handleDelete = useCallback(() => {
    Alert.alert("Delete goal?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteGoal(id);
          router.back();
        },
      },
    ]);
  }, [id, router]);

  const handleAskForGuidance = useCallback(() => {
    router.push({
      pathname: "/(tabs)/chat",
      params: { goalTitle: goal?.title ?? "" },
    });
  }, [goal, router]);

  if (!goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Goal not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{goal.title}</Text>
      <Text style={styles.label}>Your guiding shlok</Text>
      {verse ? <VerseCard verse={verse} language={language} /> : null}

      <Pressable style={styles.primaryButton} onPress={handleAskForGuidance}>
        <Text style={styles.primaryButtonText}>Ask for guidance in Chat</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete goal</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: "#FAFAFA",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notFound: {
    fontSize: 16,
    color: "#888888",
  },
  primaryButton: {
    backgroundColor: "#3D5A80",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  deleteButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#B23A48",
    fontWeight: "600",
  },
});
