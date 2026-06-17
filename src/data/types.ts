export type Language = "en" | "hi";

export interface Verse {
  id: string; // `${chapter}_${verseNumber}`, e.g. "2_47"
  chapter: number;
  verseNumber: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    en: string;
    hi: string;
  };
}

export interface GitaData {
  isPartial: boolean;
  source: string;
  verses: Verse[];
}

export interface ThemeEntry {
  theme: string;
  keywords: string[];
  verseIds: string[];
}

export interface ThemeConfig {
  themes: ThemeEntry[];
  goalSupportThemes: string[];
  defaultVerseIds: string[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  guidingVerseId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "app";
  text: string;
  verseId?: string;
  createdAt: string;
}
