import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly minimumStayNights = 2;

  calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }
    const ms = end.getTime() - start.getTime();
    const nights = Math.round(ms / 86_400_000);
    return Math.max(0, nights);
  }

  calculateTotalPrice(checkIn: string, checkOut: string, pricePerNight: number): number {
    return this.calculateNights(checkIn, checkOut) * pricePerNight;
  }

  validateBookingDates(checkIn: string, checkOut: string): boolean {
    if (!checkIn || !checkOut) {
      return false;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return false;
    }
    if (end <= start) {
      return false;
    }
    return this.calculateNights(checkIn, checkOut) >= this.minimumStayNights;
  }

  getMinimumStay(): number {
    return this.minimumStayNights;
  }
}
