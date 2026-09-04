import { useAppT } from '../../i18n/useAppT';
import { AREAS } from '../../lib/areas';
import { dateOf, isFuture, weekKeys } from '../../lib/date';
import { useDayStore } from '../../state/useDayStore';

export function WeekStrip() {
  const { list } = useAppT();
  const viewDate = useDayStore((s) => s.viewDate);
  const days = useDayStore((s) => s.days);
  const setViewDate = useDayStore((s) => s.setViewDate);
  const labels = list('week');

  return (
    <div className="week">
      {weekKeys(viewDate).map((key, i) => {
        const done = days[key]?.done;
        const pct = done ? Math.round((AREAS.filter((c) => done[c.id]).length / AREAS.length) * 100) : 0;
        const cls = `wday${key === viewDate ? ' sel' : ''}${isFuture(key) ? ' future' : ''}`;
        return (
          <button key={key} className={cls} type="button" onClick={() => setViewDate(key)}>
            <div className="wl">{labels[i]}</div>
            <div className="wn">{dateOf(key).getDate()}</div>
            <div className="wdot">
              <i style={{ width: `${pct}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
