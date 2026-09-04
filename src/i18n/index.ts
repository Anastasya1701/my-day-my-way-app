import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import { getStorage } from '../lib/storage';
import type { Lang } from '../lib/types';

export const LANGS: Lang[] = ['en', 'ru'];

/** English is the default; the header toggle remembers the choice. */
export const DEFAULT_LANG: Lang = 'en';

export function readStoredLang(): Lang {
  const stored = getStorage().getPref('lang');
  return stored === 'ru' || stored === 'en' ? stored : DEFAULT_LANG;
}

/**
 * `/en` and `/ru` pin the language, so a shared link always opens in the
 * language it was shared in. Anything else (including `/`) means "no opinion".
 */
export function langFromPath(pathname: string): Lang | null {
  const match = /^\/(en|ru)\/?$/.exec(pathname);
  return match ? (match[1] as Lang) : null;
}

/** The path wins over the remembered choice — an explicit link is explicit. */
export function readInitialLang(pathname = location.pathname): Lang {
  return langFromPath(pathname) ?? readStoredLang();
}

const initialLang = readInitialLang();
// A language reached by link becomes the remembered one too.
getStorage().setPref('lang', initialLang);

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: initialLang,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: LANGS,
  // React already escapes everything it renders.
  interpolation: { escapeValue: false },
});

export default i18n;

/** Keeps the address bar shareable: the path always names the language shown. */
function syncPath(lang: Lang) {
  if (typeof history === 'undefined' || location.pathname === `/${lang}`) return;
  history.replaceState(null, '', `/${lang}${location.search}${location.hash}`);
}

/** Switches the language, remembers the choice and updates the URL. */
export function setLanguage(lang: Lang) {
  getStorage().setPref('lang', lang);
  void i18n.changeLanguage(lang);
  syncPath(lang);
}
