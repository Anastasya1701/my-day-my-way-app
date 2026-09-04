import { describe, expect, it } from 'vitest';
import { decimalSeparator, formatMoney, formatMoneySigned, toAmount } from './money';

describe('toAmount', () => {
  it('reads the money inputs leniently', () => {
    expect(toAmount('12.5')).toBe(12.5);
    expect(toAmount('')).toBe(0);
    expect(toAmount(undefined)).toBe(0);
    expect(toAmount('abc')).toBe(0);
  });
});

describe('formatMoney', () => {
  it('groups thousands per locale and keeps the currency in front', () => {
    expect(formatMoney(1234.6, 'AED', 'en')).toBe('AED 1,235');
    // ru-RU groups thousands with a non-breaking space
    expect(formatMoney(1234.6, 'RUB', 'ru')).toBe('RUB 1\u00a0235');
  });

  it('rounds to whole units', () => {
    expect(formatMoney(0.4, 'USD', 'en')).toBe('USD 0');
    expect(formatMoney(99.5, 'USD', 'en')).toBe('USD 100');
  });
});

describe('formatMoneySigned', () => {
  it('uses a true minus sign before the currency for a negative balance', () => {
    expect(formatMoneySigned(-40, 'EUR', 'en')).toBe('− EUR 40');
  });

  it('leaves a positive or zero balance unsigned', () => {
    expect(formatMoneySigned(40, 'EUR', 'en')).toBe('EUR 40');
    expect(formatMoneySigned(0, 'EUR', 'en')).toBe('EUR 0');
  });
});

describe('decimalSeparator', () => {
  it('follows the language', () => {
    expect(decimalSeparator('en')).toBe('.');
    expect(decimalSeparator('ru')).toBe(',');
  });
});
