# UI build spec — parity with the screenshots

This is the exact design contract for "My Day, My Way". The source of truth is the MVP `index.html` and the marketing screenshots. Any framework version (web React or the mobile app) must reproduce these values pixel for pixel before adding anything new. All numbers below are taken from the working MVP, use them verbatim.

Reference screenshots live in `docs/screenshots/` (EN and RU, light and dark, mobile and desktop). Match them.

---

## 0. Golden rules

- Do not invent new colors, radii, or fonts. Only the tokens in section 1 exist
- Light and dark must both be correct. Every color comes from a token that has a light and a dark value, never a raw hex in a component except the 7 category colors
- Bilingual EN and RU. No user-facing string is hardcoded, all copy comes from the i18n dictionary. Default language is English
- Keep it accessible: keyboard operable, visible focus ring, aria labels, respects reduced motion
- Autosave is silent and debounced. Never block typing

---

## 1. Design tokens

### 1.1 Color, light theme

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FCF6F7` | page background, warm rose off-white |
| `--surface` | `#FFFFFF` | cards |
| `--surface-2` | `#FBF0F2` | insets, inputs, chips |
| `--ink` | `#3A2833` | primary text (plum-black, never pure black) |
| `--ink-soft` | `#8A7078` | secondary text, labels |
| `--line` | `#EFE0E4` | borders, dividers, track fills |
| `--accent` | `#B85C86` | primary rose |
| `--accent-ink` | `#9A4870` | accent text and links (darker rose for contrast) |
| `--accent-soft` | `#F4E1E9` | soft accent wash |
| `--gold` | `#B98F45` | champagne accent, savings, "gave energy" |
| `--gold-soft` | `#F6ECD8` | gold chip background |
| `--drain` | `#8C7CB0` | muted lavender, "drained energy" |
| `--good` | `#5E9E82` | positive balance, success text |

### 1.2 Color, dark theme

| Token | Value |
|---|---|
| `--bg` | `#20161D` |
| `--surface` | `#2B1F27` |
| `--surface-2` | `#33242E` |
| `--ink` | `#F4E8EE` |
| `--ink-soft` | `#BFA3B1` |
| `--line` | `#3D2C37` |
| `--accent` | `#E48CAE` |
| `--accent-ink` | `#EFA6C1` |
| `--accent-soft` | `#3A2632` |
| `--gold` | `#D9B879` |
| `--gold-soft` | `#352A1E` |
| `--drain` | `#A99BC9` |
| `--good` | `#84C3A3` |

Theme resolution order: explicit `data-theme="dark"` or `"light"` on the root wins, otherwise fall back to `prefers-color-scheme`. Persist the explicit choice in `localStorage` key `tracker_theme`.

### 1.3 The 7 category colors (identical in both themes)

| id | color | area EN | area RU |
|---|---|---|---|
| `mental` | `#A77FC6` | Mental health | Ментальное здоровье |
| `personal` | `#DB84A8` | Personal & loved ones | Личное и близкие |
| `work` | `#6C8CC7` | Work | Работа |
| `growth` | `#7E77CC` | Professional growth | Проф. развитие |
| `insta` | `#E48A79` | Reach · Instagram | Популярность · Instagram |
| `sport` | `#DFA05C` | Sport & body | Спорт и тело |
| `food` | `#6FA684` | Healthy eating | Здоровое питание |

Tints are derived at runtime with `color-mix`, do not hand-pick tint hexes. Common recipes used in the MVP:
- category chip background: `color-mix(in srgb, var(--cat) 16%, transparent)`
- card "on" background: `color-mix(in srgb, var(--cat) 8%, var(--surface))`
- card "on" border: `color-mix(in srgb, var(--cat) 60%, var(--line))`
- timesheet block fill: `color-mix(in srgb, var(--cat) 15%, var(--surface))`

### 1.4 Radius, shadow, spacing

