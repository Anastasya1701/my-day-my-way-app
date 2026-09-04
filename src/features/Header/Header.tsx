import { useAppT } from '../../i18n/useAppT';
import { DateBar } from './DateBar';
import { LangToggle } from './LangToggle';
import { ThemeToggle } from './ThemeToggle';
import { WeekStrip } from './WeekStrip';

export function Header() {
  const { t } = useAppT();
  return (
    <div className="halo">
      <div className="brandrow">
        <div className="brand">{t('brand')}</div>
        <div className="actions">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
      <DateBar />
      <WeekStrip />
    </div>
  );
}
