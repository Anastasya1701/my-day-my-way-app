import { useState } from 'react';
import type { MouseEvent } from 'react';
import { CollapseHead } from '../../components/CollapseHead';
import { PreviewCard } from '../../components/PreviewCard';
import { useAppT } from '../../i18n/useAppT';
import { copyText } from '../../lib/clipboard';
import { FEEDBACK_TO, FEEDBACK_TYPES, buildFeedback } from '../../lib/feedback';
import type { FeedbackType } from '../../lib/feedback';
import { useDayStore } from '../../state/useDayStore';

interface Note {
  text: string;
  tone: 'good' | 'warn';
}

export function Feedback() {
  const { t } = useAppT();
  const open = useDayStore((s) => s.fbOpen);
  const setFbOpen = useDayStore((s) => s.setFbOpen);
  const [type, setType] = useState<FeedbackType>(FEEDBACK_TYPES[0]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState<Note | null>(null);

  const draft = buildFeedback({
    typeLabel: t(`fbTypes.${type}`),
    subjectPrefix: t('fbSubject'),
    replyLabel: t('fbReply'),
    message,
    email,
  });

  const send = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!message.trim()) {
      e.preventDefault();
      setNote({ text: t('fbNeed'), tone: 'warn' });
      return;
    }
    setNote({ text: t('fbOpening'), tone: 'good' });
  };

  const copy = () => {
    const full = `${t('fbTo')} ${FEEDBACK_TO}\n${t('fbSubjLabel')} ${draft.subject}\n\n${draft.body}`;
    setNote({ text: copyText(full) ? t('fbCopied') : t('fbCopyManual'), tone: 'good' });
  };

  return (
    <>
      <CollapseHead title={t('secFeedback')} open={open} controls="fbBody" onToggle={() => setFbOpen(!open)} />
      <PreviewCard className="fb-preview" label={t('fbPreviewAria')} hidden={open} onOpen={() => setFbOpen(true)}>
        <div className="fbp-row">
          <span className="fbp-ico">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <div className="fbp-text">
            <b>{t('fbPrevTitle')}</b>
            <span>{t('fbPrevSub')}</span>
          </div>
          <span className="tsp-cta">
            <span>{t('fbCta')}</span>
            <svg viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </PreviewCard>
      <div className="card fb-body" id="fbBody" hidden={!open}>
        <p className="fb-hint">{t('fbHint')}</p>
        <div className="fb-grid">
          <input
            className="fb-input"
            id="fbEmail"
            type="email"
            placeholder={t('fbEmailPh')}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select className="fb-input" id="fbType" value={type} onChange={(e) => setType(e.target.value as FeedbackType)}>
            {FEEDBACK_TYPES.map((key) => (
              <option key={key} value={key}>
                {t(`fbTypes.${key}`)}
              </option>
            ))}
          </select>
        </div>
        <textarea className="fb-input" id="fbMsg" placeholder={t('fbMsgPh')} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="fb-actions">
          <a className="btn-primary" href={draft.mailto} target="_blank" rel="noopener" onClick={send}>
            {t('fbSend')}
          </a>
          <button className="btn-ghost" type="button" onClick={copy}>
            {t('fbCopy')}
          </button>
        </div>
        <div className="fb-msg" hidden={note === null} style={{ color: note?.tone === 'warn' ? 'var(--accent-ink)' : 'var(--good)' }}>
          {note?.text}
        </div>
      </div>
    </>
  );
}