- `--radius: 22px` (big cards, preview cards), `--radius-sm: 14px` (category cards, list items). Inputs use `10px` to `12px`. Icon chips `11px` to `12px`. Pills and circles `999px` or `50%`
- `--shadow: 0 14px 40px -22px rgba(120,50,80,.45)` light, `0 16px 44px -22px rgba(0,0,0,.7)` dark
- `--shadow-sm: 0 4px 16px -10px rgba(120,50,80,.4)` light, `0 6px 18px -12px rgba(0,0,0,.6)` dark
- Page container: `max-width: 820px`, centered, padding `26px 20px 80px`
- Vertical rhythm between sections: section label has `margin: 32px 4px 12px`
- Card padding: big cards `20px`, category cards `15px 16px 14px`, panels `16px`

### 1.5 Typography

Two families, loaded from Google Fonts:
- Display: **Fraunces** (opsz 9..144), weights 400 500 600 700. Used for headings, numbers, titles. Warm, slightly characterful serif
- UI: **Manrope**, weights 400 500 600 700. Everything else. Fallback stack `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Numbers that update (money, hours, day number) use `font-variant-numeric: tabular-nums`

Exact type scale (family / weight / size / notes):
- Brand wordmark: Fraunces 600, `1.05rem`, `letter-spacing .14em`, uppercase, color `--accent-ink`
- Date, weekday: Fraunces 600, `1.9rem` desktop, `1.55rem` under 560px, line-height 1.05
- Date subtitle: Manrope 400, `0.9rem`, `--ink-soft`
- Ring percentage: Fraunces 600, `1.75rem`
- Ring caption (done/вклад): `0.62rem`, uppercase, `letter-spacing .14em`, `--ink-soft`
- Summary title: Fraunces 600, `1.35rem`
- Summary subtitle: Manrope 400, `0.92rem`, `--ink-soft`
- Section label: Manrope 700, `0.72rem`, uppercase, `letter-spacing .16em`, `--ink-soft`, followed by a `1px` line filling the row
- Category name: Manrope 600, `0.98rem`
- Category "i" info glyph: Fraunces italic 600, `0.86rem`, opacity `.42` at rest
- Chip value (money): Fraunces 600, `1.3rem`
- Chip key: Manrope 600, `0.72rem`, uppercase, `letter-spacing .09em`, `--ink-soft`
- Slider value word: Fraunces 600, `1.05rem`, `--accent-ink`
- Panel title (energy): Fraunces 600, `1.06rem`
- Donut center hours: Fraunces 600, `1.2rem`, caption `0.58rem` uppercase

---

## 2. Layout and screen order

Single scrolling column, top to bottom, exactly this order:

1. Header block (the "halo" card): brand + language toggle + theme toggle, then date navigation, then week strip
2. Summary: productivity ring + title and subtitle
3. Areas of contribution (7 cards, 2 columns on desktop, 1 column under 560px)
4. Day timesheet (collapsible, collapsed by default, shows donut preview)
5. Money today (currency + spent/saved + 3 summary chips)
6. Wellbeing (mood + energy sliders)
7. Energy of the day (two panels: gave / took)
8. Notes (one textarea)
9. Export to Excel
10. Feedback & support (collapsible, collapsed by default, shows a prompt preview)
11. Autosave footer line

Responsive: at `max-width: 560px` the category grid, money grid and energy grid all collapse to one column, and the date font shrinks. Content must never scroll horizontally.

Touch: under `@media (pointer:coarse)` every editable control (area notes, currency select, energy add, timesheet form, day note, feedback fields) is pinned to `16px`, because iOS Safari zooms the page in on focusing anything smaller and never zooms back out. The read-only export box keeps its `.74rem` monospace. Pinch zoom stays enabled — never add `maximum-scale` or `user-scalable=no` to the viewport.

---

## 3. Component specs

### 3.1 Header "halo" card
- Rounded `calc(var(--radius) + 6px)`, `--shadow`, 1px `--line` border, padding `24px 26px 26px`
- Background is `--surface` plus two soft radial gradients: accent at top-left (`color-mix(--accent 16%, transparent)`) and gold at top-right (`color-mix(--gold 16%, transparent)`). Keep them subtle
- Top row: brand on the left, on the right a small pill button group: language toggle then theme toggle. Both are `theme-btn` pills: `--surface-2` background, 1px `--line`, radius 999, `0.82rem`, hover raises color to `--ink` and border to `--accent`
- Language toggle shows the target language label ("EN" when RU is active, "РУ" when EN is active) with a small globe glyph
- Theme toggle shows a sun/moon glyph plus the target theme word

### 3.2 Date navigation
- Two round 44px nav buttons (prev/next), `--surface`, 1px `--line`, `--shadow-sm`, chevron icon, hover lifts 1px and border goes `--accent`
- Center: big weekday (Fraunces), full date under it (localized), and a dashed-underline "Back to today" text button that is hidden when the viewed day is today
- Dates format via `Intl.DateTimeFormat` with the active locale (`en-US` or `ru-RU`). Weekday is capitalized

### 3.3 Week strip
- 7 equal columns, Monday first. Each cell: `--surface-2`, radius `--radius-sm`, small uppercase weekday label, big day number (tabular), and a `5px` progress bar underneath
- The progress bar fills 0 to 100% by that day's completed areas over 7, gradient `--accent` to `--gold`
- Selected day: `--surface` background, `--accent` border, `--shadow-sm`. Future days: opacity `.5`
- Tapping a cell navigates to that day

### 3.4 Productivity ring
- SVG `118 x 118`, circle radius `50`, `stroke-width 11`, rotated `-90deg` so it starts at top
- Track stroke `--line`. Fill stroke is a linear gradient `--accent` to `--gold`, `stroke-linecap: round`
- Progress = completed areas / 7. Animate `stroke-dashoffset` with `0.5s cubic-bezier(.4,0,.2,1)`
- Center: big percentage (Fraunces) and the caption below it
- Title and subtitle to the right change by how many areas are done: 0, 1 to 2, 3 to 6, all 7. Use the exact copy from the i18n dictionary (do not rewrite it)

### 3.5 Area card
Structure: header row then a note textarea.
- Header row: icon chip, title group (name + "i" info), check circle. `gap 12px`, whole header is one keyboard-focusable button that toggles done
- Icon chip: `40x40`, radius `12`, background `color-mix(--cat 16%, transparent)`, line icon `22px` stroked in `--cat`, stroke-width `1.9`
- "i" info glyph sits right after the name, muted (opacity `.42`), brightens on hover/focus. On hover or keyboard focus or tap it shows a tooltip: dark bubble (`--ink` background, `--surface` text), `radius 12`, width `min(240px, 74vw)`, a bold area name line then the explanation, centered under the glyph with a small arrow. The tip text comes from the i18n `tips` map. Clicking the glyph must NOT toggle the card (stop propagation)
- The tip must always be dismissable: tapping the glyph again, tapping anywhere outside it, or Escape closes it. Hover only opens it under `@media (hover:hover)` — on touch a sticky `:hover` (or `:focus-within`, since the glyph keeps focus after a tap) would leave the bubble stranded on screen
- Check circle: `26x26`, 2px `--line` border, `--surface-2` fill. When done: fill and border become `--cat`, and a white check icon scales in
- Card "on" state: border `color-mix(--cat 60%, --line)`, background `color-mix(--cat 8%, --surface)`
- Note textarea: borderless with a dashed top rule in `--line`, `0.86rem`, auto-grows with content, placeholder "what you did…" / "что сделала…", focus turns the top rule to `--cat`
- Per-day the check and note come from the day record and save on change

### 3.6 Day timesheet (collapsible)
Collapsed by default, state stored in `tracker_ts_open`.

Collapsed view is a preview card (radius `--radius`, `--shadow-sm`, hover border `--accent` + lift):
- Left: a donut. SVG `78 x 78`, radius `30`, `stroke-width 13`, one arc segment per area proportional to its hours, colored in `--cat`, small `1.5` gap between segments, `stroke-linecap round`. Center shows total hours (Fraunces) and the word "hours" / "часов"
- Right: legend, top 3 areas by hours, each a color dot, short area name, and `hours + percent`. If more than 3, add "+N more" / "и ещё N сфер"
- Far right: an "Expand" affordance
- Empty state (no blocks): faint ring, and a prompt "Plan your day by the hour" / "Распланируйте день по часам"

Expanded view (a card):
- Two-column timeline grid `50px 1fr`. Left column: hour labels from `06:00` to `24:00`. Each hour row is `42px` tall with a top divider
- Right column: relative track, hour gridlines, and blocks positioned absolutely. A block top = `(startHour - 6) * 42 + 2`, height = `(end - start) * 42 - 4`, min height `22px`
- Block: radius `9`, left color bar `4px` in `--cat`, fill `color-mix(--cat 15%, --surface)`, title (ellipsized) and `HH:MM–HH:MM` under it, and a small `×` delete button top-right
- Add form (wraps): Start time, End time, Area select, free-text "What I'm doing", and an Add button (gradient `--accent` to `--gold`). Times use native `<input type="time">`. Validation errors ("Enter a start and end time", "End must be after start") show in `--accent-ink`
- Summary under the timeline: one bar per used area (color dot, short name, meter, hours), then a total line "Planned in total: X h"
- Hours format: one decimal, comma separator in RU (`8,5 ч`), dot in EN (`8.5 h`)

### 3.7 Money today
- Section label reads "Money today · <CURRENCY>" / "Финансы дня · <CURRENCY>", the currency code updates live
- Currency row: label + a select of 13 currencies (`AED USD EUR GBP RUB BYN UAH KZT TRY SAR INR PLN GEL`) shown as `CODE · name` (localized names), plus a muted note "applies to all days". Choice stored in `tracker_currency`, default `AED`, applied everywhere including export headers
- Two money inputs, "Spent today" and "Saved". Each is a rounded `--surface-2` field with the currency code on the left and a right-aligned bold number (`1.12rem`, tabular). Spent field border tinted with accent, saved field tinted with `--good`
- Three chips below: Day balance (`saved - spent`, green when >= 0 via `--good`, rose when negative via `--accent-ink`, prefixed `−` when negative), Saved this month (gold chip, `--gold-soft` background), Spent this month. Month totals sum every stored day in the viewed month
- Money format: `CODE 1,234` using the locale's grouping

### 3.8 Wellbeing
- Two range sliders 1 to 5, Mood and Energy. Track height `8px`, radius `6`. Mood gradient blends `--accent` with a violet `#7C74C9` then to `--accent`. Energy gradient `--gold` to `--accent`
- Thumb: `24px` circle, `--surface` fill, `3px --accent` border, `--shadow-sm`
- Current value shows as a word (Fraunces, `--accent-ink`) from the i18n `moodWords` / `energyWords` arrays. Under the track, three scale captions (low, mid, high) localized

