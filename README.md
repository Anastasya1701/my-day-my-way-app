# My Day, My Way 🌸

A gentle, precise **daily contribution tracker**. Every day you mark the areas of your life you invested in, plan your hours, track money, log what gave and drained your energy, and jot notes — so you can see that you didn't only work, you *lived*.

Bilingual out of the box: **English / Русский** (toggle in the header, choice is remembered).

> Live design/prototype was built in Claude (Cowork). This repository is the starting point for turning it into a production product with Claude Code in an IDE. See [`docs/`](./docs).

---

## What's inside (current state — MVP)

The whole app is currently **one self-contained static file** — `index.html` — with no build step required and no external dependencies except Google Fonts. It works by opening the file in any modern browser.

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

- **State lives in `localStorage`** under keys prefixed `tracker_` (`tracker_v1` holds all day data; `tracker_lang`, `tracker_theme`, `tracker_currency`, `tracker_ts_open`, `tracker_fb_open`). This means data is **per browser, per device — not synced and not backed up.** Turning this into a real product for an audience means adding accounts + a backend (see [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)).
- **i18n** is a hand-rolled dictionary (`I18N = { ru, en }`) inside the script, applied via `data-i18n` / `data-i18n-ph` / `data-i18n-aria` attributes and a `applyLang()` pass. Fine for two languages today; the architecture doc covers moving to a real i18n library if the app grows.
- **Feedback** uses a `mailto:` link (client-side only). A published static page cannot silently send email; the production plan replaces this with a backend endpoint.

## Run it locally

Zero-dependency way — just open `index.html` in a browser.

With the dev server (recommended once you start editing):

```bash
npm install
npm run dev      # serves at http://localhost:5173
npm run build    # outputs static site to /dist
npm run preview  # preview the production build
```

## Deploy the MVP as-is

The current `index.html` is deployable today. Any static host works:

- **Vercel / Netlify / Cloudflare Pages** — point at this repo, framework preset “Other / Vite”, build command `npm run build`, output `dist` (or deploy the single `index.html` with no build at all).
- **GitHub Pages** — serve `index.html` from the repo.

## Where to go next

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — recommended production stack & data layer.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — phased plan from MVP → real product.
- [`docs/CLAUDE_CODE_PROMPT.md`](./docs/CLAUDE_CODE_PROMPT.md) — a ready-to-paste prompt to continue with Claude Code.
- [`CLAUDE.md`](./CLAUDE.md) — project memory Claude Code reads automatically.

## License

MIT — see [`LICENSE`](./LICENSE).
