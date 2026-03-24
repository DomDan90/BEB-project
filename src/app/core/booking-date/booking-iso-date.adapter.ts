import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Injectable()
export class BookingIsoStringDateAdapter extends NgbDateAdapter<string | null> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }
    const [y, m, d] = value.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (!date?.year || !date.month || !date.day) {
      return null;
    }
    const rolled = new Date(date.year, date.month - 1, date.day);
    if (
      rolled.getFullYear() !== date.year ||
      rolled.getMonth() !== date.month - 1 ||
      rolled.getDate() !== date.day
    ) {
      return null;
    }
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }
}
