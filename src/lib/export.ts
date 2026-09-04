import { AREAS } from './areas';
import { weekdayLong } from './date';
import { toAmount } from './money';
import { areaTotals, areasWithHours } from './timesheet';
import type { AreaId, DayMap, DayRecord, Lang } from './types';

export interface ExportContext {
  lang: Lang;
  currency: string;
  /** Column headers, still containing the `{cur}` placeholder. */
  columns: string[];
  areaName: (id: AreaId) => string;
  areaShort: (id: AreaId) => string;
}

export interface ExportResult {
  text: string;
  count: number;
}

/** Tabs and newlines would break the tab-separated table, so they collapse to spaces. */
function cell(v: unknown): string {
  return String(v ?? '')
    .replace(/\t/g, ' ')
    .replace(/\s*\n\s*/g, ' ');
}

/** A day is exported only once the user has actually put something in it. */
export function hasContent(d: DayRecord | undefined): boolean {
  if (!d) return false;
  if (d.done && AREAS.some((c) => d.done[c.id])) return true;
  if (d.spent || d.saved || d.dayNote?.trim()) return true;
  if (d.notes && AREAS.some((c) => d.notes[c.id])) return true;
  if (d.blocks?.length) return true;
  if (d.gave?.length || d.took?.length) return true;
  return false;
}

/** `"Work 3.5; Sport 1"` — hours always use a dot here, as in the MVP. */
function timesheetCell(d: DayRecord, areaShort: (id: AreaId) => string): string {
  const { totals } = areaTotals(d.blocks);
  return areasWithHours(totals)
    .map((c) => `${areaShort(c.id)} ${Math.round((totals[c.id] as number) * 10) / 10}`)
    .join('; ');
}

/** Builds the tab-separated table pasted into Excel / Google Sheets. */
export function buildExportTable(days: DayMap, ctx: ExportContext): ExportResult {
  const header = ctx.columns.map((x) => x.replace('{cur}', ctx.currency));
  const lines = [header.join('\t')];
  const keys = Object.keys(days)
    .filter((k) => hasContent(days[k]))
    .sort();

  keys.forEach((k) => {
    const d = days[k];
    let doneN = 0;
    const checks = AREAS.map((c) => {
      const on = d.done && d.done[c.id];
      if (on) doneN++;
      return on ? '✓' : '';
    });
    const pct = Math.round((doneN / AREAS.length) * 100);
    const details = AREAS.filter((c) => d.notes && d.notes[c.id])
      .map((c) => `${ctx.areaName(c.id)}: ${d.notes[c.id]}`)
      .join('; ');
    const spent = toAmount(d.spent);
    const saved = toAmount(d.saved);
    const row: unknown[] = [
      k,
      weekdayLong(k, ctx.lang),
      pct,
      ...checks,
      spent,
      saved,
      saved - spent,
      d.mood || '',
      d.energy || '',
      details,
      timesheetCell(d, ctx.areaShort),
      (d.gave ?? []).join('; '),
      (d.took ?? []).join('; '),
      d.dayNote || '',
    ];
    lines.push(row.map(cell).join('\t'));
  });

  return { text: lines.join('\n'), count: keys.length };
}
