import { useAppT } from '../../i18n/useAppT';
import { fullDate, isToday, weekdayHeadline } from '../../lib/date';
import { useDayStore } from '../../state/useDayStore';

export function DateBar() {
  const { t, lang } = useAppT();
  const viewDate = useDayStore((s) => s.viewDate);
  const shiftDay = useDayStore((s) => s.shiftDay);
  const goToday = useDayStore((s) => s.goToday);

  return (
    <div className="datebar">
      <button className="nav-btn" type="button" aria-label={t('prevAria')} onClick={() => shiftDay(-1)}>
        <svg viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div className="date-center">
        <div className="date-day">{weekdayHeadline(viewDate, lang)}</div>
        <div className="date-sub">{fullDate(viewDate, lang)}</div>
        <button className="today-btn" type="button" hidden={isToday(viewDate)} onClick={goToday}>
          {t('today')}
        </button>
      </div>
      <button className="nav-btn" type="button" aria-label={t('nextAria')} onClick={() => shiftDay(1)}>
        <svg viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
