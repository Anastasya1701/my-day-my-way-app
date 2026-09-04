import { SectionLabel } from '../../components/SectionLabel';
import { useAppT } from '../../i18n/useAppT';
import { useCurrentDay, useDayStore } from '../../state/useDayStore';

export function Wellbeing() {
  const { t, list } = useAppT();
  const day = useCurrentDay();
  const setMood = useDayStore((s) => s.setMood);
  const setEnergy = useDayStore((s) => s.setEnergy);

  const mood = day.mood || 3;
  const energy = day.energy || 3;

  return (
    <>
      <SectionLabel>{t('secWellbeing')}</SectionLabel>
      <div className="card">
        <div className="range-row">
          <div className="range-top">
            <span className="rl">{t('mood')}</span>
            <span className="rv">{list('moodWords')[mood]}</span>
          </div>
          <input type="range" className="mood" id="mood" min="1" max="5" step="1" value={mood} onChange={(e) => setMood(Number(e.target.value))} />
          <div className="range-scale">
            <span>{t('moodLow')}</span>
            <span>{t('moodMid')}</span>
            <span>{t('moodHigh')}</span>
          </div>
        </div>
        <div className="range-row">
          <div className="range-top">
            <span className="rl">{t('energy')}</span>
            <span className="rv">{list('energyWords')[energy]}</span>
          </div>
          <input
            type="range"
            className="energy"
            id="energy"
            min="1"
            max="5"
            step="1"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
          />
          <div className="range-scale">
            <span>{t('enLow')}</span>
            <span>{t('enMid')}</span>
            <span>{t('enHigh')}</span>
          </div>
        </div>
      </div>
    </>
  );
}
