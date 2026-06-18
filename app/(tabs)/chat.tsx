import { useCallback, useEffect, useRef, useState } from "react";
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
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { ChatBubble } from "../../src/components/ChatBubble";
import { useChatRewardedAd } from "../../src/ads/useChatRewardedAd";
import themeConfigJson from "../../src/data/themeConfig.json";
import versesData from "../../src/data/verses.json";
import type { ChatMessage, GitaData, Language, ThemeConfig } from "../../src/data/types";
import { scoreThemes } from "../../src/engine/matcher";
import { selectGoalSupportVerse, selectVerse } from "../../src/engine/verseSelector";
import { useSpeechRecognition } from "../../src/hooks/useSpeechRecognition";
import { appendChatMessage, getChatHistory } from "../../src/storage/chat";
import { getRecentVerseIds, recordShownVerse } from "../../src/storage/history";
import { getLanguage } from "../../src/storage/settings";

const config = themeConfigJson as ThemeConfig;
const verses = (versesData as GitaData).verses;
const versesById = new Map(verses.map((verse) => [verse.id, verse]));

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{ goalTitle?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [input, setInput] = useState("");
  const greetedGoalRef = useRef<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const speech = useSpeechRecognition();
  const rewardedAd = useChatRewardedAd();
  const rewardGrantedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [history, lang] = await Promise.all([getChatHistory(), getLanguage()]);
        setMessages(history);
        setLanguage(lang);
      })();
    }, [])
  );

  useEffect(() => {
    if (speech.transcript) {
      setInput(speech.transcript);
    }
  }, [speech.transcript]);

  useEffect(() => {
    const goalTitle = params.goalTitle;
    if (goalTitle && greetedGoalRef.current !== goalTitle) {
      greetedGoalRef.current = goalTitle;
      const greeting: ChatMessage = {
        id: makeId("app"),
        role: "app",
        text: `Tell me what's making "${goalTitle}" hard right now, and I'll share what the Gita says.`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, greeting]);
    }
  }, [params.goalTitle]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) {
      return;
    }
    setInput("");

    const userMessage: ChatMessage = {
      id: makeId("user"),
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    await appendChatMessage(userMessage);
    setMessages((prev) => [...prev, userMessage]);

    const recent = await getRecentVerseIds();
    const scores = scoreThemes(text, config);
    const { verse } = selectVerse(scores, config, verses, recent);
    await recordShownVerse(verse.id);

    const appMessage: ChatMessage = {
      id: makeId("app"),
      role: "app",
      text: "Here's what the Gita says:",
      verseId: verse.id,
      createdAt: new Date().toISOString(),
    };
    await appendChatMessage(appMessage);
    setMessages((prev) => [...prev, appMessage]);
  }, [input]);

  const grantBonusVerse = useCallback(async () => {
    const recent = await getRecentVerseIds();
    const verse = selectGoalSupportVerse(config, verses, recent);
    await recordShownVerse(verse.id);

    const bonusMessage: ChatMessage = {
      id: makeId("app"),
      role: "app",
      text: "🎁 Bonus wisdom for watching:",
      verseId: verse.id,
      createdAt: new Date().toISOString(),
    };
    await appendChatMessage(bonusMessage);
    setMessages((prev) => [...prev, bonusMessage]);
  }, []);

  const loadRewardedAd = useCallback(() => {
    rewardGrantedRef.current = false;
    rewardedAd.load();
  }, [rewardedAd.load]);

  useEffect(() => {
    loadRewardedAd();
    // Load once on mount; reloaded again after each close via the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rewardedAd.isEarnedReward && !rewardGrantedRef.current) {
      rewardGrantedRef.current = true;
      grantBonusVerse();
    }
  }, [rewardedAd.isEarnedReward, grantBonusVerse]);

  useEffect(() => {
    if (rewardedAd.isClosed) {
      loadRewardedAd();
    }
  }, [rewardedAd.isClosed, loadRewardedAd]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Stuck in a situation, or have a question? Describe it below and I'll
            share what the Gita says.
          </Text>
        }
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            verse={item.verseId ? versesById.get(item.verseId) : undefined}
            language={language}
          />
        )}
      />
      {speech.error ? <Text style={styles.speechError}>{speech.error}</Text> : null}
      <Pressable
        style={[styles.rewardButton, !rewardedAd.isLoaded && styles.rewardButtonDisabled]}
        disabled={!rewardedAd.isLoaded}
        onPress={() => rewardedAd.show()}
      >
        <Text style={styles.rewardButtonText}>
          {rewardedAd.isLoaded ? "🎁 Watch an ad for bonus wisdom" : "Loading bonus ad…"}
        </Text>
      </Pressable>
      <View style={styles.inputRow}>
        <Pressable
          style={[styles.micButton, !speech.isAvailable && styles.micButtonDisabled]}
          disabled={!speech.isAvailable}
          onPress={speech.isListening ? speech.stop : speech.start}
        >
          <Text style={styles.micButtonText}>{speech.isListening ? "■" : "🎤"}</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  empty: {
    color: "#888888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
  speechError: {
    color: "#B23A48",
    fontSize: 12,
    paddingHorizontal: 16,
  },
  rewardButton: {
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#E8D9B0",
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  rewardButtonDisabled: {
    opacity: 0.5,
  },
  rewardButtonText: {
    color: "#8A6D1D",
    fontWeight: "600",
    fontSize: 13,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E2E2",
    backgroundColor: "#FFFFFF",
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonDisabled: {
    opacity: 0.4,
  },
  micButtonText: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3D5A80",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
