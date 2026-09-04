import type { ReactNode } from 'react';

/** The small uppercase heading with a hairline rule running to the edge. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label">{children}</div>;
}
