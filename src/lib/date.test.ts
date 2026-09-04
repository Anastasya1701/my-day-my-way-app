import { afterEach, describe, expect, it, vi } from 'vitest';
import { addDays, dateOf, fullDate, isFuture, isToday, keyOf, monthOf, todayKey, weekKeys, weekdayHeadline } from './date';

afterEach(() => {
  vi.useRealTimers();
});

describe('keys', () => {
  it('pads month and day', () => {
    expect(keyOf(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
    expect(keyOf(new Date(2026, 11, 31, 12))).toBe('2026-12-31');
  });

  it('reads a key back as a local date', () => {
    const d = dateOf('2026-09-04');
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 8, 4]);
  });

  it('exposes the month for the running money totals', () => {
    expect(monthOf('2026-09-04')).toBe('2026-09');
  });
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
  });
});

describe('weekKeys', () => {
  it('returns the Monday-first week containing the day', () => {
    // 2026-09-04 is a Friday
    expect(weekKeys('2026-09-04')).toEqual([
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
      '2026-09-06',
    ]);
  });

  it('treats Sunday as the last day of its week', () => {
    expect(weekKeys('2026-09-06')[0]).toBe('2026-08-31');
    expect(weekKeys('2026-09-06')[6]).toBe('2026-09-06');
  });
});

describe('today', () => {
  it('marks tomorrow as the future and today as neither', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 4, 10));

    expect(todayKey()).toBe('2026-09-04');
    expect(isToday('2026-09-04')).toBe(true);
    expect(isFuture('2026-09-04')).toBe(false);
    expect(isFuture('2026-09-05')).toBe(true);
    expect(isFuture('2026-09-03')).toBe(false);
  });
});

describe('display', () => {
  it('capitalises the weekday headline in both languages', () => {
    expect(weekdayHeadline('2026-09-04', 'en')).toBe('Friday');
    expect(weekdayHeadline('2026-09-04', 'ru')).toBe('Пятница');
  });

  it('spells the full date per locale', () => {
    expect(fullDate('2026-09-04', 'en')).toBe('September 4, 2026');
    expect(fullDate('2026-09-04', 'ru')).toBe('4 сентября 2026 г.');
  });
});
