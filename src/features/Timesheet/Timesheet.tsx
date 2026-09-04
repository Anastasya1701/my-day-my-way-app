import { CollapseHead } from '../../components/CollapseHead';
import { PreviewCard } from '../../components/PreviewCard';
import { useAppT } from '../../i18n/useAppT';
import { areaTotals, hoursStr } from '../../lib/timesheet';
import { useCurrentDay, useDayStore } from '../../state/useDayStore';
import { BlockForm } from './BlockForm';
import { Timeline } from './Timeline';
import { TimesheetPreview } from './TimesheetPreview';
import { TimesheetSummary } from './TimesheetSummary';

export function Timesheet() {
  const { t, lang } = useAppT();
  const day = useCurrentDay();
  const open = useDayStore((s) => s.tsOpen);
  const setTsOpen = useDayStore((s) => s.setTsOpen);

  const count = day.blocks.length;
  const { total } = areaTotals(day.blocks);
  const meta = count ? `${t('fBlocks', { count })} · ${hoursStr(total, lang)} ${t('hUnit')}` : t('noBlocks');

  return (
    <>
      <CollapseHead title={t('secTimesheet')} meta={meta} open={open} controls="tsBody" onToggle={() => setTsOpen(!open)} />
      <PreviewCard label={t('tsPreviewAria')} hidden={open} onOpen={() => setTsOpen(true)}>
        <TimesheetPreview day={day} />
      </PreviewCard>
      <div className="card ts-body" id="tsBody" hidden={!open}>
        <Timeline day={day} />
        <BlockForm />
        <TimesheetSummary day={day} />
      </div>
    </>
  );
}
