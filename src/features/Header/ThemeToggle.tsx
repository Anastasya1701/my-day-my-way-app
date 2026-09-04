import { useAppT } from '../../i18n/useAppT';
import { isDark } from '../../lib/theme';
import { useDayStore } from '../../state/useDayStore';

export function ThemeToggle() {
  const { t } = useAppT();
  const theme = useDayStore((s) => s.theme);
  const setTheme = useDayStore((s) => s.setTheme);
  const dark = isDark(theme);

  return (
    <button className="theme-btn" type="button" aria-label={t('themeAria')} onClick={() => setTheme(dark ? 'light' : 'dark')}>
      <span>{dark ? '☀' : '☾'}</span>
      <span>{dark ? t('themeLight') : t('themeDark')}</span>
    </button>
  );
}
