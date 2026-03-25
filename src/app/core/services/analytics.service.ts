import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BnbConfigService } from './bnb-config.service';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bnb = inject(BnbConfigService);

  private trackingEnabled = false;
  private injectedGtag = false;

  setTrackingEnabled(enabled: boolean): void {
    this.trackingEnabled = enabled;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (enabled) {
      void this.injectGtagIfNeeded();
    }
  }

  logEvent(name: string, params?: Record<string, unknown>): void {
    if (!this.trackingEnabled || !isPlatformBrowser(this.platformId)) {
      return;
    }
    const w = this.document.defaultView;
    if (w?.gtag) {
      w.gtag('event', name, params ?? {});
    }
  }

  logPageView(path: string, title?: string): void {
    this.logEvent('page_view', { page_path: path, page_title: title });
  }

  private async injectGtagIfNeeded(): Promise<void> {
    if (this.injectedGtag) {
      return;
    }
    this.injectedGtag = true;

    const gaId = this.bnb.analytics.googleAnalyticsId;
    if (!gaId) {
      return;
    }

    const head = this.document.head;

    const existing = head.querySelector('script[data-beb-gtag="1"]') as HTMLScriptElement | null;
    if (existing) {
      return;
    }

    const jsScript = this.document.createElement('script');
    jsScript.async = true;
    jsScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    jsScript.setAttribute('data-beb-gtag', '1');

    const initScript = this.document.createElement('script');
    initScript.setAttribute('data-beb-gtag', '1');
    initScript.textContent = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      `gtag('js', new Date());`,
      `gtag('config', '${gaId}');`,
    ].join('');

    head.appendChild(jsScript);
    head.appendChild(initScript);
  }
}
