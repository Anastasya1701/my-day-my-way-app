import { setLanguage } from '../../i18n';
import { useAppT } from '../../i18n/useAppT';

export function LangToggle() {
  const { t, lang } = useAppT();
  return (
    <button className="theme-btn" type="button" aria-label={t('langAria')} onClick={() => setLanguage(lang === 'ru' ? 'en' : 'ru')}>
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" />
      </svg>
      <span>{t('langNext')}</span>
    </button>
  );
}
