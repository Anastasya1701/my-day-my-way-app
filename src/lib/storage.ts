import { blankDay } from './types';
import type { DayMap, DayRecord } from './types';

/** localStorage keys — unchanged from the MVP so existing data keeps working. */
export const STORAGE_KEYS = {
  days: 'tracker_v1',
  theme: 'tracker_theme',
  lang: 'tracker_lang',
  currency: 'tracker_currency',
  tsOpen: 'tracker_ts_open',
  fbOpen: 'tracker_fb_open',
} as const;

export type PrefKey = Exclude<keyof typeof STORAGE_KEYS, 'days'>;

/**
 * Everything the app persists goes through this interface. Today it is backed
 * by localStorage; in Phase 2 the same local cache stays the UI's source of
 * truth and a sync module pushes/pulls it to the backend, so nothing above
 * this line has to change.
 */
export interface TrackerStorage {
  loadDays(): DayMap;
  saveDays(days: DayMap): void;
  getPref(key: PrefKey): string | null;
  setPref(key: PrefKey, value: string): void;
}

/** Fills in anything a stored record is missing, keeping unknown fields. */
export function normalizeDay(raw: unknown): DayRecord {
  const base = blankDay();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<DayRecord>;
  return {
    ...base,
    ...r,
    done: r.done && typeof r.done === 'object' ? r.done : {},
    notes: r.notes && typeof r.notes === 'object' ? r.notes : {},
    blocks: Array.isArray(r.blocks) ? r.blocks : [],
    gave: Array.isArray(r.gave) ? r.gave : [],
    took: Array.isArray(r.took) ? r.took : [],
  };
}

export function normalizeDays(raw: unknown): DayMap {
  if (!raw || typeof raw !== 'object') return {};
  const out: DayMap = {};
  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    out[key] = normalizeDay(value);
  });
  return out;
}

/**
 * Storage can throw (Safari private mode, disabled cookies, quota). The MVP
 * swallowed those failures and kept working in memory; so do we.
 */
export function createLocalStorage(backend: Storage | undefined = safeBackend()): TrackerStorage {
  return {
    loadDays() {
      try {
        const raw = backend?.getItem(STORAGE_KEYS.days);
        return raw ? normalizeDays(JSON.parse(raw)) : {};
      } catch {
        return {};
      }
    },
    saveDays(days) {
      try {
        backend?.setItem(STORAGE_KEYS.days, JSON.stringify(days));
      } catch {
        /* keep working in memory */
      }
    },
    getPref(key) {
      try {
        return backend?.getItem(STORAGE_KEYS[key]) ?? null;
      } catch {
        return null;
      }
    },
    setPref(key, value) {
      try {
        backend?.setItem(STORAGE_KEYS[key], value);
      } catch {
        /* keep working in memory */
      }
    },
  };
}

function safeBackend(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

export const trackerStorage = createLocalStorage();
