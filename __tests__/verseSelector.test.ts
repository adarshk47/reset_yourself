import { scoreThemes } from "../src/engine/matcher";
import { selectVerse, selectGoalSupportVerse } from "../src/engine/verseSelector";
import themeConfigJson from "../src/data/themeConfig.json";
import versesData from "../src/data/verses.json";
import type { ThemeConfig, GitaData } from "../src/data/types";

const config = themeConfigJson as ThemeConfig;
const verses = (versesData as GitaData).verses;

describe("selectVerse", () => {
  it("picks a verse from the matched theme's verse list", () => {
    const scores = scoreThemes("I am so angry right now", config);
    const result = selectVerse(scores, config, verses, []);
    const angerTheme = config.themes.find((t) => t.theme === "anger")!;
    expect(angerTheme.verseIds).toContain(result.verse.id);
    expect(result.theme).toBe("anger");
  });

  it("falls back to defaultVerseIds when no theme matches", () => {
    const scores = scoreThemes("completely unrelated nonsense", config);
    const result = selectVerse(scores, config, verses, []);
    expect(config.defaultVerseIds).toContain(result.verse.id);
    expect(result.theme).toBeNull();
  });

  it("avoids repeating a recently shown verse when alternatives exist", () => {
    const scores = scoreThemes("I am so angry right now", config);
    const angerTheme = config.themes.find((t) => t.theme === "anger")!;
    const recent = angerTheme.verseIds.slice(0, -1);
    const result = selectVerse(scores, config, verses, recent);
    expect(recent).not.toContain(result.verse.id);
  });

  it("resets and allows repeats when every candidate was recently shown", () => {
    const scores = scoreThemes("I am so angry right now", config);
    const angerTheme = config.themes.find((t) => t.theme === "anger")!;
    const result = selectVerse(scores, config, verses, angerTheme.verseIds);
    expect(angerTheme.verseIds).toContain(result.verse.id);
  });
});

describe("selectGoalSupportVerse", () => {
  it("only returns verses tagged under a goal-support theme", () => {
    const verse = selectGoalSupportVerse(config, verses, [], "my-goal-id");
    const allowedIds = config.goalSupportThemes.flatMap(
      (theme) => config.themes.find((t) => t.theme === theme)?.verseIds ?? []
    );
    expect(allowedIds).toContain(verse.id);
  });

  it("is deterministic for the same seed", () => {
    const a = selectGoalSupportVerse(config, verses, [], "goal-123");
    const b = selectGoalSupportVerse(config, verses, [], "goal-123");
    expect(a.id).toBe(b.id);
  });
});
