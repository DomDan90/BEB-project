import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

export function todayNgbStruct(): NgbDateStruct {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate() };
}

/** Primo giorno ammesso per il check-out: check-in + `nights` (es. 2 notti → +2 giorni). */
export function minCheckoutStructFromCheckInIso(
  checkInIso: string | null | undefined,
  minNights: number,
): NgbDateStruct {
  if (!checkInIso || !/^\d{4}-\d{2}-\d{2}$/.test(checkInIso)) {
    return todayNgbStruct();
  }
  const [y, m, d] = checkInIso.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0, 0);
  dt.setDate(dt.getDate() + minNights);
  return { year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() };
}
