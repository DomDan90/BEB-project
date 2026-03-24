import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

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

  logEvent(name: string, params?: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) {
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
}
