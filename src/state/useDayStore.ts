import { create } from 'zustand';
import i18n from '../i18n';
import { DEFAULT_CURRENCY } from '../lib/currency';
import { addDays, timeOfDay, todayKey } from '../lib/date';
import type { DayKey } from '../lib/date';
import { getStorage } from '../lib/storage';
import { blankDay } from '../lib/types';
import type { AreaId, DayMap, DayRecord, Lang, Theme, TimeBlock } from '../lib/types';

/** Autosave delay — long enough to never block typing, short enough to feel instant. */
export const SAVE_DEBOUNCE_MS = 350;

export type EnergyKind = 'gave' | 'took';

/** A stable object for days that have no record yet, so selectors keep identity. */
const EMPTY_DAY: DayRecord = blankDay();

export interface DayStore {
  days: DayMap;
  viewDate: DayKey;
  theme: Theme | null;
  currency: string;
  tsOpen: boolean;
  fbOpen: boolean;
  /** Formatted clock time of the last write, frozen at save time. */
  savedAt: string;

  bootstrap: () => void;
  setViewDate: (key: DayKey) => void;
  shiftDay: (delta: number) => void;
  goToday: () => void;

  toggleArea: (id: AreaId) => void;
  setAreaNote: (id: AreaId, note: string) => void;
  setSpent: (value: string) => void;
  setSaved: (value: string) => void;
  setMood: (value: number) => void;
  setEnergy: (value: number) => void;
  setDayNote: (value: string) => void;

  addBlock: (block: TimeBlock) => void;
  removeBlock: (index: number) => void;
  addEnergyItem: (kind: EnergyKind, text: string) => void;
  removeEnergyItem: (kind: EnergyKind, index: number) => void;

  setCurrency: (code: string) => void;
  setTheme: (theme: Theme) => void;
  setTsOpen: (open: boolean) => void;
  setFbOpen: (open: boolean) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function readTheme(): Theme | null {
  const stored = getStorage().getPref('theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
}

export const useDayStore = create<DayStore>()((set, get) => {
  /** Writes immediately and stamps "last saved", like the MVP's persist(). */
  const saveNow = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    getStorage().saveDays(get().days);
    set({ savedAt: timeOfDay(new Date(), i18n.language as Lang) });
  };

  const saveSoon = () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      saveNow();
    }, SAVE_DEBOUNCE_MS);
  };

  /** Copy-on-write update of the day currently on screen. */
  const editDay = (fn: (day: DayRecord) => DayRecord) => {
    const { days, viewDate } = get();
    set({ days: { ...days, [viewDate]: fn(days[viewDate] ?? blankDay()) } });
  };

  const edit = (fn: (day: DayRecord) => DayRecord, immediate = false) => {
    editDay(fn);
    if (immediate) saveNow();
    else saveSoon();
  };

  return {
    days: getStorage().loadDays(),
    viewDate: todayKey(),
    theme: readTheme(),
    currency: getStorage().getPref('currency') || DEFAULT_CURRENCY,
    tsOpen: getStorage().getPref('tsOpen') === '1',
    fbOpen: getStorage().getPref('fbOpen') === '1',
    savedAt: '—',

    bootstrap: saveNow,
    setViewDate: (key) => set({ viewDate: key }),
    shiftDay: (delta) => set({ viewDate: addDays(get().viewDate, delta) }),
    goToday: () => set({ viewDate: todayKey() }),

    toggleArea: (id) => edit((d) => ({ ...d, done: { ...d.done, [id]: !d.done[id] } })),
    setAreaNote: (id, note) => edit((d) => ({ ...d, notes: { ...d.notes, [id]: note } })),
    setSpent: (value) => edit((d) => ({ ...d, spent: value })),
    setSaved: (value) => edit((d) => ({ ...d, saved: value })),
    setMood: (value) => edit((d) => ({ ...d, mood: value })),
    setEnergy: (value) => edit((d) => ({ ...d, energy: value })),
    setDayNote: (value) => edit((d) => ({ ...d, dayNote: value })),

    addBlock: (block) => edit((d) => ({ ...d, blocks: [...d.blocks, block] }), true),
    removeBlock: (index) => edit((d) => ({ ...d, blocks: d.blocks.filter((_, i) => i !== index) }), true),
    addEnergyItem: (kind, text) => edit((d) => ({ ...d, [kind]: [...d[kind], text] }), true),
    removeEnergyItem: (kind, index) => edit((d) => ({ ...d, [kind]: d[kind].filter((_, i) => i !== index) }), true),

    setCurrency: (code) => {
      getStorage().setPref('currency', code);
      set({ currency: code });
    },
    setTheme: (theme) => {
      getStorage().setPref('theme', theme);
      set({ theme });
    },
    setTsOpen: (open) => {
      getStorage().setPref('tsOpen', open ? '1' : '0');
      set({ tsOpen: open });
    },
    setFbOpen: (open) => {
      getStorage().setPref('fbOpen', open ? '1' : '0');
      set({ fbOpen: open });
    },
  };
});

/** The record for the day on screen — a stable blank when nothing is stored yet. */
export function useCurrentDay(): DayRecord {
  return useDayStore((s) => s.days[s.viewDate] ?? EMPTY_DAY);
}

export function useDayRecord(key: DayKey): DayRecord {
  return useDayStore((s) => s.days[key] ?? EMPTY_DAY);
}
