import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyEur',
  standalone: true,
})
export class CurrencyEurPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) {
      return '—';
    }
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
