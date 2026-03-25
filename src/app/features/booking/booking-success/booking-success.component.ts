import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
import { pagesSeoConfig } from '../../../core/config/pages-seo.config';
import { BookingStore } from '../../../store/booking.store';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { DateItaPipe } from '../../../shared/pipes/date-ita.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, DateItaPipe, BreadcrumbComponent, TranslatePipe],
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.scss',
})
export class BookingSuccessComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly store = inject(BookingStore);

  readonly crumbs: BreadcrumbItem[] = [
    { label: 'nav.home', link: '/' },
    { label: 'nav.book', link: '/prenota' },
    { label: 'booking.crumbSuccess' },
  ];

  ngOnInit(): void {
    this.seo.updateSeoForPage(pagesSeoConfig['booking.success']);
  }
}
