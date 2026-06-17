import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Goal, Verse } from "../data/types";

interface GoalListItemProps {
  goal: Goal;
  guidingVerse?: Verse;
  onPress: () => void;
}

export function GoalListItem({ goal, guidingVerse, onPress }: GoalListItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.title}>{goal.title}</Text>
      {guidingVerse ? (
        <Text style={styles.preview} numberOfLines={2}>
          {guidingVerse.translations.en}
        </Text>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.reference}>
          {guidingVerse ? `BG ${guidingVerse.chapter}.${guidingVerse.verseNumber}` : ""}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  preview: {
    fontSize: 13,
    color: "#555555",
    marginTop: 6,
  },
  footer: {
    marginTop: 8,
  },
  reference: {
    fontSize: 12,
    color: "#8A6D1D",
    fontWeight: "600",
  },
});
