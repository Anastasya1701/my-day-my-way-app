import { AREAS } from './areas';
import type { DayRecord } from './types';

export const AREA_COUNT = AREAS.length;

export type SummaryKey = 'none' | 'few' | 'many' | 'all';

export function doneCount(day: Pick<DayRecord, 'done'> | undefined): number {
  if (!day?.done) return 0;
  return AREAS.filter((a) => day.done[a.id]).length;
}

/** The number in the middle of the ring, and the fill of each week-strip bar. */
export function contributionPct(day: Pick<DayRecord, 'done'> | undefined): number {
  return Math.round((doneCount(day) / AREA_COUNT) * 100);
}

/** Which of the four encouragements the day has earned. */
export function summaryKey(done: number, total: number = AREA_COUNT): SummaryKey {
  if (done === 0) return 'none';
  if (done < 3) return 'few';
  if (done < total) return 'many';
  return 'all';
}
