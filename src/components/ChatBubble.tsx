import { StyleSheet, Text, View } from "react-native";
import type { ChatMessage, Language, Verse } from "../data/types";
import { VerseCard } from "./VerseCard";

interface ChatBubbleProps {
  message: ChatMessage;
  verse?: Verse;
  language: Language;
}

export function ChatBubble({ message, verse, language }: ChatBubbleProps) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowApp]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleApp]}>
        <Text style={isUser ? styles.textUser : styles.textApp}>{message.text}</Text>
        {verse ? (
          <View style={styles.verseWrap}>
            <VerseCard verse={verse} language={language} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 6,
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  rowApp: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: "#3D5A80",
  },
  bubbleApp: {
    backgroundColor: "#EDEDED",
  },
  textUser: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  textApp: {
    color: "#1A1A1A",
    fontSize: 15,
  },
  verseWrap: {
    marginTop: 10,
  },
});
