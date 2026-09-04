import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import { buildExportTable, hasContent } from './export';
import { blankDay } from './types';
import type { AreaId, DayMap } from './types';

const ctx = {
  lang: 'en' as const,
  currency: 'AED',
  columns: en.expCols,
  areaName: (id: AreaId) => en.cat[id],
  areaShort: (id: AreaId) => en.catShort[id],
};

const day = (over: Partial<ReturnType<typeof blankDay>>) => ({ ...blankDay(), ...over });

describe('hasContent', () => {
  it('skips a day the user never touched', () => {
    expect(hasContent(blankDay())).toBe(false);
    expect(hasContent(undefined)).toBe(false);
    expect(hasContent(day({ dayNote: '   ' }))).toBe(false);
  });

  it('keeps a day with anything at all in it', () => {
    expect(hasContent(day({ done: { work: true } }))).toBe(true);
    expect(hasContent(day({ notes: { work: 'x' } }))).toBe(true);
    expect(hasContent(day({ spent: '5' }))).toBe(true);
    expect(hasContent(day({ dayNote: 'hi' }))).toBe(true);
    expect(hasContent(day({ blocks: [{ s: 9, e: 10, c: 'work', t: '' }] }))).toBe(true);
    expect(hasContent(day({ gave: ['sun'] }))).toBe(true);
    expect(hasContent(day({ took: ['rain'] }))).toBe(true);
  });
});

describe('buildExportTable', () => {
  it('writes only the header when there is nothing to export', () => {
    const { text, count } = buildExportTable({ '2026-09-04': blankDay() }, ctx);
    expect(count).toBe(0);
    expect(text.split('\n')).toHaveLength(1);
    expect(text.split('\t')).toHaveLength(20);
  });

  it('puts the chosen currency into the money headers', () => {
    const { text } = buildExportTable({}, { ...ctx, currency: 'GEL' });
    expect(text).toContain('Spent (GEL)');
    expect(text).toContain('Balance (GEL)');
  });

  it('exports one tab-separated row per filled day, oldest first', () => {
    const days: DayMap = {
      '2026-09-05': day({ done: { sport: true } }),
      '2026-09-04': day({ done: { work: true } }),
      '2026-09-03': blankDay(),
    };
    const { text, count } = buildExportTable(days, ctx);
    const rows = text.split('\n').slice(1);

    expect(count).toBe(2);
    expect(rows.map((r) => r.split('\t')[0])).toEqual(['2026-09-04', '2026-09-05']);
  });

  it('fills every column of a full day', () => {
    const days: DayMap = {
      '2026-09-04': day({
        done: { work: true, sport: true },
        notes: { work: 'shipped it' },
        spent: '40',
        saved: '15',
        mood: 4,
        energy: 2,
        dayNote: 'a good day',
        blocks: [
          { s: 9, e: 12.5, c: 'work', t: 'deep work' },
          { s: 18, e: 19, c: 'sport', t: 'run' },
        ],
        gave: ['a walk', 'coffee'],
        took: ['a long meeting'],
      }),
    };
    const [, row] = buildExportTable(days, ctx).text.split('\n');

    expect(row.split('\t')).toEqual([
      '2026-09-04',
      'Friday',
      '29',
      '',
      '',
      '✓',
      '',
      '',
      '✓',
      '',
      '40',
      '15',
      '-25',
      '4',
      '2',
      'Work: shipped it',
      'Work 3.5; Sport 1',
      'a walk; coffee',
      'a long meeting',
      'a good day',
    ]);
  });

  it('flattens tabs and newlines so the columns cannot slip', () => {
    const days: DayMap = { '2026-09-04': day({ dayNote: 'first\nsecond\tthird' }) };
    const [, row] = buildExportTable(days, ctx).text.split('\n');

    expect(row.split('\t')).toHaveLength(20);
    expect(row).toContain('first second third');
  });
});
