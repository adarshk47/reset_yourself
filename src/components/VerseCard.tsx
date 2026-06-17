import { StyleSheet, Text, View } from "react-native";
import type { Language, Verse } from "../data/types";

interface VerseCardProps {
  verse: Verse;
  language: Language;
}

export function VerseCard({ verse, language }: VerseCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.reference}>
        Bhagavad Gita {verse.chapter}.{verse.verseNumber}
      </Text>
      <Text style={styles.sanskrit}>{verse.sanskrit}</Text>
      <Text style={styles.transliteration}>{verse.transliteration}</Text>
      <Text style={styles.translation}>{verse.translations[language]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF8E7",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8D9B0",
    gap: 8,
  },
  reference: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A6D1D",
  },
  sanskrit: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4A3F1A",
  },
  transliteration: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#6B5D33",
  },
  translation: {
    fontSize: 15,
    color: "#2E2A1A",
    marginTop: 4,
  },
});
