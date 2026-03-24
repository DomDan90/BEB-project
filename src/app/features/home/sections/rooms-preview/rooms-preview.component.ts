import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MOCK_ROOMS } from '../../../../mock/rooms.mock';
import type { Room } from '../../../../models/room.model';

const AMENITY_ICONS: Record<string, string> = {
  'rooms.amenity.wifi': 'bi-wifi',
  'rooms.amenity.tv': 'bi-tv',
  'rooms.amenity.smartTv': 'bi-tv',
  'rooms.amenity.ac': 'bi-snow',
  'rooms.amenity.privateBath': 'bi-droplet',
  'rooms.amenity.breakfast': 'bi-cup-hot',
  'rooms.amenity.minibar': 'bi-box-seam',
  'rooms.amenity.balcony': 'bi-door-open',
  'rooms.amenity.living': 'bi-house-door',
  'rooms.amenity.safe': 'bi-shield-lock',
  'rooms.amenity.fridge': 'bi-box-seam',
  'rooms.amenity.teaCorner': 'bi-cup',
};

@Component({
  selector: 'app-rooms-preview',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './rooms-preview.component.html',
  styleUrl: './rooms-preview.component.scss',
})
export class RoomsPreviewComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);

  readonly rooms: Room[] = MOCK_ROOMS;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('aos').then((mod) => mod.default.refresh());
    });
  }

  amenityIcon(amenityKey: string): string {
    return AMENITY_ICONS[amenityKey] ?? 'bi-check2-circle';
  }

  previewAmenities(room: Room): string[] {
    return room.amenities.slice(0, 3);
  }

  imageAlt(room: Room): string {
    return this.translate.instant('home.roomsPreview.imageAlt', {
      caption: this.translate.instant(room.shortDescription),
    });
  }
}
