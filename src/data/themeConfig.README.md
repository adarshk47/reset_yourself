# Editing `themeConfig.json`

This file is the only place the matching logic looks up when deciding which
shlok to show. It is plain data - you can edit it directly without touching
any app code, and the app will pick up your changes the next time it
builds/reloads.

## Shape

```json
{
  "themes": [
    { "theme": "anger", "keywords": ["angry", "gussa"], "verseIds": ["2_56", "16_21"] }
  ],
  "goalSupportThemes": ["resolve", "discipline", "karma_yoga", "perseverance"],
  "defaultVerseIds": ["2_47", "2_48"]
}
```

- **themes**: each entry is a theme name, a list of keywords/phrases to match
  against the user's message (case-insensitive substring match, so short
  fragments and Hindi-English mixed words both work), and a list of verse
  ids (matching `id` in `src/data/verses.json`, formatted `chapter_verse`,
  e.g. `"6_26"` is chapter 6 verse 26) that should be shown for that theme.
  You can add a brand-new theme, more keywords to an existing theme, or more
  verse ids - no code changes needed.
- **goalSupportThemes**: a subset of the theme names above that are used
  proactively (not from user text) - e.g. picking the verse shown when a new
  goal is created, or the "Today's Wisdom" verse on the Goals screen.
- **defaultVerseIds**: shown when nothing in the user's message matches any
  theme's keywords.

## Adding more verses

`src/data/verses.json` currently has a curated subset of 43 verses (see
`DATA_LICENSE.md` for why). To reference a verse in `themeConfig.json` that
isn't in `verses.json` yet, add the verse object to `verses.json` first
(same shape: `id`, `chapter`, `verseNumber`, `sanskrit`, `transliteration`,
`translations.en`, `translations.hi`), then reference its `id` here.
