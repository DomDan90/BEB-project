import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
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
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly store = inject(BookingStore);

  readonly crumbs: BreadcrumbItem[] = [
    { label: 'nav.home', link: '/' },
    { label: 'nav.book', link: '/prenota' },
    { label: 'booking.crumbSuccess' },
  ];

  constructor() {
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateSeo());
  }

  ngOnInit(): void {
    this.updateSeo();
  }

  private updateSeo(): void {
    this.translate.get(['seo.successTitle', 'seo.successDesc']).subscribe((t) => {
      this.seo.updateMeta(t['seo.successTitle'], t['seo.successDesc']);
    });
  }
}
