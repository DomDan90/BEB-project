import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDatepickerI18n,
  NgbDatepickerI18nDefault,
} from '@ng-bootstrap/ng-bootstrap/datepicker';
import { LightboxModule } from 'ngx-lightbox';

import { routes } from './app.routes';
import { BookingIsoStringDateAdapter } from './core/booking-date/booking-iso-date.adapter';
import { ItalianDateParserFormatter } from './core/booking-date/italian-date-parser.formatter';
import { apiInterceptor } from './core/interceptors/api.interceptor';

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([apiInterceptor])),
    importProvidersFrom(LightboxModule),
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
