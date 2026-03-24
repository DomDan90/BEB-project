import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface ServiceItem {
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

const MOCK_SERVICES: ReadonlyArray<ServiceItem> = [
  {
    icon: 'bi-cup-hot',
    titleKey: 'home.services.breakfastTitle',
    descriptionKey: 'home.services.breakfastDesc',
  },
  {
    icon: 'bi-wifi',
    titleKey: 'home.services.wifiTitle',
    descriptionKey: 'home.services.wifiDesc',
  },
  {
    icon: 'bi-p-square',
    titleKey: 'home.services.parkingTitle',
    descriptionKey: 'home.services.parkingDesc',
  },
  {
    icon: 'bi-snow',
    titleKey: 'home.services.acTitle',
    descriptionKey: 'home.services.acDesc',
  },
  {
    icon: 'bi-brush',
    titleKey: 'home.services.cleaningTitle',
    descriptionKey: 'home.services.cleaningDesc',
  },
  {
    icon: 'bi-bus-front',
    titleKey: 'home.services.shuttleTitle',
    descriptionKey: 'home.services.shuttleDesc',
  },
];

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [TranslatePipe],
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