### 3.9 Energy of the day
Two panels side by side (stack on mobile).
- "Gave energy": background gradient from `color-mix(--gold 11%, --surface)`, border tinted gold, icon chip gradient `--gold` to `--accent`, list marks are `+` in `--gold`
- "Drained energy": background gradient from `color-mix(--drain 13%, --surface)`, border tinted `--drain`, icon chip gradient `--drain` to `--accent`, marks are `−` in `--drain`
- Each panel: title (Fraunces), a subtitle, a list of items, and an add row (text input + a square `40px` gradient `+` button). Items are `--surface` pills with the mark, the text, and a `×` remove button. Empty state is a muted hint
- Items are per-day arrays, add on submit (Enter or the button), remove on `×`

### 3.10 Notes
- One large textarea, `--surface-2`, radius `14`, min height `96px`, localized reflective placeholder. Saves per day

### 3.11 Export to Excel
- A hint line, a primary "Build table" button, and a secondary "Copy" button (hidden until the table is built)
- Build assembles a tab-separated table: a header row then one row per filled day. Columns (localized headers, currency injected into the money ones): Date, Weekday, Contribution %, the 7 areas as check marks, Spent, Saved, Balance, Mood, Energy, Area details, Timesheet hours, Gave energy, Drained energy, Day note
- Copy selects the textarea and copies. A published static page cannot download a file, copy-paste into a sheet is the mechanism. In the native app this becomes a real share/export

