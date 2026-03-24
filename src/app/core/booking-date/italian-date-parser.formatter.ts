import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

@Injectable()
export class ItalianDateParserFormatter extends NgbDateParserFormatter {
  override format(date: NgbDateStruct | null): string {
    if (!date?.year || !date.month || !date.day) {
      return '';
    }
    return `${pad(date.day)}/${pad(date.month)}/${date.year}`;
  }

  override parse(value: string): NgbDateStruct | null {
    if (!value?.trim()) {
      return null;
    }
    const v = value.trim();
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (iso) {
      return { year: +iso[1], month: +iso[2], day: +iso[3] };
    }
    const it = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(v);
    if (it) {
      return { year: +it[3], month: +it[2], day: +it[1] };
    }
    return null;
  }
}
