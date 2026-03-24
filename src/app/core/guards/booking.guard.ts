import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingStore } from '../../store/booking.store';

/** Richiede date e camera selezionata per la pagina di conferma. */
export const bookingConfirmGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);
  const room = store.selectedRoom();
  if (!room || !store.checkIn() || !store.checkOut()) {
    return router.createUrlTree(['/prenota']);
  }
  return true;
};

/** Richiede una conferma salvata nello store (dopo submit mock). */
export const bookingSuccessGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);
  if (!store.lastConfirmation()) {
    return router.createUrlTree(['/prenota']);
  }
  return true;
};
