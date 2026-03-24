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

import { ISCHIA_REVIEW_AVATARS } from '../../../../core/media/ischia-media';

export interface ReviewItem {
  id: number;
  name: string;
  city: string;
  text: string;
  rating: number;
}

const MOCK_REVIEWS: ReadonlyArray<ReviewItem> = [
  {
    id: 1,
    name: 'Elena Marini',
    city: 'Napoli',
    rating: 5,
    text: 'Soggiorno perfetto a Ischia Porto: camera silenziosa, colazione con limoncello fatto in casa e consigli utili per le spiagge. Torneremo in primavera.',
  },
  {
    id: 2,
    name: 'Marco Vitale',
    city: 'Salerno',
    rating: 5,
    text: 'Camera deluxe pulitissima, balconcino con vista sui tetti verdi. Dopo le terme di Ischia riposare lì è stato il massimo.',
  },
  {
    id: 3,
    name: 'Sofia Conti',
    city: 'Roma',
    rating: 4,
    text: 'Posizione comoda per il traghetto e per passeggiare verso il porto. Atmosfera accogliente; unico neo: avremmo voluto restare una notte in più!',
  },
  {
    id: 4,
    name: 'Andrea Gallo',
    city: 'Milano',
    rating: 5,
    text: 'Ottimo punto per esplorare l’isola: Castello Aragonese, Sant’Angelo e spiagge raggiungibili in bus. Letto comodissimo.',
  },
  {
    id: 5,
    name: 'Giulia Ferretti',
    city: 'Torino',
    rating: 5,
    text: 'Ideale per una coppia: cena in un ristorante di pesce consigliato dalla struttura e rientro a piedi. Staff gentile e discreto.',
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

  avatarUrl(index: number): string {
    return ISCHIA_REVIEW_AVATARS[index % ISCHIA_REVIEW_AVATARS.length];
  }
}
