import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { GoalListItem } from "../../src/components/GoalListItem";
import { VerseCard } from "../../src/components/VerseCard";
import themeConfigJson from "../../src/data/themeConfig.json";
import versesData from "../../src/data/verses.json";
import type { GitaData, Goal, Language, ThemeConfig, Verse } from "../../src/data/types";
import { selectGoalSupportVerse } from "../../src/engine/verseSelector";
import { addGoal, getGoals } from "../../src/storage/goals";
import { getRecentVerseIds, recordShownVerse } from "../../src/storage/history";
import { getLanguage } from "../../src/storage/settings";

const config = themeConfigJson as ThemeConfig;
const verses = (versesData as GitaData).verses;
const versesById = new Map(verses.map((verse) => [verse.id, verse]));

function todaySeed(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [todaysVerse, setTodaysVerse] = useState<Verse | null>(null);
  const [title, setTitle] = useState("");

  const loadData = useCallback(async () => {
    const [storedGoals, lang, recent] = await Promise.all([
      getGoals(),
      getLanguage(),
      getRecentVerseIds(),
    ]);
    setGoals(storedGoals);
    setLanguage(lang);
    setTodaysVerse(selectGoalSupportVerse(config, verses, recent, todaySeed()));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleAddGoal = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const id = `goal-${Date.now()}`;
    const recent = await getRecentVerseIds();
    const guidingVerse = selectGoalSupportVerse(config, verses, recent, id);
    await recordShownVerse(guidingVerse.id);
    const goal: Goal = {
      id,
      title: trimmed,
      guidingVerseId: guidingVerse.id,
      createdAt: new Date().toISOString(),
    };
    const next = await addGoal(goal);
    setGoals(next);
    setTitle("");
  }, [title]);

  const listHeader = useMemo(
    () => (
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Today's Wisdom</Text>
        {todaysVerse ? (
          <VerseCard verse={todaysVerse} language={language} />
        ) : null}
        <Text style={styles.sectionTitle}>Your Goals</Text>
      </View>
    ),
    [todaysVerse, language]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No goals yet. Add one below to get a guiding shlok.
          </Text>
        }
        renderItem={({ item }) => (
          <GoalListItem
            goal={item}
            guidingVerse={versesById.get(item.guidingVerseId)}
            onPress={() => router.push(`/goal/${item.id}`)}
          />
        )}
      />
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="What's your goal?"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAddGoal}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleAddGoal}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  listContent: {
    padding: 16,
    paddingBottom: 8,
  },
  headerSection: {
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  empty: {
    color: "#888888",
    fontSize: 14,
    marginTop: 8,
  },
  addRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E2E2",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#3D5A80",
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
