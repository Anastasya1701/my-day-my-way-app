import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import { trackerStorage } from '../lib/storage';
import type { Lang } from '../lib/types';

export const LANGS: Lang[] = ['en', 'ru'];

/** English is the default; the header toggle remembers the choice. */
export const DEFAULT_LANG: Lang = 'en';

export function readStoredLang(): Lang {
  const stored = trackerStorage.getPref('lang');
  return stored === 'ru' || stored === 'en' ? stored : DEFAULT_LANG;
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: readStoredLang(),
  fallbackLng: DEFAULT_LANG,
  supportedLngs: LANGS,
  // React already escapes everything it renders.
  interpolation: { escapeValue: false },
});

export default i18n;
