import type { CSSProperties } from 'react';
import { useAppT } from '../../i18n/useAppT';
import { AREA_COLORS } from '../../lib/areas';
import { TS_END, TS_H, TS_START, hm } from '../../lib/timesheet';
import type { DayRecord } from '../../lib/types';
import { useDayStore } from '../../state/useDayStore';

const HOURS = Array.from({ length: TS_END - TS_START }, (_, i) => TS_START + i);

export function Timeline({ day }: { day: DayRecord }) {
  const { t, areaName } = useAppT();
  const removeBlock = useDayStore((s) => s.removeBlock);

  // Keep the original index so deleting hits the right block after sorting.
  const blocks = day.blocks.map((b, index) => ({ b, index })).sort((x, y) => x.b.s - y.b.s);

  return (
    <div className="ts-timeline">
      <div className="ts-times">
        {HOURS.map((h) => (
          <div className="ts-hour" key={h}>{`${h < 10 ? '0' : ''}${h}:00`}</div>
        ))}
      </div>
      <div className="ts-track" style={{ height: (TS_END - TS_START) * TS_H }}>
        {HOURS.map((h) => (
          <div className="ts-grid" key={h} style={{ top: (h - TS_START) * TS_H }} />
        ))}
        {blocks.length === 0 && <div className="ts-empty">{t('tsEmpty')}</div>}
        {blocks.map(({ b, index }) => {
          const sd = Math.max(b.s, TS_START);
          const ed = Math.min(b.e, TS_END);
          return (
            <div
              className="ts-block"
              key={index}
              style={
                {
                  '--c': AREA_COLORS[b.c] ?? 'var(--accent)',
                  top: (sd - TS_START) * TS_H + 2,
                  height: Math.max((ed - sd) * TS_H - 4, 22),
                } as CSSProperties
              }
            >
              <div className="tt">{b.t || areaName(b.c) || ''}</div>
              <div className="th">{`${hm(b.s)}–${hm(b.e)}`}</div>
              <button className="ts-del" type="button" aria-label={t('tsDelAria')} onClick={() => removeBlock(index)}>
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
