import { useRef, useState } from 'react';
import { SectionLabel } from '../../components/SectionLabel';
import { useAppT } from '../../i18n/useAppT';
import { copyFromTextarea } from '../../lib/clipboard';
import { buildExportTable } from '../../lib/export';
import { useDayStore } from '../../state/useDayStore';

export function Export() {
  const { t, lang, list, areaName, areaShort } = useAppT();
  const days = useDayStore((s) => s.days);
  const currency = useDayStore((s) => s.currency);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const [table, setTable] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const build = () => {
    const { text, count } = buildExportTable(days, {
      lang,
      currency,
      columns: list('expCols'),
      areaName,
      areaShort,
    });
    setTable(text);
    setMessage(count ? t('expReady', { count }) : t('expEmpty'));
  };

  const copy = () => {
    const box = boxRef.current;
    if (!box) return;
    setMessage(copyFromTextarea(box) ? t('expCopied') : t('expCopyManual'));
  };

  return (
    <>
      <SectionLabel>{t('secExport')}</SectionLabel>
      <div className="card">
        <p className="exp-hint">{t('expHint')}</p>
        <div className="exp-actions">
          <button className="btn-primary" type="button" onClick={build}>
            {t('expBuild')}
          </button>
          <button className="btn-ghost" type="button" hidden={table === null} onClick={copy}>
            {t('expCopy')}
          </button>
        </div>
        <textarea
          className="export-box"
          ref={boxRef}
          readOnly
          hidden={table === null}
          aria-label={t('expBoxAria')}
          value={table ?? ''}
        />
        <div className="exp-msg" hidden={message === null}>
          {message}
        </div>
      </div>
    </>
  );
}
