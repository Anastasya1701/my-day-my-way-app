import type { AreaId } from './types';

export interface AreaDef {
  id: AreaId;
  color: string;
}

/** Order matters — it drives the card grid, the selects and the export columns. */
export const AREAS: AreaDef[] = [
  { id: 'mental', color: '#A77FC6' },
  { id: 'personal', color: '#DB84A8' },
  { id: 'work', color: '#6C8CC7' },
  { id: 'growth', color: '#7E77CC' },
  { id: 'insta', color: '#E48A79' },
  { id: 'sport', color: '#DFA05C' },
  { id: 'food', color: '#6FA684' },
];

export const AREA_IDS: AreaId[] = AREAS.map((a) => a.id);

export const AREA_COLORS: Record<AreaId, string> = AREAS.reduce(
  (acc, a) => {
    acc[a.id] = a.color;
    return acc;
  },
  {} as Record<AreaId, string>,
);

export function isAreaId(value: unknown): value is AreaId {
  return typeof value === 'string' && (AREA_IDS as string[]).includes(value);
}
