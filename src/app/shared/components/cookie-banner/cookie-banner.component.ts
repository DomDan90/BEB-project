import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { AnalyticsService } from '../../../core/services/analytics.service';

type CookieConsentStatus = 'accepted' | 'rejected' | 'customized';

type CookieConsent = {
  status: CookieConsentStatus;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string; // ISO string
};

const COOKIE_CONSENT_KEY = 'beb_cookie_consent_v1';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
})
export class CookieBannerComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);

  readonly isVisible = signal(false);
  readonly preferencesOpen = signal(false);

  private shouldShowBanner = false; // true = nessuna scelta fatta (o dati locali corrotti)

  private storedAnalytics = false;
  private storedMarketing = false;

  // Draft usato nel pannello di gestione.
  draftAnalytics = false;
  draftMarketing = false;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.initFromLocalStorage();
      this.syncVisibilityByRoute();

      // Nascondi il banner solo sulle pagine legali, così l'utente può leggere senza ostacoli.
      // Lo ri-mostri quando l’utente esce da /privacy-policy e /cookie-policy (finché non sceglie).
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => {
          this.syncVisibilityByRoute();
        });

      // Permette al contenuto delle pagine legali di aprire il pannello preferenze
      // senza dover ri-mostrare tutto il banner in modo intrusivo.
      window.addEventListener('beb-open-cookie-preferences', () => {
        this.openPreferencesFromOutside();
      });
    });
  }

  private syncVisibilityByRoute(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const onLegalPage = this.isOnLegalPage();
    const nextVisible = (this.shouldShowBanner && !onLegalPage) || this.preferencesOpen();

    this.isVisible.set(nextVisible);
    if (!nextVisible) {
      this.preferencesOpen.set(false);
    }
  }

  private isOnLegalPage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '/privacy-policy' || path === '/cookie-policy';
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.preferencesOpen()) {
      this.closePreferences();
    }
  }

  acceptAll(): void {
    this.persistConsent({ status: 'accepted', analytics: true, marketing: true });
    this.analytics.setTrackingEnabled(true);
    this.isVisible.set(false);
    this.preferencesOpen.set(false);
  }

  rejectAll(): void {
    this.persistConsent({ status: 'rejected', analytics: false, marketing: false });
    this.analytics.setTrackingEnabled(false);
    this.isVisible.set(false);
    this.preferencesOpen.set(false);
  }

  openPreferences(): void {
    // Se l’utente apre “Gestisci preferenze” senza aver ancora deciso, partiamo dalle preferenze
    // più conservative (non essenziali non attive).
    this.draftAnalytics = this.storedAnalytics;
    this.draftMarketing = this.storedMarketing;
    this.preferencesOpen.set(true);
  }

  private openPreferencesFromOutside(): void {
    this.draftAnalytics = this.storedAnalytics;
    this.draftMarketing = this.storedMarketing;
    this.preferencesOpen.set(true);
    this.isVisible.set(true);
  }

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  savePreferences(): void {
    this.persistConsent({ status: 'customized', analytics: this.draftAnalytics, marketing: this.draftMarketing });
    this.analytics.setTrackingEnabled(this.draftAnalytics);
    this.isVisible.set(false);
    this.preferencesOpen.set(false);
  }

  onAnalyticsChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.draftAnalytics = !!input?.checked;
  }

  onMarketingChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.draftMarketing = !!input?.checked;
  }

  private initFromLocalStorage(): void {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) {
      // Nessuna preferenza salvata: mostriamo il banner completo (ma lo nascondiamo sulle pagine legali).
      this.shouldShowBanner = true;
      this.storedAnalytics = false;
      this.storedMarketing = false;
      this.draftAnalytics = false;
      this.draftMarketing = false;
      this.analytics.setTrackingEnabled(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<CookieConsent>;
      const analytics = typeof parsed.analytics === 'boolean' ? parsed.analytics : false;
      const marketing = typeof parsed.marketing === 'boolean' ? parsed.marketing : false;
      this.storedAnalytics = analytics;
      this.storedMarketing = marketing;
      // Preferenze presenti: banner nascosto (utente ha già scelto).
      this.shouldShowBanner = false;
      this.preferencesOpen.set(false);
      this.analytics.setTrackingEnabled(this.storedAnalytics);
    } catch {
      // Se i dati sono corrotti, evitiamo blocchi: mostriamo il banner (ma lo nascondiamo sulle pagine legali).
      this.shouldShowBanner = true;
      this.storedAnalytics = false;
      this.storedMarketing = false;
      this.draftAnalytics = false;
      this.draftMarketing = false;
      this.analytics.setTrackingEnabled(false);
    }
  }

  private persistConsent(consent: Omit<CookieConsent, 'updatedAt'>): void {
    const next: CookieConsent = {
      ...consent,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
    this.shouldShowBanner = false;
  }
}

