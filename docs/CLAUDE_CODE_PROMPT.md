# Kickoff prompt for Claude Code

Open this repository in your IDE, start Claude Code in the project root, and paste the prompt below. It assumes Claude Code will read `CLAUDE.md`, `README.md`, and the `docs/` files.

> Tip: work one phase at a time. Don't let it jump ahead — parity before features.

---

## Prompt — paste this into Claude Code

```
You are working in the "My Day, My Way" repository — a gentle, bilingual (EN/RU)
daily contribution tracker. Read CLAUDE.md, README.md, docs/ARCHITECTURE.md and
docs/ROADMAP.md before writing any code, then follow the roadmap phase by phase.

Product identity (do not change without asking me):
- Warm, feminine but precise tone. Soft rose/plum palette, Fraunces + Manrope type.
- Bilingual EN/RU, default English, header toggle that is remembered.
- Light and dark themes, both must always work.
- Seven areas of contribution: mental health, personal & loved ones, work,
  professional growth, reach (Instagram), sport & body, healthy eating.
- Sections: day productivity ring + week strip, collapsible timesheet with a
  "where the time went" donut preview, money (12 currencies, day balance +
  monthly totals), wellbeing (mood/energy), energy-of-the-day (gave/took),
  notes, Excel export, collapsible feedback, autosave.

The current MVP is the single file `index.html`. It is the source of truth for
how everything looks and behaves.

Start with ROADMAP Phase 1 (framework migration WITH PARITY — no new features):
1. Scaffold Vite + React + TypeScript alongside the MVP. Move index.html to
   legacy/ but keep it runnable for reference.
2. Move the CSS custom-property design tokens into styles/tokens.css unchanged.
3. Port each section to its own component, matching layout, spacing, copy,
   animations, both themes and both languages against legacy/index.html exactly.
4. Port the in-file I18N dictionary into i18next resources (en.json, ru.json),
   default English, remembered toggle.
5. Put persistence behind a storage interface (still localStorage/IndexedDB for
   now) so a backend can slot in later — see docs/ARCHITECTURE.md data model.
6. Add Vitest unit tests (day save/load, currency formatting per locale,
   timesheet totals, contribution % ring, export generation) and one Playwright
   smoke test (mark areas → switch language → data persists).

Rules:
- Parity first: reproduce the MVP exactly before adding anything.
- Every user-facing string is bilingual (RU + EN). Never hardcode copy.
- Keep it accessible (keyboard, visible focus, aria) and keep autosave debounced.
- Commit in small steps with Conventional Commits. Keep the app runnable at every
  step. Open a PR when Phase 1 reaches parity, and pause for my review before
  Phase 2 (accounts + sync).

When Phase 1 is merged, do ROADMAP Phase 2 (Supabase accounts + background sync +
first-login migration of existing localStorage data), keeping the app fully usable
signed-out. Ask me before creating any external accounts (Supabase, hosting) or
adding paid services.
```

---

## After Phase 1

- Review the PR yourself (or ask Claude Code to summarize the diff).
- Deploy a preview and click through EN/RU, light/dark, mobile/desktop.
- Only then let it start Phase 2.

## Handy follow-up prompts

- “Show me a checklist of any places where the React version differs from `legacy/index.html`, then fix them.”
- “Set up GitHub Actions to run tests + build on every PR.”
- “Add the Supabase schema from docs/ARCHITECTURE.md as SQL migrations and wire up Row-Level Security.”
- “Write the first-login migration that imports `tracker_v1` from localStorage into the signed-in account.”
