import { SectionLabel } from '../../components/SectionLabel';
import { useAppT } from '../../i18n/useAppT';
import { CURRENCIES } from '../../lib/currency';
import { monthOf } from '../../lib/date';
import { formatMoney, formatMoneySigned, toAmount } from '../../lib/money';
import { useCurrentDay, useDayStore } from '../../state/useDayStore';

export function Money() {
  const { t, lang } = useAppT();
  const day = useCurrentDay();
  const days = useDayStore((s) => s.days);
  const viewDate = useDayStore((s) => s.viewDate);
  const currency = useDayStore((s) => s.currency);
  const setCurrency = useDayStore((s) => s.setCurrency);
  const setSpent = useDayStore((s) => s.setSpent);
  const setSaved = useDayStore((s) => s.setSaved);

  const balance = toAmount(day.saved) - toAmount(day.spent);
  const month = monthOf(viewDate);
  const totals = Object.keys(days).reduce(
    (acc, key) => {
      if (monthOf(key) === month) {
        acc.spent += toAmount(days[key].spent);
        acc.saved += toAmount(days[key].saved);
      }
      return acc;
    },
    { spent: 0, saved: 0 },
  );

  // A currency stored before it left the list must stay selectable.
  const options: string[] = CURRENCIES.includes(currency as (typeof CURRENCIES)[number]) ? [...CURRENCIES] : [...CURRENCIES, currency];

  return (
    <>
      <SectionLabel>
        <span>{t('secFinance')}</span>
        {'\u00a0'}
        <span>{currency}</span>
      </SectionLabel>
      <div className="card">
        <div className="cur-row">
          <label htmlFor="curSel">{t('currency')}</label>
          <select className="cur-sel" id="curSel" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {options.map((code) => (
              <option key={code} value={code}>
                {CURRENCIES.includes(code as (typeof CURRENCIES)[number]) ? `${code} · ${t(`curNames.${code}`)}` : code}
              </option>
            ))}
          </select>
          <span className="cur-note">{t('curNote')}</span>
        </div>
        <div className="fin-grid">
          <div className="fin-field">
            <label htmlFor="spent">{t('finSpent')}</label>
            <div className="money spent">
              <span className="cur">{currency}</span>
              <input
                id="spent"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="0"
                value={day.spent}
                onChange={(e) => setSpent(e.target.value)}
              />
            </div>
          </div>
          <div className="fin-field">
            <label htmlFor="saved">{t('finSaved')}</label>
            <div className="money saved">
              <span className="cur">{currency}</span>
              <input
                id="saved"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="0"
                value={day.saved}
                onChange={(e) => setSaved(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="fin-summary">
          <div className="chip balance">
            <div className="k">{t('finBalance')}</div>
            <div className={`v ${balance >= 0 ? 'pos' : 'neg'}`}>{formatMoneySigned(balance, currency, lang)}</div>
          </div>
          <div className="chip gold">
            <div className="k">{t('finMonthSaved')}</div>
            <div className="v">{formatMoney(totals.saved, currency, lang)}</div>
          </div>
          <div className="chip">
            <div className="k">{t('finMonthSpent')}</div>
            <div className="v">{formatMoney(totals.spent, currency, lang)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
