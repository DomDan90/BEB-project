import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ISCHIA_ABOUT } from '../../../../core/media/ischia-media';

const ABOUT_STRENGTHS: ReadonlyArray<{ icon: string; textKey: string }> = [
  { icon: 'bi-house-heart', textKey: 'home.about.strength1' },
  { icon: 'bi-geo-alt', textKey: 'home.about.strength2' },
  { icon: 'bi-cup-hot', textKey: 'home.about.strength3' },
  { icon: 'bi-water', textKey: 'home.about.strength4' },
];

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss',
})
export class AboutSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly imageUrl = ISCHIA_ABOUT;
  readonly strengths = ABOUT_STRENGTHS;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('aos').then((mod) => mod.default.refresh());
    });
  }
}
