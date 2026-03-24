import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';

export interface ReviewItem {
  id: number;
  avatarSeed: string;
  name: string;
  city: string;
  text: string;
  rating: number;
}

const MOCK_REVIEWS: ReadonlyArray<ReviewItem> = [
  {
    id: 1,
    avatarSeed: 'avatar-1',
    name: 'Elena Marini',
    city: 'Torino',
    rating: 5,
    text: 'Soggiorno perfetto: camera silenziosa, colazione abbondante e proprietari disponibili. Torneremo in primavera per esplorare i sentieri vicini.',
  },
  {
    id: 2,
    avatarSeed: 'avatar-2',
    name: 'Marco Vitale',
    city: 'Bologna',
    rating: 5,
    text: 'Pulizia impeccabile e dettagli curati. Il parcheggio comodo è stato un plus dopo un viaggio lungo. Consigliatissimo per una fuga dal traffico.',
  },
  {
    id: 3,
    avatarSeed: 'avatar-3',
    name: 'Sofia Conti',
    city: 'Firenze',
    rating: 4,
    text: 'Atmosfera accogliente e arredi eleganti. Abbiamo apprezzato i consigli sui ristoranti del posto. Unico neo: avremmo voluto restare una notte in più!',
  },
  {
    id: 4,
    avatarSeed: 'avatar-4',
    name: 'Andrea Gallo',
    city: 'Genova',
    rating: 5,
    text: 'Ottimo rapporto qualità-prezzo. Letto comodissimo e doccia spaziosa. La navetta concordata dall’aeroporto ha funzionato senza intoppi.',
  },
  {
    id: 5,
    avatarSeed: 'avatar-5',
    name: 'Giulia Ferretti',
    city: 'Verona',
    rating: 5,
    text: 'Ideale per coppie: cena in un locale segnalato dalla struttura e rientro tranquilli a piedi. Staff gentile e discreto. Esperienza da ripetere.',
  },
];

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly swiperHost = viewChild<ElementRef<HTMLElement>>('reviewsSwiper');

  readonly reviews = MOCK_REVIEWS;
  /** Slot 1–5 per @for sulle stelle. */
  readonly starSlots: readonly number[] = [1, 2, 3, 4, 5];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('swiper/element/bundle').then(({ register }) => {
        register();
        const el = this.swiperHost()?.nativeElement as undefined | { initialize?: () => void };
        el?.initialize?.();
        void import('aos').then((mod) => mod.default.refresh());
      });
    });
  }

  avatarUrl(seed: string): string {
    return `https://picsum.photos/seed/${seed}/100/100`;
  }
}
