import { localeOf } from './date';
import type { Lang } from './types';

/** `parseFloat(v) || 0` — the MVP's lenient reading of the money inputs. */
export function toAmount(value: string | number | undefined | null): number {
  return parseFloat(String(value ?? '')) || 0;
}

export function formatMoney(n: number, currency: string, lang: Lang): string {
  return `${currency} ${Math.round(n).toLocaleString(localeOf(lang))}`;
}

/** Balance formatting: a true minus sign and a space, then the absolute value. */
export function formatMoneySigned(n: number, currency: string, lang: Lang): string {
  return `${n < 0 ? '− ' : ''}${currency} ${Math.abs(Math.round(n)).toLocaleString(localeOf(lang))}`;
}

export function decimalSeparator(lang: Lang): string {
  return lang === 'ru' ? ',' : '.';
}
