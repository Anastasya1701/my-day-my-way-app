# CLAUDE.md — project memory for Claude Code

This file is read automatically by Claude Code. Keep it short and current.

## What this is

**My Day, My Way** — a gentle, bilingual (EN/RU) **daily contribution tracker**. The user marks the life areas they invested in each day, plans hours, tracks money, logs energy, and writes notes. The tone is warm and feminine but *precise* — soft rose/plum palette, Fraunces + Manrope typography. Keep that identity.

## Current state

- **Vite + React + TypeScript** app in `src/`. `npm run dev` serves it; `npm run build` type-checks and writes `dist/`.
- `legacy/index.html` is the original single-file MVP. It is the **visual and behavioural reference** for the port and still runs on its own (open it, or `/legacy/index.html` in dev). Don't edit it; don't delete it until Phase 2 is merged.
- **State** lives in a Zustand store (`src/state/useDayStore.ts`) and is persisted through the `TrackerStorage` interface in `src/lib/storage.ts` to `localStorage`, under the same keys as the MVP. `tracker_v1` is a JSON map of `YYYY-MM-DD → day record`; a day record is `{done:{}, notes:{}, spent, saved, mood, energy, dayNote, blocks:[], gave:[], took:[]}`. Text and sliders autosave on a **350 ms debounce**; adding or removing a timesheet block or an energy item writes immediately.
- **i18n**: i18next + react-i18next, resources in `src/i18n/en.json` and `ru.json`, default English, remembered in `tracker_lang`. Components read strings through `useAppT()` — `t`, `lang`, `list()` for arrays, `areaName/areaShort/areaTip`. **Never hardcode user-facing strings — add them to both `en.json` and `ru.json`.** Russian plurals use i18next's `_one/_few/_many` suffixes.
- **Styles**: `src/styles/tokens.css` (the design tokens) and `src/styles/app.css` (everything else), both ported verbatim from the MVP. Components reuse the MVP's class names, so changing markup can change layout — check parity when you do.
- **Currency**: 12 options in `src/lib/currency.ts`, stored in `tracker_currency`, applied everywhere including export headers.
- **Feedback** is still a client-side `mailto:` (`FEEDBACK_TO` in `src/lib/feedback.ts`).

## Layout

```
src/
  lib/         pure logic — types, dates, money, timesheet, contribution %, export, storage, clipboard
  i18n/        i18next setup, en.json / ru.json, useAppT()
  state/       the Zustand store and its debounced autosave
  components/  shared pieces — CollapseHead, PreviewCard, SectionLabel, AutoGrowTextarea
  features/    one folder per section — Header, Summary, Areas, Timesheet, Money, Wellbeing,
               Energy, Notes, Export, Feedback
e2e/           Playwright smoke tests
legacy/        the MVP, kept as the parity reference
```

Keep logic that can be tested without a DOM in `src/lib` — that is where the unit tests live.

## Design rules (do not regress)

- Keep light + dark themes working. Colours come from CSS custom properties in `tokens.css`, with dark overrides under `@media (prefers-color-scheme: dark)` (guarded) and `:root[data-theme="dark"]`. Never hardcode a colour that only works in one theme.
- Accessibility: keyboard operable (cards, info tips, previews, toggles), visible focus, `aria-*` labels. Preserve this.
- Autosave is debounced; never block typing. The timesheet and feedback sections are collapsible with a preview.
- Any new user-facing string is bilingual (RU + EN).

## Testing

- `npm test` — Vitest unit tests (`src/**/*.test.ts`).
- `npm run test:e2e` — Playwright smoke test against the production build.
- `npm run typecheck` — `tsc --noEmit`; `npm run build` runs it too.
- `docs/PARITY.md` records how the port was checked against `legacy/index.html` and the two places it intentionally differs. Re-run that check if you touch shared markup or styles.

## Where the product is going

Phase 1 (framework migration with parity) is done. Next is **Phase 2 — accounts and sync**, keeping the app fully usable signed-out. Read, in order:

1. `docs/ROADMAP.md` — the phased plan (do phases in order).
2. `docs/ARCHITECTURE.md` — the target stack and the data layer that replaces `localStorage`.

The single most important architectural change is **moving persistence off `localStorage` to accounts + a synced backend** without losing the current UX. The local cache stays the UI's source of truth: swap the backend behind `setStorage()` and layer sync on top.

## Conventions

- Commit in small, reviewable steps. Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).
- Keep the app runnable and the tests green at every step.
- Don't add analytics, tracking, or third-party scripts without noting it in the README's privacy section.

## Data safety

Real user data will pass through this app. When the backend lands: never log secrets, use parameterized/ORM queries, validate all input server-side, gate every write behind auth, and treat anything from the client as untrusted.
