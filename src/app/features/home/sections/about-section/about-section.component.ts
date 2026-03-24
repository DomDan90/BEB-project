import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Dati statici sezione About (mock, nessun servizio esterno). */
const ABOUT_IMAGE_URL = 'https://picsum.photos/seed/bnb-about/800/600';

const ABOUT_LEAD =
  'Da generazioni accogliamo viaggiatori nel cuore del territorio: un B&B dove eleganza discreta, colazioni genuine e attenzione ai dettagli si incontrano. Ogni soggiorno è pensato per farvi sentire come a casa, con il calore di chi vive questi spazi ogni giorno.';

const ABOUT_STRENGTHS: ReadonlyArray<{ icon: string; text: string }> = [
  { icon: 'bi-house-heart', text: 'Accoglienza familiare e ambiente curato in ogni stagione.' },
  { icon: 'bi-geo-alt', text: 'Posizione strategica tra borghi, natura e itinerari enogastronomici.' },
  { icon: 'bi-cup-hot', text: 'Colazione con prodotti locali e ricette della tradizione.' },
  { icon: 'bi-leaf', text: 'Impegno per sostenibilità e pulizia quotidiana delle camere.' },
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

  readonly imageUrl = ABOUT_IMAGE_URL;
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
    return 'Il bed & breakfast: facciata e giardino in una giornata soleggiata.';
  }
}
