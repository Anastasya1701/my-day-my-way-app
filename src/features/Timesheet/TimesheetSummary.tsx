import { useAppT } from '../../i18n/useAppT';
import { areaTotals, areasWithHours, hoursStr } from '../../lib/timesheet';
import type { DayRecord } from '../../lib/types';

export function TimesheetSummary({ day }: { day: DayRecord }) {
  const { t, lang, areaShort } = useAppT();
  const { totals, total } = areaTotals(day.blocks);
  const rows = areasWithHours(totals);
  const max = Math.max(0, ...rows.map((c) => totals[c.id] ?? 0));
  const fmtH = (x: number) => `${hoursStr(x, lang)} ${t('hUnit')}`;

  return (
    <div className="ts-summary">
      {rows.map((c) => (
        <div className="ts-bar" key={c.id}>
          <div className="bn">
            <span className="bdot" style={{ background: c.color }} />
            {areaShort(c.id)}
          </div>
          <div className="bm">
            <i style={{ width: `${((totals[c.id] ?? 0) / max) * 100}%`, background: c.color }} />
          </div>
          <div className="bh">{fmtH(totals[c.id] ?? 0)}</div>
        </div>
      ))}
      {total > 0 && <div className="ts-total">{`${t('tsTotal')} ${fmtH(total)}`}</div>}
    </div>
  );
}
