import { SectionLabel } from '../../components/SectionLabel';
import { useAppT } from '../../i18n/useAppT';
import { useCurrentDay } from '../../state/useDayStore';
import { EnergyPanel } from './EnergyPanel';

const GAVE_ICON = <path d="M13 2L4.5 13.5H11l-1 8L19.5 10H13z" />;
const TOOK_ICON = (
  <>
    <path d="M12 3v10" />
    <path d="M8 9l4 4 4-4" />
    <path d="M5 20h14" />
  </>
);

export function Energy() {
  const { t } = useAppT();
  const day = useCurrentDay();

  return (
    <>
      <SectionLabel>{t('secEnergyDay')}</SectionLabel>
      <div className="energy-grid">
        <EnergyPanel kind="gave" items={day.gave} icon={GAVE_ICON} />
        <EnergyPanel kind="took" items={day.took} icon={TOOK_ICON} />
      </div>
    </>
  );
}
