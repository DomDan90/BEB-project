import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

type BootstrapCollapse = {
  getOrCreateInstance(element: Element, options?: object): { hide(): void };
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, BrandLogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly brandLogoAlt = 'B&B Ischia — torna alla homepage';
  isScrolled = false;
  isHomeRoute = false;
  isMainNavOpen = false;

  constructor() {
    this.updateRouteState();
    this.updateScrolledState();

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
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteState();
        this.updateScrolledState();
        // Chiudi il menu solo dopo la navigazione (evita race con routerLink su mobile)
        queueMicrotask(() => this.closeMainNavIfOpen());
      });
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
