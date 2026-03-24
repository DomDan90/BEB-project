/** Date ISO (YYYY-MM-DD) non disponibili per camera — generate a runtime per mese corrente e successivo. */

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Offset fissi per variare le date occupate in base all'id camera */
const OFFSETS: Record<number, readonly number[]> = {
  1: [3, 7, 14, 21, 25],
  2: [2, 10, 18, 22, 28],
  3: [5, 12, 19, 26],
  4: [4, 8, 15, 23, 29],
};

function buildMonthBooked(year: number, month: number, dayOffsets: readonly number[]): string[] {
  const max = daysInMonth(year, month);
  return dayOffsets.filter((d) => d <= max).map((d) => toIso(year, month, d));
}

export function getMockBookedDatesForRoom(roomId: number, ref = new Date()): string[] {
  const y = ref.getFullYear();
  const m = ref.getMonth() + 1;
  const nextM = m === 12 ? 1 : m + 1;
  const nextY = m === 12 ? y + 1 : y;
  const offsets = OFFSETS[roomId] ?? [5, 12, 20];
  return [
    ...buildMonthBooked(y, m, offsets),
    ...buildMonthBooked(nextY, nextM, offsets.map((d) => Math.min(d + 1, 28))),
  ];
}
