import { useState } from 'react';
import { useAppT } from '../../i18n/useAppT';
import { AREAS } from '../../lib/areas';
import { parseTime } from '../../lib/timesheet';
import type { AreaId } from '../../lib/types';
import { useDayStore } from '../../state/useDayStore';

export function BlockForm() {
  const { t, areaName } = useAppT();
  const addBlock = useDayStore((s) => s.addBlock);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [area, setArea] = useState<AreaId>(AREAS[0].id);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const s = parseTime(start);
    const e = parseTime(end);
    if (s == null || e == null) {
      setError(t('tsErrNeed'));
      return;
    }
    if (e <= s) {
      setError(t('tsErrOrder'));
      return;
    }
    setError(null);
    addBlock({ s, e, c: area, t: text.trim() });
    setText('');
  };

  return (
    <>
      <div className="ts-form">
        <div className="f">
          <label htmlFor="tsStart">{t('tsStart')}</label>
          <input type="time" id="tsStart" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="tsEnd">{t('tsEnd')}</label>
          <input type="time" id="tsEnd" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className="f">
          <label htmlFor="tsCat">{t('tsArea')}</label>
          <select id="tsCat" value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
            {AREAS.map((c) => (
              <option key={c.id} value={c.id}>
                {areaName(c.id)}
              </option>
            ))}
          </select>
        </div>
        <div className="f f-label">
          <label htmlFor="tsText">{t('tsWhat')}</label>
          <input type="text" id="tsText" placeholder={t('tsWhatPh')} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button className="ts-add" type="button" onClick={submit}>
          {t('tsAddBtn')}
        </button>
      </div>
      <div className="ts-err" hidden={!error}>
        {error}
      </div>
    </>
  );
}
