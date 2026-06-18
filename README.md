# reset_yourself

A small, **fully offline** mobile app (React Native + Expo, SDK 56) that helps
anyone who feels stuck, distracted, or is just looking for an answer. You
describe your situation in a chat — by typing or speaking — and the app replies
with a relevant **Bhagavad Gita shlok** (Sanskrit + transliteration + a
translation in your chosen language). It also helps you **set and pursue goals**,
assigning each goal a guiding verse and surfacing daily Gita-based encouragement.

There is **no AI/LLM call and no network request at runtime**. Replies are
produced by a deterministic, offline keyword → theme → verse matcher, and the
entire verse dataset is bundled inside the app.

## How it works

```
your words ──▶ scoreThemes() ──▶ selectVerse() ──▶ a Gita shlok
              (keyword match)    (anti-repeat pick)
```

1. **Chat tab** — Describe any situation or question. The app keyword-matches
   your text against themes (grief, fear, anger, doubt, distraction, attachment,
   anxiety, comparison, failure, impermanence, …) and replies with a matching
   shlok. Recently shown verses are skipped so you don't see the same one twice
   in a row.
2. **Goals tab** — Add a goal and it's automatically assigned a *guiding shlok*
   drawn from the goal-support themes (resolve, discipline, karma yoga,
   perseverance). A rotating **"Today's Wisdom"** card sits at the top.
3. **Settings tab** — Switch the translation language between **English** and
   **Hindi**. Sanskrit and transliteration always show.

## Project structure

```
app/                         # expo-router screens (file-based routing)
  _layout.tsx                #   root stack
  (tabs)/_layout.tsx         #   bottom tabs: Goals | Chat | Settings
  (tabs)/index.tsx           #   Goals + Today's Wisdom + add-goal
  (tabs)/chat.tsx            #   chat-style situation → shlok
  (tabs)/settings.tsx        #   language toggle
  goal/[id].tsx              #   goal detail (guiding shlok, ask-in-chat, delete)
src/
  data/verses.json           # bundled Gita dataset (Sanskrit + en/hi)
  data/themeConfig.json      # EDITABLE keyword → theme → verse mapping
  data/themeConfig.README.md # how to edit the mapping (see below)
  data/types.ts              # shared TypeScript types
  engine/matcher.ts          # scoreThemes()  — pure, unit-tested
  engine/verseSelector.ts    # selectVerse(), selectGoalSupportVerse() — pure
  storage/*.ts               # AsyncStorage: goals, history, settings, chat
  hooks/useSpeechRecognition.ts  # mic input with graceful fallback
  components/                # VerseCard, ChatBubble, GoalListItem
__tests__/                   # Jest unit tests for the engine + storage
```

## Editing the verse/keyword mapping (for the app creator)

The matching logic is **data-driven**. To change which words trigger which
shlok — or to add new themes/verses — you only edit JSON, never the app code:

- **`src/data/themeConfig.json`** — the keyword → theme → verse mapping.
- **`src/data/verses.json`** — the verse text (Sanskrit, transliteration,
  English/Hindi translations).

Full instructions, including the JSON shape and how matching works, are in
**[`src/data/themeConfig.README.md`](src/data/themeConfig.README.md)**.

> The current dataset is a curated **43-verse highlights subset**
> (`"isPartial": true`), chosen to cover every theme. More verses can be
> appended to `verses.json` and referenced from `themeConfig.json` without any
> code changes. See [`DATA_LICENSE.md`](DATA_LICENSE.md) for sourcing/licensing.

## Monetization (Google AdMob)

A **rewarded ad** is wired into the Chat tab: tap "🎁 Watch an ad for bonus
wisdom" to watch an ad and unlock an extra guiding verse.

- SDK: [`react-native-google-mobile-ads`](https://docs.page/invertase/react-native-google-mobile-ads)
- AdMob **App ID** is set in `app.json` under the `react-native-google-mobile-ads`
  plugin config (`androidAppId`) — this is required by the native SDK and is
  baked in at prebuild time.
- The Ad Unit ID lives in `src/ads/adUnitIds.ts`. In `__DEV__` builds it
  automatically falls back to Google's `TestIds.REWARDED` so development/testing
  never serves real ads against the production ad unit (a Google AdMob policy
  requirement) — the real ad unit ID is only used in release builds.
- The SDK is mobile-only: `src/ads/initializeMobileAds.ts` and
  `src/ads/useChatRewardedAd.ts` have `.web.ts` counterparts that no-op on web,
  so `expo export --platform web` keeps working as a headless smoke test.
- Before going live with EEA/UK users, add Google's User Messaging Platform
  (UMP) consent flow (`AdsConsent` export from the same package) — not yet
  wired up in this prototype.

## Running the app

```bash
npm install

# Type-check, unit tests, and a headless web smoke test:
npm run typecheck            # tsc --noEmit
npm test                     # jest
npx expo export --platform web

# On a device/simulator:
npm run android              # or: npm run ios
```

> If your network blocks `api.expo.dev`, prefix Expo install/export commands
> with `EXPO_OFFLINE=1` to skip the remote compatibility check.

## Voice input (test on a real device)

Speech-to-text uses
[`expo-speech-recognition`](https://github.com/jamsch/expo-speech-recognition),
which needs native modules and therefore a **custom dev client** — it does not
run in plain Expo Go. The hook (`useSpeechRecognition`) detects Expo Go and
disables the mic button gracefully; **text input always works**. To try voice:

```bash
npx expo prebuild
npx expo run:android        # or run:ios, or an EAS build
```

Then grant microphone permission and tap the 🎤 button in the Chat tab.

## Building an APK/AAB and installing on your phone

This SDK also requires native modules (ads + speech), so it needs a
**prebuild** — plain Expo Go won't run it. Two ways to get it onto a device,
run on **your own machine** (not in this sandbox, which has no Android SDK,
emulator, or attached device):

**Option A — EAS Build (no Android Studio needed at all):**
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview   # produces an installable .apk
```
EAS builds in the cloud and gives you a download link/QR code — open it on
your phone to install directly. Use `--profile production` (AAB) when you're
ready to upload to the Play Store instead.

**Option B — Android Studio, locally:**
```bash
npx expo prebuild --platform android
```
Open the generated `android/` folder in Android Studio, connect your phone
over USB with USB debugging enabled (or start an emulator), then
`Run ▶` to install and launch the debug build directly. For a release
build, use `Build → Generate Signed Bundle / APK` and choose **AAB** for
Play Store, or **APK** to side-load onto a phone.

## Publishing to the Play Store

1. Create a [Google Play Console](https://play.google.com/console) account
   (one-time $25 fee).
2. Create the app listing, upload the **AAB** (from `eas build --profile production`
   or Android Studio's signed bundle), and fill in the store listing assets.
3. Complete the **Data Safety** section — since this app uses AdMob, declare
   the ad-related data collection per Play's [Ads policy](https://support.google.com/googleplay/android-developer/answer/9857753).
4. Add a **Privacy Policy URL** (required once you ship ads).
5. Complete the content rating questionnaire.
6. Release to **Internal testing** first, verify on a real device, then
   promote to Production.

## What's deterministic vs. what's not

Every reply is a keyword-matched shlok — there is no generative AI. The same
input with the same recent-history state will always map to the same theme; the
specific verse within a theme rotates to avoid repetition.
