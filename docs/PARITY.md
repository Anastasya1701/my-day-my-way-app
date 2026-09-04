# Parity with the MVP

Phase 1 was a **port, not a redesign**: the React app had to look and behave exactly like
`legacy/index.html`. This is how that was checked, and the two places the port deliberately
differs.

## How it was verified

Both versions were served from the same origin (`npm run dev` serves the app at `/` and the MVP
at `/legacy/index.html`), seeded with identical `localStorage`, and driven by the same scripted
run in headless Chromium.

**Static render.** Three configurations — collapsed sections in light EN, every section expanded
in dark RU, and a 390px-wide mobile viewport in light RU — each seeded with a filled day
(areas marked, notes, four timesheet blocks, money, sliders, energy items, a day note) plus a
second day earlier in the week.

For all three: identical page text, identical `scrollHeight`, and **byte-identical full-page
screenshots**.

**Interaction.** One scripted run of about thirty steps against each version: marking areas,
opening an info tip, expanding the timesheet from its preview, adding and deleting blocks,
triggering both validation messages, entering money, changing currency, moving the sliders with
the keyboard, adding and removing energy items, writing a day note, navigating to the previous
day and back to today, building the export table, filling in the feedback form, and switching
both language and theme.

Every checkpoint matched (ring percentage, summary copy, timesheet meta and bars, balance and
monthly totals, slider words, week-strip fills, the export row, the `mailto:` URL, the toggle
labels), the resulting page text matched, and the final full-page screenshot was again
byte-identical.

**Accessibility.** Every element carrying `role`, `tabindex`, `aria-label`, `aria-pressed`,
`aria-expanded`, `aria-controls`, `placeholder` or `for` was compared in both languages: 47
annotated elements, identical in both versions. Tab order and keyboard activation (Space/Enter on
the area cards, the info tips and both collapsed previews) behave the same, and Space on a card
still does not scroll the page.

## The two intentional differences

1. **Blank days are no longer written to storage.** Visiting a day in the MVP created an empty
   record for it in `tracker_v1`; the React version only stores a day once it has content. Nothing
   user-visible depends on this — the export already filtered empty days — and it keeps the blob
   (which Phase 2 has to sync) free of noise.

2. **An open info tip survives a language switch.** The MVP rebuilt every area card when the
   language changed, which incidentally closed any open tip and dropped keyboard focus. React
   updates the text in place, so the tip stays open and reads in the new language. Reproducing the
   old behaviour would mean deliberately closing tips on language change.

Everything else — layout, spacing, copy, colours, animations, both themes, both languages, the
storage keys and the shape of the stored data — is unchanged.

## Re-checking after a change

There is no screenshot test in CI (fonts and rendering differ per machine, so it would be
flaky). If you touch shared markup or `src/styles`, re-run the comparison by hand: serve both,
drive the same actions, and diff the rendered text and screenshots. `npm test` and
`npm run test:e2e` cover the behaviour that can be asserted deterministically.
