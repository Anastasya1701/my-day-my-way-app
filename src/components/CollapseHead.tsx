import type { ReactNode } from 'react';

interface Props {
  title: string;
  /** Optional right-aligned summary, e.g. "3 blocks · 5 h". */
  meta?: ReactNode;
  open: boolean;
  controls: string;
  onToggle: () => void;
}

/** The section heading that doubles as a disclosure button. */
export function CollapseHead({ title, meta, open, controls, onToggle }: Props) {
  return (
    <button className="collapse-head" type="button" aria-expanded={open} aria-controls={controls} onClick={onToggle}>
      <span className="ch-title">{title}</span>
      <span className="ch-line" />
      {meta !== undefined && <span className="ch-meta">{meta}</span>}
      <svg className="ch-chev" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
