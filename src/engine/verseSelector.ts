import type { ThemeConfig, Verse } from "../data/types";
import type { ThemeScore } from "./matcher";

export interface VerseSelectionResult {
  verse: Verse;
  theme: string | null;
}

function pickUnseen(candidateIds: string[], recentVerseIds: string[]): string {
  const unseen = candidateIds.filter((id) => !recentVerseIds.includes(id));
  const pool = unseen.length > 0 ? unseen : candidateIds;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function selectVerse(
  themeScores: ThemeScore[],
  config: ThemeConfig,
  verses: Verse[],
  recentVerseIds: string[]
): VerseSelectionResult {
  const versesById = new Map(verses.map((verse) => [verse.id, verse]));
  const topTheme = themeScores.find((entry) => entry.score > 0);

  const themeEntry = topTheme
    ? config.themes.find((entry) => entry.theme === topTheme.theme)
    : undefined;

  const candidateIds = themeEntry?.verseIds.length
    ? themeEntry.verseIds
    : config.defaultVerseIds;

  const chosenId = pickUnseen(candidateIds, recentVerseIds);
  const verse = versesById.get(chosenId);

  if (!verse) {
    throw new Error(`Verse id "${chosenId}" not found in verses dataset`);
  }

  return { verse, theme: themeEntry?.theme ?? null };
}

export function selectGoalSupportVerse(
  config: ThemeConfig,
  verses: Verse[],
  recentVerseIds: string[],
  seed?: string
): Verse {
  const versesById = new Map(verses.map((verse) => [verse.id, verse]));
  const candidateIds = config.goalSupportThemes.flatMap(
    (themeName) =>
      config.themes.find((entry) => entry.theme === themeName)?.verseIds ?? []
  );
  const pool = candidateIds.length > 0 ? candidateIds : config.defaultVerseIds;

  let chosenId: string;
  if (seed) {
    const unseen = pool.filter((id) => !recentVerseIds.includes(id));
    const candidates = unseen.length > 0 ? unseen : pool;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    chosenId = candidates[hash % candidates.length];
  } else {
    chosenId = pickUnseen(pool, recentVerseIds);
  }

  const verse = versesById.get(chosenId);
  if (!verse) {
    throw new Error(`Verse id "${chosenId}" not found in verses dataset`);
  }
  return verse;
}
