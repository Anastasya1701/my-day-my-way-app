import { useAppT } from '../../i18n/useAppT';
import { AREA_COUNT, doneCount, summaryKey } from '../../lib/contribution';
import { useCurrentDay } from '../../state/useDayStore';

const RING_CIRCUMFERENCE = 2 * Math.PI * 50;

export function DaySummary() {
  const { t } = useAppT();
  const day = useCurrentDay();
  const total = AREA_COUNT;
  const done = doneCount(day);
  const pct = Math.round((done / total) * 100);
  const key = summaryKey(done, total);

  return (
    <div className="summary">
      <div className="ring">
        <svg width="118" height="118" viewBox="0 0 118 118">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--gold)" />
            </linearGradient>
          </defs>
          <circle className="track" cx="59" cy="59" r="50" fill="none" strokeWidth="11" />
          <circle
            className="fill"
            cx="59"
            cy="59"
            r="50"
            fill="none"
            strokeWidth="11"
            strokeDasharray="314.16"
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - pct / 100)}
          />
        </svg>
        <div className="center">
          <div className="pct">{pct}%</div>
          <div className="pl">{t('ringLabel')}</div>
        </div>
      </div>
      <div className="summ-text">
        <h1>{t(`summary.${key}.title`)}</h1>
        <p>{t(`summary.${key}.sub`, { done, total })}</p>
      </div>
    </div>
  );
}
