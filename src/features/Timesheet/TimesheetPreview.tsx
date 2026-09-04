import { useAppT } from '../../i18n/useAppT';
import { areaTotals, areasByHours, hoursStr } from '../../lib/timesheet';
import type { DayRecord } from '../../lib/types';

const CX = 39;
const CY = 39;
const R = 30;
const SW = 13;
const C = 2 * Math.PI * R;

/** "Where the time went" — the donut shown while the timesheet is collapsed. */
export function TimesheetPreview({ day }: { day: DayRecord }) {
  const { t, lang, areaShort } = useAppT();
  const { totals, total } = areaTotals(day.blocks);
  const areas = areasByHours(totals);

  let acc = 0;
  const segments = areas.map((c) => {
    const len = ((totals[c.id] ?? 0) / total) * C;
    const gap = areas.length > 1 ? 1.5 : 0;
    const dash = Math.max(len - gap, 0.1);
    const segment = { id: c.id, color: c.color, dash, offset: -acc };
    acc += len;
    return segment;
  });

  return (
    <>
      <div className="tsp-donut">
        <div className="tsp-svg">
          <svg viewBox="0 0 78 78">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth={SW} />
            {total > 0 &&
              segments.map((s) => (
                <circle
                  key={s.id}
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={SW}
                  strokeLinecap="round"
                  strokeDasharray={`${s.dash} ${C - s.dash}`}
                  strokeDashoffset={s.offset}
                  transform={`rotate(-90 ${CX} ${CY})`}
                />
              ))}
          </svg>
        </div>
        <div className="tsp-center">
          <b>{total > 0 ? hoursStr(total, lang) : '0'}</b>
          <span>{t('hoursLbl')}</span>
        </div>
      </div>
      <div className="tsp-legend">
        {total === 0 ? (
          <div className="tsp-empty-txt">
            <b>{t('planEmptyTitle')}</b>
            <br />
            {t('planEmptySub')}
          </div>
        ) : (
          <>
            {areas.slice(0, 3).map((c) => (
              <div className="tsp-leg-row" key={c.id}>
                <span className="d" style={{ background: c.color }} />
                <span className="n">{areaShort(c.id)}</span>
                <span className="h">{`${hoursStr(totals[c.id] ?? 0, lang)} ${t('hUnit')} · ${Math.round(((totals[c.id] ?? 0) / total) * 100)}%`}</span>
              </div>
            ))}
            {areas.length > 3 && <div className="tsp-more">{t('moreAreas', { count: areas.length - 3 })}</div>}
          </>
        )}
      </div>
      <span className="tsp-cta">
        <span>{t('expand')}</span>
        <svg viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </>
  );
}
