import { Injectable, computed, inject, signal } from '@angular/core';
import { Room } from '../models/room.model';
import { BookingConfirmation } from '../models/booking.model';
import { BookingService } from '../core/services/booking.service';

@Injectable({ providedIn: 'root' })
export class BookingStore {
  private readonly bookingService = inject(BookingService);

  readonly selectedRoom = signal<Room | null>(null);
  readonly checkIn = signal<string>('');
  readonly checkOut = signal<string>('');
  readonly guests = signal<number>(1);
  readonly bookingStep = signal<1 | 2 | 3>(1);
  readonly lastConfirmation = signal<BookingConfirmation | null>(null);

  readonly totalNights = computed(() =>
    this.bookingService.calculateNights(this.checkIn(), this.checkOut()),
  );

  readonly totalPrice = computed(() => {
    const room = this.selectedRoom();
    if (!room) {
      return 0;
    }
    return this.bookingService.calculateTotalPrice(
      this.checkIn(),
      this.checkOut(),
      room.pricePerNight,
    );
  });

  setLastConfirmation(c: BookingConfirmation | null): void {
    this.lastConfirmation.set(c);
  }

  resetFlow(): void {
    this.bookingStep.set(1);
    this.lastConfirmation.set(null);
  }
}
