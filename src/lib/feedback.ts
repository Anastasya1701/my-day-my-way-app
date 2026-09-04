/** Where in-app feedback is sent. Phase 3 replaces this mailto: with an API. */
export const FEEDBACK_TO = 'nastianosevich@gmail.com';

export const FEEDBACK_TYPES = ['feedback', 'idea', 'problem', 'question'] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export interface FeedbackDraft {
  subject: string;
  body: string;
  mailto: string;
}

export function buildFeedback(input: { typeLabel: string; subjectPrefix: string; replyLabel: string; message: string; email: string }): FeedbackDraft {
  const subject = `${input.subjectPrefix} ${input.typeLabel}`;
  const from = input.email.trim();
  const body = input.message.trim() + (from ? `\n\n${input.replyLabel} ${from}` : '');
  return {
    subject,
    body,
    mailto: `mailto:${FEEDBACK_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
