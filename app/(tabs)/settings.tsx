import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import type { Language } from "../../src/data/types";
import { getLanguage, setLanguage } from "../../src/storage/settings";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
];

export default function SettingsScreen() {
  const [language, setLanguageState] = useState<Language>("en");

  useFocusEffect(
    useCallback(() => {
      getLanguage().then(setLanguageState);
    }, [])
  );

  const handleSelect = useCallback(async (value: Language) => {
    setLanguageState(value);
    await setLanguage(value);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Verse language</Text>
      <Text style={styles.hint}>
        Shloks always show in Sanskrit. Choose the translation language.
      </Text>
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const selected = option.value === language;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 13,
    color: "#888888",
    marginBottom: 8,
  },
  options: {
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    borderColor: "#3D5A80",
    backgroundColor: "#EAF1F8",
  },
  optionText: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  optionTextSelected: {
    color: "#3D5A80",
    fontWeight: "700",
  },
});
