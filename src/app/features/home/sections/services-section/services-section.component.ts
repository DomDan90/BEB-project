import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

const MOCK_SERVICES: ReadonlyArray<ServiceItem> = [
  {
    icon: 'bi-cup-hot',
    title: 'Colazione inclusa',
    description: 'Ogni mattina buffet dolce e salato con prodotti locali, torte fatte in casa e bevande calde.',
  },
  {
    icon: 'bi-wifi',
    title: 'Wi‑Fi gratuito',
    description: 'Connessione veloce in tutta la struttura per lavorare o condividere il soggiorno in relax.',
  },
  {
    icon: 'bi-p-square',
    title: 'Parcheggio',
    description: 'Posti auto riservati o convenzione nelle vicinanze, con indicazioni chiare al check-in.',
  },
  {
    icon: 'bi-snow',
    title: 'Aria condizionata',
    description: 'Climatizzazione autonoma in camera per il massimo comfort in ogni stagione.',
  },
  {
    icon: 'bi-brush',
    title: 'Pulizie giornaliere',
    description: 'Servizio di housekeeping quotidiano con biancheria fresca e prodotti di cortesia.',
  },
  {
    icon: 'bi-bus-front',
    title: 'Navetta aeroporto',
    description: 'Transfer su prenotazione da e per aeroporto e stazione — chiedi disponibilità in reception.',
  },
];

@Component({
  selector: 'app-services-section',
  standalone: true,
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss',
})
export class ServicesSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly parallaxEnabled = signal(false);
  readonly services = MOCK_SERVICES;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.parallaxEnabled.set(true);
      void import('aos').then((mod) => mod.default.refresh());
    });
  }
}
