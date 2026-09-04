import { describe, expect, it } from 'vitest';
import { areaTotals, areasByHours, areasWithHours, hm, hoursStr, parseTime } from './timesheet';
import type { TimeBlock } from './types';

const block = (s: number, e: number, c: TimeBlock['c'], t = ''): TimeBlock => ({ s, e, c, t });

describe('parseTime', () => {
  it('reads an <input type=time> value as fractional hours', () => {
    expect(parseTime('09:30')).toBe(9.5);
    expect(parseTime('00:00')).toBe(0);
    expect(parseTime('23:45')).toBe(23.75);
  });

  it('returns null for anything unusable', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('9')).toBeNull();
    expect(parseTime('ab:cd')).toBeNull();
  });
});

describe('hm', () => {
  it('formats fractional hours back to HH:MM', () => {
    expect(hm(9.5)).toBe('09:30');
    expect(hm(14)).toBe('14:00');
  });

  it('carries a rounded 60th minute into the next hour', () => {
    expect(hm(9.999)).toBe('10:00');
  });
});

describe('hoursStr', () => {
  it('keeps one decimal and follows the language separator', () => {
    expect(hoursStr(3.25, 'en')).toBe('3.3');
    expect(hoursStr(3.25, 'ru')).toBe('3,3');
    expect(hoursStr(4, 'en')).toBe('4');
  });
});

describe('areaTotals', () => {
  it('sums hours per area and overall', () => {
    const { totals, total } = areaTotals([block(9, 12, 'work'), block(13, 14.5, 'work'), block(18, 19, 'sport')]);
    expect(totals.work).toBe(4.5);
    expect(totals.sport).toBe(1);
    expect(total).toBe(5.5);
  });

  it('ignores blocks that do not move forward in time', () => {
    const { totals, total } = areaTotals([block(9, 9, 'work'), block(12, 11, 'work')]);
    expect(totals.work).toBeUndefined();
    expect(total).toBe(0);
  });

  it('treats a missing block list as an empty day', () => {
    expect(areaTotals(undefined)).toEqual({ totals: {}, total: 0 });
  });
});

describe('area ordering', () => {
  const { totals } = areaTotals([block(9, 10, 'sport'), block(10, 14, 'work'), block(14, 16, 'food')]);

  it('keeps card order for the summary bars', () => {
    expect(areasWithHours(totals).map((c) => c.id)).toEqual(['work', 'sport', 'food']);
  });

  it('sorts biggest first for the donut', () => {
    expect(areasByHours(totals).map((c) => c.id)).toEqual(['work', 'food', 'sport']);
  });
});
