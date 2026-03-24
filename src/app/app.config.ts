import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDatepickerI18n,
  NgbDatepickerI18nDefault,
} from '@ng-bootstrap/ng-bootstrap/datepicker';
import { LightboxConfig, LightboxModule } from 'ngx-lightbox';

import { routes } from './app.routes';
import { BookingIsoStringDateAdapter } from './core/booking-date/booking-iso-date.adapter';
import { ItalianDateParserFormatter } from './core/booking-date/italian-date-parser.formatter';
import { apiInterceptor } from './core/interceptors/api.interceptor';

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    // Default Angular 21 = change detection zoneless: ngx-lightbox aggiorna lo stato in Image.onload senza CD → loader infinito.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([apiInterceptor])),
    ...provideTranslateService({ lang: 'it', fallbackLang: 'it' }),
    ...provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
    importProvidersFrom(LightboxModule),
    // ngx-lightbox attende transitionend per togliere il loader; se l’evento non arriva (CSS/browser), resta il caricamento infinito.
    {
      provide: LightboxConfig,
      useFactory: () => {
        const cfg = new LightboxConfig();
        cfg.enableTransition = false;
        return cfg;
      },
    },
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: NgbDateAdapter, useClass: BookingIsoStringDateAdapter },
    { provide: NgbDateParserFormatter, useClass: ItalianDateParserFormatter },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault },
    {
      provide: NgbDatepickerConfig,
      useFactory: () => {
        const c = new NgbDatepickerConfig();
        c.firstDayOfWeek = 1;
        // Frecce al posto dei select mese/anno: evita il menu nativo stretto e “infinito” su alcuni browser.
        c.navigation = 'arrows';
        return c;
      },
    },
  ],
};
