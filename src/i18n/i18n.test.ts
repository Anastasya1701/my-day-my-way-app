import { describe, expect, it } from 'vitest';
import i18n, { langFromPath, readInitialLang } from '.';
import en from './en.json';
import ru from './ru.json';

const t = { en: i18n.getFixedT('en'), ru: i18n.getFixedT('ru') };
const baseKeys = (o: object) => new Set(Object.keys(o).map((k) => k.replace(/_(one|few|many|other)$/, '')));

describe('resources', () => {
  it('defaults to English', () => {
    expect(i18n.options.fallbackLng).toEqual(['en']);
    expect(t.en('brand')).toBe('My Day, My Way');
    expect(t.ru('brand')).toBe('Дневник вклада');
  });

  it('covers the same keys in both languages', () => {
    expect([...baseKeys(ru)].sort()).toEqual([...baseKeys(en)].sort());
  });

  it('has a name, a short name and a tip for all seven areas', () => {
    const ids = Object.keys(en.cat);
    expect(ids).toHaveLength(7);
    ids.forEach((id) => {
      (['en', 'ru'] as const).forEach((lang) => {
        expect(t[lang](`cat.${id}`)).toBeTruthy();
        expect(t[lang](`catShort.${id}`)).toBeTruthy();
        expect(t[lang](`tips.${id}`)).toBeTruthy();
      });
    });
  });

  it('keeps the arrays the UI indexes into the right length', () => {
    (['en', 'ru'] as const).forEach((lang) => {
      expect(t[lang]('week', { returnObjects: true })).toHaveLength(7);
      // index 0 is unused: the sliders run 1..5
      expect(t[lang]('moodWords', { returnObjects: true })).toHaveLength(6);
      expect(t[lang]('energyWords', { returnObjects: true })).toHaveLength(6);
      expect(t[lang]('expCols', { returnObjects: true })).toHaveLength(20);
    });
  });
});

describe('plurals', () => {
  it('uses the three Russian forms for blocks', () => {
    expect(t.ru('fBlocks', { count: 1 })).toBe('1 блок');
    expect(t.ru('fBlocks', { count: 2 })).toBe('2 блока');
    expect(t.ru('fBlocks', { count: 5 })).toBe('5 блоков');
    expect(t.ru('fBlocks', { count: 11 })).toBe('11 блоков');
    expect(t.ru('fBlocks', { count: 21 })).toBe('21 блок');
  });

  it('uses the three Russian forms for exported days', () => {
    expect(t.ru('expReady', { count: 1 })).toContain('1 день');
    expect(t.ru('expReady', { count: 3 })).toContain('3 дня');
    expect(t.ru('expReady', { count: 14 })).toContain('14 дней');
  });

  it('declines the leftover areas in the donut legend', () => {
    expect(t.ru('moreAreas', { count: 1 })).toBe('и ещё 1 сфера');
    expect(t.ru('moreAreas', { count: 2 })).toBe('и ещё 2 сферы');
    expect(t.ru('moreAreas', { count: 5 })).toBe('и ещё 5 сфер');
  });

  it('uses singular and plural in English', () => {
    expect(t.en('fBlocks', { count: 1 })).toBe('1 block');
    expect(t.en('fBlocks', { count: 4 })).toBe('4 blocks');
    expect(t.en('expReady', { count: 1 })).toContain('1 day.');
    expect(t.en('expReady', { count: 2 })).toContain('2 days.');
    expect(t.en('moreAreas', { count: 2 })).toBe('+2 more');
  });
});

describe('day summary', () => {
  it('interpolates the marked and total areas', () => {
    expect(t.en('summary.few.sub', { done: 2, total: 7 })).toBe('2 of 7 areas marked — keep going.');
    expect(t.ru('summary.many.sub', { done: 5, total: 7 })).toBe('5 из 7 сфер. Ты молодец.');
    expect(t.ru('summary.all.sub', { total: 7 })).toBe('Все 7 сфер закрыты. Гордись собой.');
  });
});

describe('language from the URL', () => {
  it('reads /en and /ru, with or without a trailing slash', () => {
    expect(langFromPath('/en')).toBe('en');
    expect(langFromPath('/ru')).toBe('ru');
    expect(langFromPath('/ru/')).toBe('ru');
  });

  it('has no opinion about any other path', () => {
    expect(langFromPath('/')).toBeNull();
    expect(langFromPath('/de')).toBeNull();
    expect(langFromPath('/ru/extra')).toBeNull();
    expect(langFromPath('/legacy/index.html')).toBeNull();
  });

  it('lets the path win over the remembered choice', () => {
    localStorage.setItem('tracker_lang', 'en');
    expect(readInitialLang('/ru')).toBe('ru');
  });

  it('falls back to the remembered choice, then to English', () => {
    localStorage.setItem('tracker_lang', 'ru');
    expect(readInitialLang('/')).toBe('ru');
    localStorage.removeItem('tracker_lang');
    expect(readInitialLang('/')).toBe('en');
  });
});
