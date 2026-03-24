import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOCK_ROOMS } from '../../../../mock/rooms.mock';
import type { Room } from '../../../../models/room.model';

const AMENITY_ICONS: Record<string, string> = {
  'Wi‑Fi': 'bi-wifi',
  'Wi-Fi': 'bi-wifi',
  TV: 'bi-tv',
  'Smart TV': 'bi-tv',
  'Aria condizionata': 'bi-snow',
  'Bagno privato': 'bi-droplet',
  'Colazione inclusa': 'bi-cup-hot',
  Minifrigo: 'bi-box-seam',
  Balcone: 'bi-door-open',
  'Zona living': 'bi-house-door',
  Cassaforte: 'bi-shield-lock',
  Frigorifero: 'bi-box-seam',
  'Angolo tè': 'bi-cup',
};

@Component({
  selector: 'app-rooms-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rooms-preview.component.html',
  styleUrl: './rooms-preview.component.scss',
})
export class RoomsPreviewComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly rooms: Room[] = MOCK_ROOMS;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('aos').then((mod) => mod.default.refresh());
    });
  }

  amenityIcon(label: string): string {
    return AMENITY_ICONS[label] ?? 'bi-check2-circle';
  }

  previewAmenities(room: Room): string[] {
    return room.amenities.slice(0, 3);
  }

  imageAlt(room: Room): string {
    return `Foto della ${room.name}: ${room.shortDescription}`;
  }
}
