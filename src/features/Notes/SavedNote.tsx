import { useAppT } from '../../i18n/useAppT';
import { useDayStore } from '../../state/useDayStore';

/** "Everything saves automatically in this browser. Last saved: 14:07". */
export function SavedNote() {
  const { t } = useAppT();
  const savedAt = useDayStore((s) => s.savedAt);
  return (
    <p className="saved-note">
      <span>{t('savedNote')}</span> <b>{savedAt}</b>
    </p>
  );
}
