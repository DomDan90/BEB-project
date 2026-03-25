import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
import { SmoobuService } from '../../../core/services/smoobu.service';
import { BookingStore } from '../../../store/booking.store';
import { BookingRequest } from '../../../models/booking.model';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { DateItaPipe } from '../../../shared/pipes/date-ita.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { pagesSeoConfig } from '../../../core/config/pages-seo.config';
import { BnbConfigService } from '../../../core/services/bnb-config.service';

@Component({
  selector: 'app-booking-confirm',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, DateItaPipe, BreadcrumbComponent, TranslatePipe],
  templateUrl: './booking-confirm.component.html',
  styleUrl: './booking-confirm.component.scss',
})
export class BookingConfirmComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly smoobu = inject(SmoobuService);
  private readonly bnb = inject(BnbConfigService);
  readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  readonly crumbs: BreadcrumbItem[] = [
    { label: 'nav.home', link: '/' },
    { label: 'nav.book', link: '/prenota' },
    { label: 'booking.crumbConfirm' },
  ];

  submitting = false;

  ngOnInit(): void {
    this.seo.updateSeoForPage(pagesSeoConfig['booking.confirm']);
  }

  confirm(): void {
    const room = this.store.selectedRoom();
    if (!room?.smoobuApartmentId) {
      return;
    }
    const req: BookingRequest = {
      roomId: room.id,
      smoobuApartmentId: room.smoobuApartmentId,
      checkIn: this.store.checkIn(),
      checkOut: this.store.checkOut(),
      guests: this.store.guests(),
      guestInfo: {
        firstName: 'Ospite',
        lastName: 'Demo',
        email: 'ospite@example.com',
        phone: '+390000000000',
      },
      totalPrice: this.store.totalPrice(),
      currency: this.bnb.booking.currency,
    };
    this.submitting = true;
    this.smoobu.createReservation(req).subscribe({
      next: (c) => {
        this.store.setLastConfirmation(c);
        void this.router.navigate(['/prenota/successo']);
      },
      error: () => {
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
