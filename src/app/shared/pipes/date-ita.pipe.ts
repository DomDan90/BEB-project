import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateIta',
  standalone: true,
})
export class DateItaPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (value == null || value === '') {
      return '—';
    }
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) {
      return '—';
    }
    return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(d);
  }
}