### 3.12 Feedback & support (collapsible)
Collapsed by default (`tracker_fb_open`), preview is an envelope icon + "Got an idea or found a bug?" + a "Contact" affordance.
Expanded: a hint, an email field, a type select, a message textarea, a "Send by email" primary link and a "Copy text" button.
- Current behavior is `mailto:` to the creator address, prefilled subject and body. The address is not shown in the UI. In the native app, replace this with a backend endpoint (see ARCHITECTURE.md), keep the same form

### 3.13 Footer
- Centered muted line "Everything saves automatically in this browser. Last saved: <time>". In the native app this becomes "Synced" once accounts land

---

## 4. Behavior and data

- Day record shape: `{ done:{areaId:bool}, notes:{areaId:string}, spent, saved, mood(1..5), energy(1..5), dayNote, blocks:[{s,e,c,t}], gave:[string], took:[string] }`. `s` and `e` are decimal hours, `c` is an area id, `t` is a label
- Store: `localStorage` `tracker_v1` = map of `YYYY-MM-DD` to day record. In the product this moves behind a `storage` interface, then to the backend
- Autosave: debounce `350ms`, silent
- Week starts Monday. Month totals use the viewed month
- Language default English, toggle stored in `tracker_lang`, switching re-renders all text and rebuilds the area cards, the timesheet area options, the currency options and the feedback type options, and it preserves all entered data
- Reduced motion: disable transitions under `prefers-reduced-motion: reduce`
- Focus ring: `2px --accent`, offset `2px`

