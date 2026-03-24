import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'beb.lang';

export const SUPPORTED_LANGS = ['it', 'de', 'en', 'fr', 'es'] as const;
export type AppLang = (typeof SUPPORTED_LANGS)[number];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentLang = signal<AppLang>('it');

  initLanguage(): void {
    this.translate.setDefaultLang('it');
    this.translate.addLangs([...SUPPORTED_LANGS]);

    if (!isPlatformBrowser(this.platformId)) {
      this.translate.use('it').subscribe();
      this.currentLang.set('it');
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    let lang: AppLang = 'it';
    if (stored && this.isSupported(stored)) {
      lang = stored;
    } else {
      const nav = navigator.language?.split('-')[0]?.toLowerCase() ?? 'it';
      if (this.isSupported(nav)) {
        lang = nav;
      }
    }
    this.translate.use(lang).subscribe();
    this.currentLang.set(lang);
  }

  setLanguage(lang: string): void {
    if (!this.isSupported(lang)) {
      return;
    }
    this.translate.use(lang).subscribe();
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  private isSupported(v: string): v is AppLang {
    return (SUPPORTED_LANGS as readonly string[]).includes(v);
  }
}
