import type { ThemeConfig } from "../data/types";

export interface ThemeScore {
  theme: string;
  score: number;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function scoreThemes(input: string, config: ThemeConfig): ThemeScore[] {
  const normalized = normalize(input);
  const scores: ThemeScore[] = config.themes.map(({ theme, keywords }) => {
    const score = keywords.reduce((count, keyword) => {
      return normalized.includes(normalize(keyword)) ? count + 1 : count;
    }, 0);
    return { theme, score };
  });

  return scores.sort((a, b) => b.score - a.score);
}