---

## 5. Accessibility checklist (must pass)

- Every interactive element reachable and operable by keyboard: area cards toggle on Enter or Space, the "i" tip opens on focus, collapsibles toggle, sliders work with arrows
- Visible focus on everything focusable
- `aria-pressed` on area cards, `aria-expanded` on collapsibles, `aria-label` on icon-only buttons, localized
- Color is never the only signal (the check has a shape, the balance has a sign)
- Contrast holds in both themes, especially `--ink-soft` on `--surface-2`

---

## 6. Mobile app path (App Store)

Two routes, pick by how native you want it to feel. Either way, the design tokens and copy above are shared and unchanged.

- **Fastest to the App Store, full visual parity: Capacitor.** Wrap the React web build in Capacitor, ship as a native iOS shell. You reuse 100% of the UI and CSS, so it looks exactly like the screenshots from day one. Add native touches: safe-area insets, a themed status bar, light haptics on toggles, and the native share sheet for export. This is the recommended first release
- **Most native feel, more work: React Native or Expo.** Rebuild the components natively and port the tokens into a theme file. Better gestures and performance, at the cost of reimplementing every component. Consider this for a later version, not the first launch

For either route, before the App Store build:
- Replace `localStorage` with the synced storage layer and add accounts (ROADMAP Phase 2), so a user reinstalling or switching devices keeps their data
- Replace the `mailto:` feedback with the backend endpoint
- App icon, splash, and screenshots derive from this same design. Keep the rose/plum palette and Fraunces wordmark

---

## 7. Parity checklist (do this before calling it done)

- [ ] Side-by-side with each screenshot in `docs/screenshots/`, both themes, both languages, mobile and desktop widths
- [ ] All tokens match section 1 exactly, no stray hexes
- [ ] Fraunces used only where section 1.5 says, Manrope everywhere else
- [ ] Ring, donut, sliders, chips render identically including the gradients
- [ ] Timesheet math: block positions, hour totals, donut segments, percentages
- [ ] Currency and date formatting differ correctly between EN and RU
- [ ] Language switch keeps all entered data
- [ ] Keyboard and focus pass, reduced motion respected
- [ ] Nothing scrolls horizontally at 360px width
