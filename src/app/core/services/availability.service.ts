import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AvailabilityRequest, AvailabilityResponse } from '../../models/availability.model';
import { getRoomById } from '../../mock/rooms.mock';
import { SmoobuService } from './smoobu.service';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private readonly smoobu = inject(SmoobuService);

  getAvailability(request: AvailabilityRequest): Observable<AvailabilityResponse> {
    const room = getRoomById(request.roomId);
    const apartmentId = room?.smoobuApartmentId ?? request.roomId;
    return this.smoobu.getAvailability(apartmentId, request.from, request.to).pipe(
      map((res) => ({
        ...res,
        roomId: request.roomId,
        pricePerNight: room?.pricePerNight ?? res.pricePerNight,
      })),
    );
  }
}
