# CLAUDE.md — project memory for Claude Code

This file is read automatically by Claude Code. Keep it short and current.

## What this is

**My Day, My Way** — a gentle, bilingual (EN/RU) **daily contribution tracker**. The user marks the life areas they invested in each day, plans hours, tracks money, logs energy, and writes notes. The tone is warm and feminine but *precise* — soft rose/plum palette, Fraunces + Manrope typography. Keep that identity.

## Current state

- The entire app is **one static file: `index.html`** (HTML + inline CSS + inline vanilla JS). No framework, no build required. Google Fonts is the only external resource.
- State is persisted to **`localStorage`** (keys prefixed `tracker_`). `tracker_v1` is a JSON map of `YYYY-MM-DD → day record`. A day record: `{done:{}, notes:{}, spent, saved, mood, energy, dayNote, blocks:[], gave:[], took:[]}`.
- **i18n**: a `I18N = { ru, en }` dictionary in the script. Static text uses `data-i18n` / `data-i18n-ph` (placeholder) / `data-i18n-aria` attributes; `applyLang()` re-renders everything on language switch. Default language is **English**; the header toggle switches and remembers it. **Never hardcode user-facing strings — add them to both `ru` and `en`.**
- **Currency**: 12 options, stored in `tracker_currency`, applied everywhere including export headers.
- **Feedback** is a client-side `mailto:` to the creator's address (`FB_TO` in the script).

## Design rules (do not regress)

- Keep light + dark themes working. Colors come from CSS custom properties on `:root`, with dark overrides under `@media (prefers-color-scheme: dark)` (guarded) and `:root[data-theme="dark"]`. Never hardcode a color that only works in one theme.
- Accessibility: keyboard operable (cards, info tips, toggles), visible focus, `aria-*` labels. Preserve this.
- Autosave is debounced; never block typing. The timesheet and feedback sections are collapsible with a preview.
- Any new user-facing string is bilingual (RU + EN) via the `I18N` dictionary.

## Where the product is going

The MVP is finished and deployable. The next phase turns it into a real product for an audience. Read, in order:

1. `docs/ROADMAP.md` — the phased plan (do phases in order).
2. `docs/ARCHITECTURE.md` — recommended stack and the data layer that replaces `localStorage`.
3. `docs/CLAUDE_CODE_PROMPT.md` — the kickoff prompt.

The single most important architectural change is **moving persistence off `localStorage` to accounts + a synced backend**, without losing the current UX. When you do the framework migration, **port the exact visual design and behavior** from `index.html` first (parity), then layer features.

## Conventions

- Commit in small, reviewable steps. Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`).
- Keep `index.html` runnable at every step until the framework version reaches full parity, then retire it (move to `legacy/`).
- Don't add analytics, tracking, or third-party scripts without noting it in the README's privacy section.
- Prefer `npm run dev` (Vite) for local work.

## Data safety

Real user data will pass through this app. When the backend lands: never log secrets, use parameterized/ORM queries, validate all input server-side, gate every write behind auth, and treat anything from the client as untrusted.
