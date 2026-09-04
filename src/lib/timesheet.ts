import { AREAS } from './areas';
import { decimalSeparator } from './money';
import type { AreaId, Lang, TimeBlock } from './types';

/** The timeline runs 06:00 → 24:00 at 42px per hour. */
export const TS_START = 6;
export const TS_END = 24;
export const TS_H = 42;

/** `"09:30"` → `9.5`. Returns null for anything unparseable. */
export function parseTime(v: string): number | null {
  if (!v) return null;
  const p = v.split(':');
  if (p.length < 2) return null;
  const h = Number(p[0]);
  const m = Number(p[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h + m / 60;
}

/** `9.5` → `"09:30"`. */
export function hm(x: number): string {
  let h = Math.floor(x);
  let m = Math.round((x - h) * 60);
  if (m === 60) {
    h++;
    m = 0;
  }
  return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
}

/** One decimal, with the language's decimal separator. */
export function hoursStr(x: number, lang: Lang): string {
  return (Math.round(x * 10) / 10).toString().replace('.', decimalSeparator(lang));
}

export interface AreaTotals {
  totals: Partial<Record<AreaId, number>>;
  total: number;
}

/** Hours per area across the day's blocks; zero-or-negative blocks are ignored. */
export function areaTotals(blocks: TimeBlock[] | undefined): AreaTotals {
  const totals: Partial<Record<AreaId, number>> = {};
  let total = 0;
  (blocks ?? []).forEach((b) => {
    const h = b.e - b.s;
    if (h > 0) {
      totals[b.c] = (totals[b.c] ?? 0) + h;
      total += h;
    }
  });
  return { totals, total };
}

/** Areas that have hours, in card order — used by the timesheet summary bars. */
export function areasWithHours(totals: Partial<Record<AreaId, number>>) {
  return AREAS.filter((c) => totals[c.id]);
}

/** Areas that have hours, biggest first — used by the donut and its legend. */
export function areasByHours(totals: Partial<Record<AreaId, number>>) {
  return areasWithHours(totals).sort((a, b) => (totals[b.id] ?? 0) - (totals[a.id] ?? 0));
}
