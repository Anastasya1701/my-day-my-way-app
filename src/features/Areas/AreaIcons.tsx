import type { ReactNode } from 'react';
import type { AreaId } from '../../lib/types';

/** The seven line icons, ported path-for-path from the MVP. */
export const AREA_ICONS: Record<AreaId, ReactNode> = {
  mental: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  personal: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9h14v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </>
  ),
  growth: (
    <>
      <path d="M4 19V5" />
      <path d="M4 6l8-2v13l-8 2z" />
      <path d="M12 4l8 2v13l-8-2" />
    </>
  ),
  insta: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17" cy="7" r="1" />
    </>
  ),
  sport: (
    <>
      <path d="M6.5 6.5l11 11" />
      <path d="M4 9l2-2 2 2-2 2z" transform="rotate(45 6 8)" />
      <path d="M3 12l3 3M9 6l3 3M12 9l3 3M18 15l3 3" />
    </>
  ),
  food: (
    <>
      <path d="M12 20c5-2 8-6 8-11 0-1-.3-2-.8-2.8C16 6 13 8 12 12 11 8 8 6 4.8 6.2 4.3 7 4 8 4 9c0 5 3 9 8 11z" />
      <path d="M12 12v8" />
    </>
  ),
};
