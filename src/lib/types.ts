/** The seven areas of contribution. Ids are persisted — never rename them. */
export type AreaId = 'mental' | 'personal' | 'work' | 'growth' | 'insta' | 'sport' | 'food';

export type Lang = 'ru' | 'en';
export type Theme = 'light' | 'dark';

/** A planned block of the day. `s`/`e` are hours as floats (9.5 === 09:30). */
export interface TimeBlock {
  s: number;
  e: number;
  c: AreaId;
  t: string;
}

/** One day record, shaped exactly like the MVP's `tracker_v1` entries. */
export interface DayRecord {
  done: Partial<Record<AreaId, boolean>>;
  notes: Partial<Record<AreaId, string>>;
  spent: string;
  saved: string;
  mood: number;
  energy: number;
  dayNote: string;
  blocks: TimeBlock[];
  gave: string[];
  took: string[];
}

/** `YYYY-MM-DD` → day record. */
export type DayMap = Record<string, DayRecord>;

export function blankDay(): DayRecord {
  return { done: {}, notes: {}, spent: '', saved: '', mood: 3, energy: 3, dayNote: '', blocks: [], gave: [], took: [] };
}
