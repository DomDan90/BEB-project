import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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

  readonly isVisible = signal(false);
  readonly preferencesOpen = signal(false);

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
    });
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.preferencesOpen()) {
      this.closePreferences();
    }
  }

  acceptAll(): void {
    this.persistConsent({ status: 'accepted', analytics: true, marketing: true });
    this.isVisible.set(false);
    this.preferencesOpen.set(false);
  }

  rejectAll(): void {
    this.persistConsent({ status: 'rejected', analytics: false, marketing: false });
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

  closePreferences(): void {
    this.preferencesOpen.set(false);
  }

  savePreferences(): void {
    this.persistConsent({ status: 'customized', analytics: this.draftAnalytics, marketing: this.draftMarketing });
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
      // Nessuna preferenza salvata: mostriamo il banner completo.
      this.isVisible.set(true);
      this.storedAnalytics = false;
      this.storedMarketing = false;
      this.draftAnalytics = false;
      this.draftMarketing = false;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<CookieConsent>;
      const analytics = typeof parsed.analytics === 'boolean' ? parsed.analytics : false;
      const marketing = typeof parsed.marketing === 'boolean' ? parsed.marketing : false;
      this.storedAnalytics = analytics;
      this.storedMarketing = marketing;
      // Preferenze presenti: banner nascosto.
      this.isVisible.set(false);
      this.preferencesOpen.set(false);
    } catch {
      // Se i dati sono corrotti, evitiamo blocchi: mostriamo il banner.
      this.isVisible.set(true);
      this.storedAnalytics = false;
      this.storedMarketing = false;
      this.draftAnalytics = false;
      this.draftMarketing = false;
    }
  }

  private persistConsent(consent: Omit<CookieConsent, 'updatedAt'>): void {
    const next: CookieConsent = {
      ...consent,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
  }
}

