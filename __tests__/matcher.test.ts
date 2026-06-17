import { scoreThemes } from "../src/engine/matcher";
import themeConfig from "../src/data/themeConfig.json";
import type { ThemeConfig } from "../src/data/types";

const config = themeConfig as ThemeConfig;

describe("scoreThemes", () => {
  it("ranks the theme with the most keyword hits first", () => {
    const scores = scoreThemes(
      "I keep checking my phone instead of studying, I can't focus",
      config
    );
    expect(scores[0].theme).toBe("distraction");
    expect(scores[0].score).toBeGreaterThan(0);
  });

  it("matches on Hindi-English mixed casual text", () => {
    const scores = scoreThemes("mujhe bahut gussa aa raha hai", config);
    expect(scores[0].theme).toBe("anger");
  });

  it("matches goal-support themes like resolve", () => {
    const scores = scoreThemes("I really want to quit, I have no willpower", config);
    expect(scores[0].theme).toBe("resolve");
  });

  it("returns all themes scored at zero when nothing matches", () => {
    const scores = scoreThemes("xyzxyz nonsense input", config);
    expect(scores.every((s) => s.score === 0)).toBe(true);
  });
});
