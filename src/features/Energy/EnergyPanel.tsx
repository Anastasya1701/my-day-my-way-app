import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAppT } from '../../i18n/useAppT';
import { useDayStore } from '../../state/useDayStore';
import type { EnergyKind } from '../../state/useDayStore';

interface Props {
  kind: EnergyKind;
  items: string[];
  icon: ReactNode;
}

/** One of the two panels: what gave energy today, and what drained it. */
export function EnergyPanel({ kind, items, icon }: Props) {
  const { t } = useAppT();
  const addEnergyItem = useDayStore((s) => s.addEnergyItem);
  const removeEnergyItem = useDayStore((s) => s.removeEnergyItem);
  const [value, setValue] = useState('');

  return (
    <div className={`epanel ${kind}`}>
      <div className="ep-head">
        <span className="ep-ico">
          <svg viewBox="0 0 24 24">{icon}</svg>
        </span>
        <div>
          <div className="ep-title">{t(`${kind}Title`)}</div>
          <div className="ep-sub">{t(`${kind}Sub`)}</div>
        </div>
      </div>
      <div className="ep-list">
        {items.length === 0 ? (
          <div className="ep-empty">{t(`${kind}Empty`)}</div>
        ) : (
          items.map((text, index) => (
            <div className="ep-item" key={`${index}-${text}`}>
              <span className="ep-mark">{kind === 'gave' ? '+' : '−'}</span>
              <span className="ep-txt">{text}</span>
              <button className="ep-rm" type="button" aria-label={t('rmAria')} onClick={() => removeEnergyItem(kind, index)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
      <form
        className="ep-add"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const text = value.trim();
          if (!text) return;
          addEnergyItem(kind, text);
          setValue('');
        }}
      >
        <input
          type="text"
          maxLength={120}
          placeholder={t(`${kind}Ph`)}
          aria-label={t(`${kind}Aria`)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" aria-label="+">
          +
        </button>
      </form>
    </div>
  );
}
