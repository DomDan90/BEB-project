export interface BookingRequest {
  roomId: number;
  smoobuApartmentId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestInfo: GuestInfo;
  totalPrice: number;
  currency: 'EUR';
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  confirmationCode: string;
}
