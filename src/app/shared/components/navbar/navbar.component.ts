import { DOCUMENT, isPlatformBrowser, UpperCasePipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { AppLang, LanguageService } from '../../../core/services/language.service';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

type BootstrapCollapse = {
  getOrCreateInstance(element: Element, options?: object): { hide(): void };
};

/** Chiave voce menu allineata a route o sezione home (scroll spy). */
type NavRouteKey = 'home' | 'chi-siamo' | 'camere' | 'galleria' | 'blog' | 'contatti' | 'prenota';

/** Sezioni home (ordine = ordine DOM di scroll, allineato al menu): `nav: null` mantiene l’ultima voce esplicita. */
const HOME_SCROLL_SECTIONS: ReadonlyArray<{ id: string; nav: NavRouteKey | null }> = [
  { id: 'home-hero', nav: 'home' },
  { id: 'home-chi-siamo', nav: 'chi-siamo' },
  { id: 'home-camere', nav: 'camere' },
  { id: 'home-galleria', nav: 'galleria' },
  { id: 'home-dove-siamo', nav: 'contatti' },
  { id: 'home-servizi', nav: null },
  { id: 'home-recensioni', nav: null },
];

/** Sotto la navbar fissa (~80px) + piccolo margine. */
const HOME_SPY_OFFSET_PX = 88;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent, TranslatePipe, UpperCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  readonly language = inject(LanguageService);

  readonly langMenu: ReadonlyArray<{ code: AppLang; flag: string; labelKey: string }> = [
    { code: 'it', flag: '🇮🇹', labelKey: 'lang.native.it' },
    { code: 'de', flag: '🇩🇪', labelKey: 'lang.native.de' },
    { code: 'en', flag: '🇬🇧', labelKey: 'lang.native.en' },
    { code: 'fr', flag: '🇫🇷', labelKey: 'lang.native.fr' },
    { code: 'es', flag: '🇪🇸', labelKey: 'lang.native.es' },
  ];
  isScrolled = false;
  isHomeRoute = false;
  isMainNavOpen = false;

  /** Voce evidenziata sulla home in base allo scroll (burger / desktop). */
  private readonly activeHomeNavKey = signal<NavRouteKey>('home');
  private spyRafId = 0;

  constructor() {
    this.updateRouteState();
    this.updateScrolledState();

    this.destroyRef.onDestroy(() => {
      if (this.spyRafId !== 0) {
        cancelAnimationFrame(this.spyRafId);
        this.spyRafId = 0;
      }
    });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const mainNavEl = this.document.getElementById('mainNav');
      if (!mainNavEl) {
        return;
      }

      this.isMainNavOpen = mainNavEl.classList.contains('show');
      this.cdr.markForCheck();

      const toggler = this.document.querySelector<HTMLButtonElement>('[data-bs-target="#mainNav"]');
      /** Stato *prima* che Bootstrap aggiorni il collapse: subito bianco / subito “home top” possibile. */
      const syncOpenStateBeforeBootstrap = (): void => {
        const willOpen = !mainNavEl.classList.contains('show');
        this.isMainNavOpen = willOpen;
        this.cdr.detectChanges();
      };
      /** Su mobile il `click` arriva dopo il tocco: anticipiamo solo l’apertura. */
      const touchEarlyOpen = (): void => {
        if (!mainNavEl.classList.contains('show')) {
          this.isMainNavOpen = true;
          this.cdr.detectChanges();
        }
      };
      toggler?.addEventListener('touchstart', touchEarlyOpen, { capture: true, passive: true });
      toggler?.addEventListener('click', syncOpenStateBeforeBootstrap, { capture: true });

      const onShown = (): void => {
        this.isMainNavOpen = true;
        this.updateHomeScrollSpy();
        this.cdr.detectChanges();
      };
      const onHidden = (): void => {
        this.isMainNavOpen = false;
        this.cdr.detectChanges();
      };

      mainNavEl.addEventListener('shown.bs.collapse', onShown);
      mainNavEl.addEventListener('hidden.bs.collapse', onHidden);

      this.destroyRef.onDestroy(() => {
        toggler?.removeEventListener('touchstart', touchEarlyOpen, { capture: true } as AddEventListenerOptions);
        toggler?.removeEventListener('click', syncOpenStateBeforeBootstrap, { capture: true } as AddEventListenerOptions);
        mainNavEl.removeEventListener('shown.bs.collapse', onShown);
        mainNavEl.removeEventListener('hidden.bs.collapse', onHidden);
      });

      this.updateHomeScrollSpy();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteState();
        this.updateScrolledState();
        // Chiudi il menu solo dopo la navigazione (evita race con routerLink su mobile)
        queueMicrotask(() => {
          this.closeMainNavIfOpen();
          this.updateHomeScrollSpy();
        });
      });
  }

  /** Evidenziazione voce: su `/` usa scroll spy; sulle altre route l’URL. */
  isNavActive(key: NavRouteKey): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    const onHome = path === '/' || path === '';
    if (onHome) {
      return this.activeHomeNavKey() === key;
    }
    switch (key) {
      case 'home':
        return false;
      case 'chi-siamo':
        return path.startsWith('/chi-siamo');
      case 'camere':
        return path.startsWith('/camere');
      case 'galleria':
        return path.startsWith('/galleria');
      case 'blog':
        return path.startsWith('/blog');
      case 'contatti':
        return path.startsWith('/contatti');
      case 'prenota':
        return path.startsWith('/prenota');
      default:
        return false;
    }
  }

  /**
   * Ogni click su una voce del menu principale: chiude sempre il collapse mobile.
   * Su `/` + Home: scroll all’hero (l’URL non cambia → senza questo il menu resterebbe aperto).
   * Voce già attiva: scroll sezione (home) o in cima (stessa route interna).
   * Click con modificatori: non interferisce (nuova scheda ecc.).
   */
  onNavLinkClick(event: MouseEvent, sectionIdOnHome: string | null, navKey: NavRouteKey): void {
    if (!isPlatformBrowser(this.platformId) || !this.isPlainLeftClick(event)) {
      return;
    }

    const path = this.router.url.split('?')[0].split('#')[0];
    const onHome = path === '/' || path === '';

    const scheduleClose = (): void => queueMicrotask(() => this.closeMainNavIfOpen());

    if (navKey === 'home' && onHome && sectionIdOnHome) {
      event.preventDefault();
      this.scrollToSectionById(sectionIdOnHome);
      scheduleClose();
      return;
    }

    if (this.isNavActive(navKey)) {
      if (onHome && sectionIdOnHome) {
        event.preventDefault();
        this.scrollToSectionById(sectionIdOnHome);
        scheduleClose();
        return;
      }
      const prefix = this.routePrefixForNavKey(navKey);
      if (prefix && path.startsWith(prefix)) {
        event.preventDefault();
        this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
        scheduleClose();
        return;
      }
    }

    scheduleClose();
  }

  private isPlainLeftClick(event: MouseEvent): boolean {
    return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
  }

  private routePrefixForNavKey(key: NavRouteKey): string | null {
    switch (key) {
      case 'home':
        return null;
      case 'camere':
        return '/camere';
      case 'chi-siamo':
        return '/chi-siamo';
      case 'galleria':
        return '/galleria';
      case 'contatti':
        return '/contatti';
      case 'blog':
        return '/blog';
      case 'prenota':
        return '/prenota';
      default:
        return null;
    }
  }

  private scrollToSectionById(id: string): void {
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const el = this.document.getElementById(id);
    if (!el) {
      return;
    }
    const y = el.getBoundingClientRect().top + win.scrollY - HOME_SPY_OFFSET_PX;
    win.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  private scheduleHomeScrollSpy(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isHomeRoute) {
      return;
    }
    if (this.spyRafId !== 0) {
      return;
    }
    this.spyRafId = requestAnimationFrame(() => {
      this.spyRafId = 0;
      this.updateHomeScrollSpy();
    });
  }

  private updateHomeScrollSpy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const path = this.router.url.split('?')[0].split('#')[0];
    if (path !== '/' && path !== '') {
      return;
    }
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const probeY = win.scrollY + HOME_SPY_OFFSET_PX;
    let key: NavRouteKey = 'home';
    for (const row of HOME_SCROLL_SECTIONS) {
      const el = this.document.getElementById(row.id);
      if (!el) {
        continue;
      }
      const top = el.getBoundingClientRect().top + win.scrollY;
      if (top <= probeY + 1 && row.nav !== null) {
        key = row.nav;
      }
    }
    this.activeHomeNavKey.set(key);
  }

  private closeMainNavIfOpen(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const el = this.document.getElementById('mainNav');
    if (!el?.classList.contains('show')) {
      return;
    }
    const win = this.document.defaultView as
      | (Window & { bootstrap?: { Collapse: BootstrapCollapse } })
      | null;
    const Collapse = win?.bootstrap?.Collapse;
    if (Collapse) {
      Collapse.getOrCreateInstance(el).hide();
    } else {
      el.classList.remove('show');
    }
    this.document
      .querySelector<HTMLButtonElement>('[data-bs-target="#mainNav"]')
      ?.setAttribute('aria-expanded', 'false');

    this.isMainNavOpen = false;
    this.cdr.markForCheck();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrolledState();
    this.scheduleHomeScrollSpy();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleHomeScrollSpy();
  }

  get isHomeTop(): boolean {
    // Se il menu mobile è aperto, vogliamo sempre background bianco (quindi non “home top”).
    return this.isHomeRoute && !this.isScrolled && !this.isMainNavOpen;
  }

  private updateScrolledState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isScrolled = false;
      return;
    }

    this.isScrolled = window.scrollY > 8;
  }

  private updateRouteState(): void {
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    this.isHomeRoute = currentPath === '/' || currentPath === '';
  }
}
