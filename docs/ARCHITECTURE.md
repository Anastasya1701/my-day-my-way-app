# Architecture — from MVP to product

This document proposes how to evolve the single-file MVP into a maintainable product for a real audience, **without losing the current design or feel**. It is a recommendation, not dogma — adjust to taste and budget.

## Guiding principles

1. **Parity first.** Before adding anything, reproduce the current `index.html` exactly in the new stack (same layout, palette, copy, behaviors, both themes, both languages). Ship parity, then features.
2. **Local-first, then synced.** The app must keep working offline and instantly (it does today via `localStorage`). Sync is added *on top*, not as a replacement that introduces latency.
3. **Don't over-engineer.** This is a focused personal-tracker, not an enterprise suite. Pick boring, well-supported tools.

## Recommended stack

| Concern | Recommendation | Why |
|---|---|---|
| Build / dev | **Vite** | Fast, already scaffolded here. |
| UI | **React + TypeScript** | Componentizes the current sections cleanly; TS prevents whole classes of bugs. (Preact or Svelte are fine lighter alternatives.) |
| Styling | Keep the **CSS custom-property design tokens** as-is (they already power light/dark). Move them to a `tokens.css`. Optionally Tailwind, but the current token system is good — don't rewrite the look. |
| State | **Zustand** (or React context + reducer) | Small, ergonomic; mirrors the current per-day record shape. |
| i18n | **i18next + react-i18next** | Replaces the hand-rolled `I18N` dict; supports pluralization and lazy-loading languages. Migrate the existing `ru`/`en` strings into resource files. |
| Persistence (local) | **IndexedDB via `idb-keyval`** or keep `localStorage` behind a small `storage` interface | Abstract storage behind one module so the backend can slot in. |
| Backend / auth / DB | **Supabase** (Postgres + Auth + Row-Level Security + Realtime) | One managed service gives accounts, a real DB, per-user data isolation, and sync. Firebase is a fine alternative. |
| Feedback intake | Supabase table + **Resend** (or Postmark) for the email notification, or a form service (Formspree) as a stopgap | Replaces the client-side `mailto:`. |
| Analytics (privacy-friendly) | **Plausible** or **PostHog** | Understand usage without creepy tracking. Disclose in README/privacy. |
| Testing | **Vitest** (unit) + **Playwright** (e2e) | Guard the core: day save/load, currency math, timesheet totals, i18n switching, export. |
| Hosting | **Vercel** / **Netlify** / **Cloudflare Pages** | Zero-config for Vite; preview deploys per PR. |

## The data layer (the key change)

Today: one JSON blob per browser in `localStorage`. That means **no accounts, no sync, no backup** — the biggest limitation for a real audience.

Target model (Supabase / Postgres):

```
users            (id, email, created_at, locale, currency, theme)
day_entries      (id, user_id, date, mood, energy, spent, saved, day_note, updated_at)
area_checks      (id, day_entry_id, area_key, done, note)          -- 7 areas
time_blocks      (id, day_entry_id, start_min, end_min, area_key, label)
energy_items     (id, day_entry_id, kind ['gave'|'took'], text, position)
feedback         (id, user_id, type, email, message, created_at)
```

- Enforce **Row-Level Security**: a user can only read/write rows where `user_id = auth.uid()`.
- Keep a **local cache** (the current `localStorage`/IndexedDB) as the source of truth for the UI; sync to Supabase in the background (last-write-wins per day is enough at first; add conflict handling only if needed).
- Provide a **one-time import**: on first login, migrate any existing `tracker_v1` blob from `localStorage` into the account so early users don't lose data.

## Suggested source structure (after migration)

```
src/
  main.tsx
  App.tsx
  styles/tokens.css          # the existing CSS custom properties
  i18n/                      # en.json, ru.json (ported from I18N dict)
  lib/
    storage.ts               # local cache interface
    sync.ts                  # Supabase read/write + migration from localStorage
    supabase.ts              # client
    date.ts, money.ts        # helpers (locale, currency formatting)
  state/useDayStore.ts       # Zustand store: current day, mutations, autosave
  features/
    Header/                  # brand, date nav, week strip, theme + lang toggles
    Areas/                   # the 7 contribution cards + tips
    Timesheet/               # collapsible timesheet + donut preview
    Money/                   # currency + spent/saved + totals
    Wellbeing/               # mood/energy sliders
    Energy/                  # gave / took panels
    Notes/
    Export/
    Feedback/
  components/                # Ring, Donut, Collapsible, Chip, ...
legacy/index.html            # the MVP, kept until parity is reached
```

## Environment variables

Create `.env` (git-ignored) from `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
# server-side only (never VITE_ prefixed): RESEND_API_KEY, etc.
```

Never commit real keys. Anything exposed to the browser must be a public/anon key with RLS doing the real protection.

## Security & privacy checklist

- Auth on every write; RLS on every table.
- Validate/sanitize all input server-side; treat client data as untrusted.
- No secrets in the bundle; server-only keys stay server-side (edge functions / API routes).
- A short **privacy note**: what's stored, where, that it's the user's own data, how to delete an account/export data.
- Accessibility parity with the MVP (keyboard, focus, aria, contrast in both themes).

## Non-goals (for now)

Social features, sharing others' data, notifications infra, native apps. A **PWA** (installable, offline) is a cheap, high-value add and is in the roadmap — keep it lightweight.
