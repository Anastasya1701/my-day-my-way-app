import { useEffect } from 'react';
import { SectionLabel } from './components/SectionLabel';
import { Areas } from './features/Areas/Areas';
import { Energy } from './features/Energy/Energy';
import { Header } from './features/Header/Header';
import { Money } from './features/Money/Money';
import { Notes } from './features/Notes/Notes';
import { Timesheet } from './features/Timesheet/Timesheet';
import { Wellbeing } from './features/Wellbeing/Wellbeing';
import { DaySummary } from './features/Summary/DaySummary';
import { useAppT } from './i18n/useAppT';
import { useDayStore } from './state/useDayStore';

export default function App() {
  const { t, lang } = useAppT();
  const theme = useDayStore((s) => s.theme);
  const bootstrap = useDayStore((s) => s.bootstrap);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.title = t('brand');
  }, [lang, t]);

  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Stamp "last saved" on load, as the MVP did.
  useEffect(bootstrap, [bootstrap]);

  return (
    <div className="wrap">
      <Header />
      <DaySummary />

      <SectionLabel>{t('secSpheres')}</SectionLabel>
      <Areas />

      <Timesheet />

      <Money />
      <Wellbeing />
      <Energy />
      <Notes />
    </div>
  );
}
