# Roadmap — MVP → product

Do the phases in order. Each phase ends in something shippable. Keep `index.html` working until Phase 1 reaches full visual/behavior parity, then move it to `legacy/`.

## Phase 0 — Ship the MVP (½ day)

Goal: a live URL you can share today.

- [ ] `npm install && npm run build`, confirm `dist/` works via `npm run preview`.
- [ ] Deploy to Vercel/Netlify/Cloudflare Pages (framework preset “Vite”, output `dist`).
- [ ] Add a real favicon and social preview image (`og:image`).
- [ ] Quick pass: test EN/RU, light/dark, on mobile + desktop.

## Phase 1 — Framework migration with parity (2–4 days) ✅

Goal: same product, now a maintainable React + TS codebase. **No new features.**

- [x] Scaffold Vite + React + TypeScript.
- [x] Move design tokens to `styles/tokens.css` unchanged.
- [x] Port each section to a component (see structure in ARCHITECTURE.md). Match layout, spacing, copy, animations pixel-for-pixel against `legacy/index.html`.
- [x] Port the `I18N` dictionary into `i18next` resource files (`en.json`, `ru.json`); keep default = English, remembered toggle.
- [x] Put persistence behind a `storage` interface (still `localStorage`/IndexedDB under the hood).
- [x] Add Vitest tests for: day save/load round-trip, currency formatting per locale, timesheet hour totals, contribution % ring, export table generation.
- [x] Add a Playwright smoke test: load → mark areas → switch language → data persists.
- [x] Retire `index.html` to `legacy/` once parity is confirmed.

Parity was verified against the MVP — see [`PARITY.md`](./PARITY.md).

## Phase 2 — Accounts & sync (3–5 days)

Goal: data follows the user across devices; nothing is lost.

- [ ] Stand up Supabase (schema in ARCHITECTURE.md); enable Row-Level Security.
- [ ] Email/passwordless (magic-link) auth. Keep the app fully usable **signed-out** (local-only), with a clear “Sign in to sync” affordance.
- [ ] Background sync: local cache is the UI source of truth; push/pull to Supabase; last-write-wins per day to start.
- [ ] **First-login migration**: import any existing `tracker_v1` from `localStorage` into the account.
- [ ] Account settings: language, currency, theme persisted server-side; export my data; delete my account.

## Phase 3 — Feedback, analytics, polish (2–3 days)

- [ ] Replace the `mailto:` feedback with a Supabase `feedback` table + email notification (Resend/Postmark). Keep the in-app form.
- [ ] Privacy-friendly analytics (Plausible/PostHog) + a short privacy note.
- [ ] Empty states, first-run onboarding (explain the 7 areas), subtle success microcopy.
- [ ] Error handling and offline banner.

## Phase 4 — Growth-ready (ongoing)

- [ ] PWA: installable, offline, home-screen icon.
- [ ] Insights: weekly/monthly summaries, streaks, “where your time went” over time (the donut already hints at this).
- [ ] More languages (i18next makes this cheap).
- [ ] Reminders (email or push) — opt-in only.
- [ ] Landing page + SEO (`og:image`, meta, sitemap).
- [ ] CI: run tests + build on every PR (GitHub Actions).

## Definition of done for “production-ready”

Accounts + sync work and survive device switches; tests green in CI; both themes and both languages correct; accessible (keyboard + contrast); privacy note published; a real feedback pipeline; deployed with preview builds per PR.
