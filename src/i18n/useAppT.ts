import { useTranslation } from 'react-i18next';
import { DEFAULT_LANG } from '.';
import type { AreaId, Lang } from '../lib/types';

/**
 * Thin wrapper over `useTranslation` with the accessors this app needs:
 * the current language (for locale-aware formatting) and typed readers for
 * the dictionary's arrays and per-area entries.
 */
export function useAppT() {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n.language === 'ru' ? 'ru' : DEFAULT_LANG;

  return {
    t,
    lang,
    /** Reads an array entry (week days, mood words, export columns). */
    list: (key: string): string[] => t(key, { returnObjects: true }) as unknown as string[],
    areaName: (id: AreaId) => t(`cat.${id}`),
    areaShort: (id: AreaId) => t(`catShort.${id}`),
    areaTip: (id: AreaId) => t(`tips.${id}`),
  };
}

export type AppT = ReturnType<typeof useAppT>;
