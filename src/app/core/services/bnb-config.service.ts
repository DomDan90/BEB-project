import { Injectable } from '@angular/core';
import { bnbConfig, type BnbConfig } from '../config/bnb.config';

@Injectable({ providedIn: 'root' })
export class BnbConfigService {
  readonly config: BnbConfig = bnbConfig;

  get identity(): BnbConfig['identity'] {
    return this.config.identity;
  }

  get contacts(): BnbConfig['contacts'] {
    return this.config.contacts;
  }

  get geo(): BnbConfig['geo'] {
    return this.config.geo;
  }

  get hours(): BnbConfig['hours'] {
    return this.config.hours;
  }

  get social(): BnbConfig['social'] {
    return this.config.social;
  }

  get booking(): BnbConfig['booking'] {
    return this.config.booking;
  }

  get theme(): BnbConfig['theme'] {
    return this.config.theme;
  }

  get seo(): BnbConfig['seo'] {
    return this.config.seo;
  }

  get analytics(): BnbConfig['analytics'] {
    return this.config.analytics;
  }
}

