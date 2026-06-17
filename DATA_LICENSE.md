# Bhagavad Gita data: sourcing and licensing notes

`src/data/verses.json` bundles a curated subset of 43 Bhagavad Gita verses
(Sanskrit, transliteration, English and Hindi translation).

- **Sanskrit text and transliteration**: the Bhagavad Gita's Sanskrit verses
  are an ancient text and not subject to copyright. To guarantee accuracy and
  correct chapter/verse numbering, the Sanskrit (Devanagari) and
  transliteration fields were cross-checked against the verse boundaries in
  `github.com/vedicscriptures/bhagavad-gita` (GPLv3). No translated or
  commentary text from that repository (or any single named translator) was
  copied.
- **English and Hindi translations**: written independently for this app, in
  original wording, based on the well-established meaning of each verse.
  They are not a copy of any specific translator's published text.
- **Scope**: this is a "highlights" subset (43 of ~700 verses) chosen to
  cover the themes defined in `src/data/themeConfig.json` across most of the
  18 chapters. `src/data/verses.json` has `"isPartial": true` for this
  reason. The data shape is identical to what a full 700-verse set would
  use, so more verses can be added later without any code changes - just
  append more entries with the same `Verse` shape (see `src/data/types.ts`).

If a full, properly-licensed 700-verse translation set is sourced later,
replace `src/data/verses.json` with the complete data and flip
`isPartial` to `false`.
