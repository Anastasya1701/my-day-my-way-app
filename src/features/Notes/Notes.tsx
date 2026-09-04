import { SectionLabel } from '../../components/SectionLabel';
import { useAppT } from '../../i18n/useAppT';
import { useCurrentDay, useDayStore } from '../../state/useDayStore';

export function Notes() {
  const { t } = useAppT();
  const day = useCurrentDay();
  const setDayNote = useDayStore((s) => s.setDayNote);

  return (
    <>
      <SectionLabel>{t('secNotes')}</SectionLabel>
      <div className="card">
        <textarea
          className="daynote"
          id="dayNote"
          placeholder={t('notesPh')}
          value={day.dayNote}
          onChange={(e) => setDayNote(e.target.value)}
        />
      </div>
    </>
  );
}
