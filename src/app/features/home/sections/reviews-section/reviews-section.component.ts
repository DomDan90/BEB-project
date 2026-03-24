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
import { TranslatePipe } from '@ngx-translate/core';

import { ISCHIA_REVIEW_AVATARS } from '../../../../core/media/ischia-media';

export interface ReviewItem {
  id: number;
  name: string;
  city: string;
  textKey: string;
  rating: number;
}

const MOCK_REVIEWS: ReadonlyArray<ReviewItem> = [
  { id: 1, name: 'Elena Marini', city: 'Napoli', rating: 5, textKey: 'home.reviews.r1' },
  { id: 2, name: 'Marco Vitale', city: 'Salerno', rating: 5, textKey: 'home.reviews.r2' },
  { id: 3, name: 'Sofia Conti', city: 'Roma', rating: 4, textKey: 'home.reviews.r3' },
  { id: 4, name: 'Andrea Gallo', city: 'Milano', rating: 5, textKey: 'home.reviews.r4' },
  { id: 5, name: 'Giulia Ferretti', city: 'Torino', rating: 5, textKey: 'home.reviews.r5' },
];

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TranslatePipe],
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
