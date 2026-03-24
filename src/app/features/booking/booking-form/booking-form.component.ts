import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../core/services/seo.service';
import { BookingService } from '../../../core/services/booking.service';
import { BookingStore } from '../../../store/booking.store';
import { MOCK_ROOMS } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyEurPipe, BreadcrumbComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss',
})
export class BookingFormComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly store = inject(BookingStore);
  private readonly bookingService = inject(BookingService);

  readonly rooms = MOCK_ROOMS;
  readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Prenota' },
  ];

  readonly minStay = this.bookingService.getMinimumStay();
  dateError = false;

  ngOnInit(): void {
    this.seo.updateMeta('Prenota | B&B', 'Prenotazione diretta: scegli le date e la camera.');
  }

  onRoomChange(roomId: string): void {
    if (!roomId) {
      this.store.selectedRoom.set(null);
      return;
    }
    const id = Number(roomId);
    const room = MOCK_ROOMS.find((r) => r.id === id) ?? null;
    this.store.selectedRoom.set(room);
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
