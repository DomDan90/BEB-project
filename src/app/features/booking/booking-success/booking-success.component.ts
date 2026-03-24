import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { BookingStore } from '../../../store/booking.store';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { DateItaPipe } from '../../../shared/pipes/date-ita.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, DateItaPipe, BreadcrumbComponent],
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.scss',
})
export class BookingSuccessComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly store = inject(BookingStore);

  readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Prenota', link: '/prenota' },
    { label: 'Successo' },
  ];

  ngOnInit(): void {
    this.seo.updateMeta('Prenotazione ricevuta | B&B', 'Grazie: abbiamo registrato la tua richiesta.');
  }
}
