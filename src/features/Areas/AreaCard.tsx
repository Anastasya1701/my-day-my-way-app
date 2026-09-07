import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { useAppT } from '../../i18n/useAppT';
import type { AreaDef } from '../../lib/areas';
import { useCurrentDay, useDayStore } from '../../state/useDayStore';
import { AutoGrowTextarea } from '../../components/AutoGrowTextarea';
import { AREA_ICONS } from './AreaIcons';

/** Space and Enter activate the card, the way a real button would. */
function isActivation(e: KeyboardEvent) {
  return e.key === ' ' || e.key === 'Enter';
}

export function AreaCard({ area }: { area: AreaDef }) {
  const { t, areaName, areaTip } = useAppT();
  const day = useCurrentDay();
  const toggleArea = useDayStore((s) => s.toggleArea);
  const setAreaNote = useDayStore((s) => s.setAreaNote);
  const [tipOpen, setTipOpen] = useState(false);
  const infoRef = useRef<HTMLSpanElement>(null);

  // A tap opens the tip but leaves nothing to close it: touch has no hover to
  // lose, and the glyph keeps focus after the tap. So while a tip is open,
  // any pointer down outside it — or Escape — closes it and drops the focus.
  useEffect(() => {
    if (!tipOpen) return;
    const close = () => {
      setTipOpen(false);
      infoRef.current?.blur();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!infoRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [tipOpen]);

  const on = !!day.done[area.id];
  const name = areaName(area.id);

  return (
    <div className={`cat${on ? ' on' : ''}`} style={{ '--cat': area.color } as CSSProperties}>
      <div
        className="cat-head"
        role="button"
        tabIndex={0}
        aria-pressed={on}
        onClick={() => toggleArea(area.id)}
        onKeyDown={(e) => {
          if (isActivation(e)) {
            e.preventDefault();
            toggleArea(area.id);
          }
        }}
      >
        <span className="cat-ico">
          <svg viewBox="0 0 24 24">{AREA_ICONS[area.id]}</svg>
        </span>
        <span className="cat-title">
          <span className="cat-name">{name}</span>
          <span
            ref={infoRef}
            className={`cat-info${tipOpen ? ' open' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={`${t('infoAria')} ${name}`}
            onClick={(e) => {
              e.stopPropagation();
              setTipOpen((v) => !v);
            }}
            onKeyDown={(e) => {
              if (isActivation(e)) {
                e.preventDefault();
                e.stopPropagation();
                setTipOpen((v) => !v);
              }
            }}
          >
            i
            <span className="cat-tip">
              <b>{name}</b>
              {areaTip(area.id)}
            </span>
          </span>
        </span>
        <span className="check">
          <svg viewBox="0 0 24 24">
            <path d="M4 12l5 5L20 6" />
          </svg>
        </span>
      </div>
      <AutoGrowTextarea
        className="cat-note"
        rows={1}
        placeholder={t('notePh')}
        aria-label={`${name} ${t('noteAria')}`}
        value={day.notes[area.id] ?? ''}
        onChange={(e) => setAreaNote(area.id, e.target.value)}
      />
    </div>
  );
}
