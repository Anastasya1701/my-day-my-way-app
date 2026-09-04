import { describe, expect, it } from 'vitest';
import { AREA_COUNT, contributionPct, doneCount, summaryKey } from './contribution';
import { blankDay } from './types';
import type { AreaId } from './types';

const dayWith = (...ids: AreaId[]) => ({ ...blankDay(), done: Object.fromEntries(ids.map((id) => [id, true])) });

describe('contributionPct', () => {
  it('is zero for an untouched day', () => {
    expect(contributionPct(blankDay())).toBe(0);
    expect(contributionPct(undefined)).toBe(0);
  });

  it('rounds the share of the seven areas', () => {
    expect(contributionPct(dayWith('work'))).toBe(14);
    expect(contributionPct(dayWith('work', 'sport', 'food'))).toBe(43);
  });

  it('reaches 100% only when every area is marked', () => {
    expect(contributionPct(dayWith('mental', 'personal', 'work', 'growth', 'insta', 'sport'))).toBe(86);
    expect(contributionPct(dayWith('mental', 'personal', 'work', 'growth', 'insta', 'sport', 'food'))).toBe(100);
  });

  it('ignores areas explicitly turned back off', () => {
    expect(doneCount({ done: { work: true, sport: false } })).toBe(1);
  });
});

describe('summaryKey', () => {
  it('picks the encouragement that matches the count', () => {
    expect(summaryKey(0)).toBe('none');
    expect(summaryKey(1)).toBe('few');
    expect(summaryKey(2)).toBe('few');
    expect(summaryKey(3)).toBe('many');
    expect(summaryKey(AREA_COUNT - 1)).toBe('many');
    expect(summaryKey(AREA_COUNT)).toBe('all');
  });
});
