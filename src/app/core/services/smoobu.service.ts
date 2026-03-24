import { Injectable, signal } from '@angular/core';
import { Observable, catchError, delay, finalize, of, throwError } from 'rxjs';
import { BookingConfirmation, BookingRequest } from '../../models/booking.model';
import { AvailabilityResponse } from '../../models/availability.model';
import { MOCK_ROOMS } from '../../mock/rooms.mock';
import { getMockBookedDatesForRoom } from '../../mock/availability.mock';

@Injectable({ providedIn: 'root' })
export class SmoobuService {
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /** Mock: sostituire con chiamate HTTP reali verso SMOOBU_API_BASE */
  getAvailability(apartmentId: number, from: string, to: string): Observable<AvailabilityResponse> {
    void from;
    void to;
    this.isLoading.set(true);
    this.error.set(null);
    const room = MOCK_ROOMS.find((r) => r.smoobuApartmentId === apartmentId);
    const roomId = room?.id ?? 0;
    const response: AvailabilityResponse = {
      roomId,
      bookedDates: getMockBookedDatesForRoom(roomId),
      pricePerNight: room?.pricePerNight ?? 0,
    };
    return of(response).pipe(
      delay(280),
      finalize(() => this.isLoading.set(false)),
      catchError((err: Error) => {
        this.error.set(err.message ?? 'Errore disponibilità');
        return throwError(() => err);
      }),
    );
  }

  createReservation(booking: BookingRequest): Observable<BookingConfirmation> {
    this.isLoading.set(true);
    this.error.set(null);
    const confirmation: BookingConfirmation = {
      bookingId: `MOCK-${Date.now()}`,
      status: 'pending',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      totalPrice: booking.totalPrice,
      confirmationCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
    };
    return of(confirmation).pipe(
      delay(400),
      finalize(() => this.isLoading.set(false)),
      catchError((err: Error) => {
        this.error.set(err.message ?? 'Errore prenotazione');
        return throwError(() => err);
      }),
    );
  }

  getRates(apartmentId: number, from: string, to: string): Observable<{ price: number }[]> {
    const room = MOCK_ROOMS.find((r) => r.smoobuApartmentId === apartmentId);
    const price = room?.pricePerNight ?? 0;
    const start = new Date(from);
    const end = new Date(to);
    const nights = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86_400_000),
    );
    const rates = Array.from({ length: nights }, () => ({ price }));
    return of(rates).pipe(delay(200));

    // Integrazione futura: inject(HttpClient) e GET `${SMOOBU_API_BASE}/...`
  }
}
