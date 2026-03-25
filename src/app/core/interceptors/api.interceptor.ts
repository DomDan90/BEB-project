import { HttpInterceptorFn } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';

import { BnbConfigService } from '../services/bnb-config.service';

export const SMOOBU_API_KEY = new InjectionToken<string>('SMOOBU_API_KEY', {
  providedIn: 'root',
  factory: () => inject(BnbConfigService).booking.smoobuApiKey,
});

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = inject(SMOOBU_API_KEY);
  if (!apiKey || !req.url.includes('smoobu.com')) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: {
        'Api-Key': apiKey,
      },
    }),
  );
};
