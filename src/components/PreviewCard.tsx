import type { ReactNode } from 'react';

interface Props {
  className?: string;
  label: string;
  hidden: boolean;
  onOpen: () => void;
  children: ReactNode;
}

/** The collapsed-state teaser card; click or press Enter/Space to expand. */
export function PreviewCard({ className, label, hidden, onOpen, children }: Props) {
  return (
    <div
      className={`ts-preview${className ? ` ${className}` : ''}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      hidden={hidden}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {children}
    </div>
  );
}
