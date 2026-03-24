import { Injectable, computed, inject, signal } from '@angular/core';
import { AvailabilityResponse } from '../models/availability.model';
import { AvailabilityService } from '../core/services/availability.service';
import { finalize, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvailabilityStore {
  private readonly availabilityService = inject(AvailabilityService);

  readonly selectedRoomId = signal<number | null>(null);
  readonly rangeFrom = signal<string>('');
  readonly rangeTo = signal<string>('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly response = signal<AvailabilityResponse | null>(null);

  readonly bookedDates = computed(() => this.response()?.bookedDates ?? []);

  refresh(): void {
    const roomId = this.selectedRoomId();
    const from = this.rangeFrom();
    const to = this.rangeTo();
    if (roomId == null || !from || !to) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.availabilityService
      .getAvailability({ roomId, from, to })
      .pipe(
        tap((res) => this.response.set(res)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        error: (e: Error) => this.error.set(e.message ?? 'Errore caricamento'),
      });
  }
}
