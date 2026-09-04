import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAVE_DEBOUNCE_MS } from './useDayStore';
import type { DayStore } from './useDayStore';
import { STORAGE_KEYS } from '../lib/storage';
import { todayKey } from '../lib/date';
import { memoryBackend } from '../test/memoryStorage';
import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Builds a store on a fresh module graph, so each case starts from whatever
 * the given backend holds — the same path a page reload takes.
 */
async function loadStore(backend: Storage): Promise<UseBoundStore<StoreApi<DayStore>>> {
  vi.resetModules();
  const storage = await import('../lib/storage');
  storage.setStorage(storage.createLocalStorage(backend));
  const { useDayStore } = await import('./useDayStore');
  return useDayStore;
}

const stored = (backend: Storage) => JSON.parse(backend.getItem(STORAGE_KEYS.days) ?? '{}');

let backend: Storage;

beforeEach(() => {
  backend = memoryBackend();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('autosave', () => {
  it('waits out the debounce before writing, then stamps the save', async () => {
    const store = await loadStore(backend);
    vi.useFakeTimers();

    store.getState().toggleArea('work');
    expect(backend.getItem(STORAGE_KEYS.days)).toBeNull();
    expect(store.getState().savedAt).toBe('—');

    vi.advanceTimersByTime(SAVE_DEBOUNCE_MS);
    expect(stored(backend)[todayKey()].done.work).toBe(true);
    expect(store.getState().savedAt).not.toBe('—');
  });

  it('collapses a burst of typing into one write', async () => {
    const store = await loadStore(backend);
    vi.useFakeTimers();

    'hello'.split('').forEach((_, i) => {
      store.getState().setDayNote('hello'.slice(0, i + 1));
      vi.advanceTimersByTime(50);
    });
    expect(backend.getItem(STORAGE_KEYS.days)).toBeNull();

    vi.advanceTimersByTime(SAVE_DEBOUNCE_MS);
    expect(stored(backend)[todayKey()].dayNote).toBe('hello');
  });

  it('writes timesheet blocks and energy items immediately', async () => {
    const store = await loadStore(backend);
    vi.useFakeTimers();

    store.getState().addBlock({ s: 9, e: 10, c: 'work', t: 'standup' });
    expect(stored(backend)[todayKey()].blocks).toHaveLength(1);

    store.getState().addEnergyItem('gave', 'a walk');
    expect(stored(backend)[todayKey()].gave).toEqual(['a walk']);

    store.getState().removeEnergyItem('gave', 0);
    expect(stored(backend)[todayKey()].gave).toEqual([]);
  });
});

describe('save and load round-trip', () => {
  it('restores a full day after a reload', async () => {
    const first = await loadStore(backend);
    vi.useFakeTimers();

    first.getState().toggleArea('sport');
    first.getState().setAreaNote('sport', 'morning run');
    first.getState().setSpent('40');
    first.getState().setSaved('15');
    first.getState().setMood(5);
    first.getState().setEnergy(2);
    first.getState().setDayNote('a good day');
    first.getState().addBlock({ s: 9, e: 12.5, c: 'work', t: 'deep work' });
    first.getState().addEnergyItem('took', 'a long meeting');
    vi.advanceTimersByTime(SAVE_DEBOUNCE_MS);
    vi.useRealTimers();

    const reloaded = await loadStore(backend);
    const day = reloaded.getState().days[todayKey()];

    expect(day).toMatchObject({
      done: { sport: true },
      notes: { sport: 'morning run' },
      spent: '40',
      saved: '15',
      mood: 5,
      energy: 2,
      dayNote: 'a good day',
      blocks: [{ s: 9, e: 12.5, c: 'work', t: 'deep work' }],
      took: ['a long meeting'],
    });
  });

  it('keeps each day separate', async () => {
    const store = await loadStore(backend);
    vi.useFakeTimers();

    store.getState().setViewDate('2026-09-04');
    store.getState().toggleArea('work');
    store.getState().setViewDate('2026-09-05');
    store.getState().toggleArea('food');
    vi.advanceTimersByTime(SAVE_DEBOUNCE_MS);

    expect(stored(backend)['2026-09-04'].done).toEqual({ work: true });
    expect(stored(backend)['2026-09-05'].done).toEqual({ food: true });
  });

  it('removes a timesheet block by its position in the unsorted list', async () => {
    const store = await loadStore(backend);
    store.getState().addBlock({ s: 14, e: 15, c: 'sport', t: 'gym' });
    store.getState().addBlock({ s: 9, e: 10, c: 'work', t: 'standup' });

    store.getState().removeBlock(0);

    expect(stored(backend)[todayKey()].blocks).toEqual([{ s: 9, e: 10, c: 'work', t: 'standup' }]);
  });
});

describe('day navigation', () => {
  it('steps a day at a time and comes back to today', async () => {
    const store = await loadStore(backend);

    store.getState().setViewDate('2026-09-04');
    store.getState().shiftDay(1);
    expect(store.getState().viewDate).toBe('2026-09-05');

    store.getState().shiftDay(-3);
    expect(store.getState().viewDate).toBe('2026-09-02');

    store.getState().goToday();
    expect(store.getState().viewDate).toBe(todayKey());
  });
});

describe('preferences', () => {
  it('remembers currency, theme and the collapsed sections', async () => {
    const store = await loadStore(backend);

    store.getState().setCurrency('GEL');
    store.getState().setTheme('dark');
    store.getState().setTsOpen(true);
    store.getState().setFbOpen(false);

    expect(backend.getItem('tracker_currency')).toBe('GEL');
    expect(backend.getItem('tracker_theme')).toBe('dark');
    expect(backend.getItem('tracker_ts_open')).toBe('1');
    expect(backend.getItem('tracker_fb_open')).toBe('0');

    const reloaded = await loadStore(backend);
    expect(reloaded.getState()).toMatchObject({ currency: 'GEL', theme: 'dark', tsOpen: true, fbOpen: false });
  });

  it('defaults to AED and the system theme on a fresh browser', async () => {
    const store = await loadStore(backend);
    expect(store.getState()).toMatchObject({ currency: 'AED', theme: null, tsOpen: false, fbOpen: false });
  });
});
