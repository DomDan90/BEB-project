import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ISCHIA_ABOUT } from '../../../../core/media/ischia-media';

const ABOUT_LEAD =
  'Siamo a Ischia Porto, a due passi dal mare e dai collegamenti col continente: un B&B familiare dove accoglienza, colazioni con prodotti locali e consigli su terme, spiagge e borghi fanno la differenza. Ogni soggiorno è pensato per farvi vivere l’isola con calma, tra natura e tradizione.';

const ABOUT_STRENGTHS: ReadonlyArray<{ icon: string; text: string }> = [
  { icon: 'bi-house-heart', text: 'Accoglienza familiare e ambiente curato, dalla primavera all’autunno.' },
  { icon: 'bi-geo-alt', text: 'Ideale per esplorare Ischia: porto, spiagge, Castello Aragonese e sentieri.' },
  { icon: 'bi-cup-hot', text: 'Colazione con dolci, frutta e sapori del Golfo di Napoli.' },
  { icon: 'bi-water', text: 'Suggerimenti su terme, crociere in barca e giornate al sole.' },
];

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss',
})
export class AboutSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly imageUrl = ISCHIA_ABOUT;
  readonly lead = ABOUT_LEAD;
  readonly strengths = ABOUT_STRENGTHS;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('aos').then((mod) => mod.default.refresh());
    });
  }

  imageAlt(): string {
    return 'Il B&B a Ischia: terrazza e vista sul Mediterraneo in una giornata limpida.';
  }
}
