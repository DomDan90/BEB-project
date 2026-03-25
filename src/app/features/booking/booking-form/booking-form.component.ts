import { formatNumber } from '@angular/common';
import { Component, effect, inject, LOCALE_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { minCheckoutStructFromCheckInIso, todayNgbStruct } from '../../../core/booking-date/booking-date-struct.util';
import { ngbPopperMatchReferenceWidth } from '../../../core/booking-date/ngb-popper-match-reference';
import { SeoService } from '../../../core/services/seo.service';
import { BookingService } from '../../../core/services/booking.service';
import { BookingStore } from '../../../store/booking.store';
import { MOCK_ROOMS } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { pagesSeoConfig } from '../../../core/config/pages-seo.config';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    CurrencyEurPipe,
    BreadcrumbComponent,
    TranslatePipe,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly locale = inject(LOCALE_ID);
  private readonly translate = inject(TranslateService);
  readonly store = inject(BookingStore);
  private readonly bookingService = inject(BookingService);

  readonly rooms = MOCK_ROOMS;
  readonly crumbs: BreadcrumbItem[] = [
    { label: 'nav.home', link: '/' },
    { label: 'nav.book' },
  ];

  readonly minStay = this.bookingService.getMinimumStay();
  readonly todayStruct: NgbDateStruct = todayNgbStruct();
  readonly popperMatchReferenceWidth = ngbPopperMatchReferenceWidth;
  dateError = false;

  constructor() {
    effect(() => {
      const ci = this.store.checkIn();
      const co = this.store.checkOut();
      if (!co) {
        return;
      }
      if (!ci || !this.bookingService.validateBookingDates(ci, co)) {
        this.store.checkOut.set('');
      }
    });

  }

  ngOnInit(): void {
    this.seo.updateSeoForPage(pagesSeoConfig['booking.form']);
  }

  minCheckOutDate(): NgbDateStruct {
    return minCheckoutStructFromCheckInIso(this.store.checkIn(), this.minStay);
  }

  roomToggleLabel(): string {
    const r = this.store.selectedRoom();
    if (!r) {
      return this.translate.instant('common.select');
    }
    const p = formatNumber(r.pricePerNight, this.locale, '1.0-0');
    return this.translate.instant('booking.roomLine', {
      name: this.translate.instant(r.name),
      price: p,
    });
  }

  selectRoom(roomId: number): void {
    const room = MOCK_ROOMS.find((r) => r.id === roomId) ?? null;
    this.store.selectedRoom.set(room);
  }

  clearRoom(): void {
    this.store.selectedRoom.set(null);
  }

  validateAndFlag(): void {
    const checkIn = this.store.checkIn();
    const checkOut = this.store.checkOut();
    if (!checkIn || !checkOut) {
      this.dateError = false;
      return;
    }
    this.dateError = !this.bookingService.validateBookingDates(checkIn, checkOut);
  }
}
