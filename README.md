# My Day, My Way 🌸

A gentle, precise **daily contribution tracker**. Every day you mark the areas of your life you invested in, plan your hours, track money, log what gave and drained your energy, and jot notes — so you can see that you didn't only work, you *lived*.

Bilingual out of the box: **English / Русский** (toggle in the header, choice is remembered).

> Live design/prototype was built in Claude (Cowork). This repository is turning it into a production product with Claude Code in an IDE. See [`docs/`](./docs).

---

## What's inside

A **Vite + React + TypeScript** app in [`src/`](./src). The original single-file prototype is kept at [`legacy/index.html`](./legacy/index.html) as the parity reference — it still runs on its own, with no build step.

Features:

- **Seven areas of contribution** — mental health, personal & loved ones, work, professional growth, reach (Instagram), sport & body, healthy eating — each with a check, a short note, and a hover “i” tip explaining what to write.
- **Day productivity ring** + a week strip showing each day's fill.
- **Collapsible day timesheet** — plan the day by the hour; collapsed preview is a donut of “where the time went” (hours + % by area).
- **Money today** — spent / saved with live day balance and monthly running totals; **12 currencies** selectable.
- **Wellbeing** — mood & energy sliders.
- **Energy of the day** — two panels: what *gave* and what *drained* your energy.
- **Notes** — free daily reflection.
- **Export to Excel** — gather every day into a tab-separated table to paste into Excel / Google Sheets.
- **Feedback & support** — opens a pre-filled email to the creator.
- **Light / dark theme**, remembers the choice.
- **Autosave** to the browser's `localStorage` (per-device, per-browser).

## Tech notes (important for the next phase)

- **State still lives in `localStorage`**, behind a `TrackerStorage` interface (`src/lib/storage.ts`), under the same keys as the prototype: `tracker_v1` holds every day, plus `tracker_lang`, `tracker_theme`, `tracker_currency`, `tracker_ts_open`, `tracker_fb_open`. So data is **per browser, per device — not synced and not backed up.** Accounts and a backend are Phase 2 (see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)); the interface is the seam they slot into.
- **i18n** is i18next + react-i18next with resources in `src/i18n/en.json` and `ru.json`. Every user-facing string lives there, in both languages.
- **Feedback** uses a `mailto:` link (client-side only). A published static page cannot silently send email; the production plan replaces this with a backend endpoint.
- **No analytics, no trackers, no third-party scripts.** The only external resource is Google Fonts. Everything you write stays in your own browser.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173  (the MVP is at /legacy/index.html)
npm run build      # type-checks, then writes the static site to /dist
npm run preview    # serve the production build
```

Tests:

```bash
npm test           # Vitest unit tests
npm run test:e2e   # Playwright smoke test against the production build
npm run typecheck  # tsc --noEmit
```

The prototype needs nothing at all — open `legacy/index.html` in a browser.

## Deploy

The app is a static bundle. Any static host works:

- **Vercel / Netlify / Cloudflare Pages** — point at this repo, framework preset “Vite”, build command `npm run build`, output directory `dist`.
- **GitHub Pages** — publish the contents of `dist/`.

## Where to go next

- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased plan from MVP → real product. Phase 1 (the React migration) is done; Phase 2 is accounts + sync.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — recommended production stack & data layer.
- [`docs/PARITY.md`](./docs/PARITY.md) — how the React app was verified against the prototype.
- [`docs/CLAUDE_CODE_PROMPT.md`](./docs/CLAUDE_CODE_PROMPT.md) — a ready-to-paste prompt to continue with Claude Code.
- [`CLAUDE.md`](./CLAUDE.md) — project memory Claude Code reads automatically.

## License

MIT — see [`LICENSE`](./LICENSE).
