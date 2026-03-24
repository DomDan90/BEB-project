export interface AvailabilityRequest {
  roomId: number;
  from: string;
  to: string;
}

export interface AvailabilityResponse {
  roomId: number;
  bookedDates: string[];
  pricePerNight: number;
}
