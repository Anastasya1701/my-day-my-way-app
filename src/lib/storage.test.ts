import { describe, expect, it } from 'vitest';
import { STORAGE_KEYS, createLocalStorage, normalizeDay, normalizeDays } from './storage';
import { blankDay } from './types';
import type { DayMap } from './types';
import { memoryBackend } from '../test/memoryStorage';

const filledDay = {
  ...blankDay(),
  done: { work: true },
  notes: { work: 'shipped the migration' },
  spent: '42',
  saved: '10',
  mood: 4,
  energy: 2,
  dayNote: 'a good day',
  blocks: [{ s: 9, e: 12, c: 'work' as const, t: 'deep work' }],
  gave: ['a walk'],
  took: ['a long meeting'],
};

describe('normalizeDay', () => {
  it('fills in everything a partial record is missing', () => {
    expect(normalizeDay({ spent: '5' })).toEqual({ ...blankDay(), spent: '5' });
  });

  it('replaces collections of the wrong shape', () => {
    const d = normalizeDay({ done: null, blocks: 'nope', gave: undefined });
    expect(d.done).toEqual({});
    expect(d.blocks).toEqual([]);
    expect(d.gave).toEqual([]);
  });

  it('falls back to a blank day for junk', () => {
    expect(normalizeDay(null)).toEqual(blankDay());
    expect(normalizeDay('nope')).toEqual(blankDay());
  });

  it('keeps fields it does not know about', () => {
    expect(normalizeDay({ future: 'field' })).toMatchObject({ future: 'field' });
  });
});

describe('normalizeDays', () => {
  it('normalises every day in the map', () => {
    expect(normalizeDays({ '2026-09-04': { spent: '5' } })['2026-09-04'].blocks).toEqual([]);
  });

  it('survives a corrupt payload', () => {
    expect(normalizeDays(null)).toEqual({});
  });
});

describe('createLocalStorage', () => {
  it('round-trips a full day through the backend', () => {
    const backend = memoryBackend();
    const storage = createLocalStorage(backend);
    const days: DayMap = { '2026-09-04': filledDay };

    storage.saveDays(days);
    expect(backend.getItem(STORAGE_KEYS.days)).toBeTruthy();
    expect(createLocalStorage(backend).loadDays()).toEqual(days);
  });

  it('reads and writes preferences under the MVP key names', () => {
    const backend = memoryBackend();
    const storage = createLocalStorage(backend);

    expect(storage.getPref('currency')).toBeNull();
    storage.setPref('currency', 'GEL');
    expect(backend.getItem('tracker_currency')).toBe('GEL');
    expect(storage.getPref('currency')).toBe('GEL');
  });

  it('returns an empty map when the stored JSON is broken', () => {
    const backend = memoryBackend();
    backend.setItem(STORAGE_KEYS.days, '{not json');
    expect(createLocalStorage(backend).loadDays()).toEqual({});
  });

  it('keeps working when the backend throws', () => {
    const throwing = {
      ...memoryBackend(),
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    } as unknown as Storage;
    const storage = createLocalStorage(throwing);

    expect(storage.loadDays()).toEqual({});
    expect(storage.getPref('theme')).toBeNull();
    expect(() => storage.saveDays({})).not.toThrow();
    expect(() => storage.setPref('theme', 'dark')).not.toThrow();
  });
});
