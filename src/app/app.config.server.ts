import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { TranslateLoader } from '@ngx-translate/core';

import { appConfig } from './app.config';
import { TranslateFsLoader } from './core/i18n/translate-fs.loader';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: TranslateLoader, useClass: TranslateFsLoader },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
