import type { Lang } from './types';

/** A day key in `YYYY-MM-DD` form — the key used in storage. */
export type DayKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function keyOf(d: Date): DayKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * A local `Date` for a day key. Midday, not midnight, so day arithmetic can
 * never be nudged across a boundary by a DST transition; every field we read
 * from it (weekday, day, month, year) is unaffected.
 */
export function dateOf(key: DayKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function todayKey(): DayKey {
  return keyOf(new Date());
}

export function addDays(key: DayKey, delta: number): DayKey {
  const d = dateOf(key);
  d.setDate(d.getDate() + delta);
  return keyOf(d);
}

/** The seven keys of the Monday-first week containing `key`. */
export function weekKeys(key: DayKey): DayKey[] {
  const d = dateOf(key);
  const monday = addDays(key, -((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** Day keys are ISO, so lexicographic order is chronological order. */
export function isFuture(key: DayKey): boolean {
  return key > todayKey();
}

export function isToday(key: DayKey): boolean {
  return key === todayKey();
}

/** `YYYY-MM` — used to sum a month's money. */
export function monthOf(key: DayKey): string {
  return key.slice(0, 7);
}

export function localeOf(lang: Lang): string {
  return lang === 'ru' ? 'ru-RU' : 'en-US';
}

export function weekdayLong(key: DayKey, lang: Lang): string {
  return dateOf(key).toLocaleDateString(localeOf(lang), { weekday: 'long' });
}

/** The MVP capitalises the weekday headline — Russian locales lower-case it. */
export function weekdayHeadline(key: DayKey, lang: Lang): string {
  const wd = weekdayLong(key, lang);
  return wd.charAt(0).toUpperCase() + wd.slice(1);
}

export function fullDate(key: DayKey, lang: Lang): string {
  return dateOf(key).toLocaleDateString(localeOf(lang), { day: 'numeric', month: 'long', year: 'numeric' });
}

export function timeOfDay(d: Date, lang: Lang): string {
  return d.toLocaleTimeString(localeOf(lang), { hour: '2-digit', minute: '2-digit' });
}
