import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
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

  readonly brandLogoAlt = 'B&B Ischia — torna alla homepage';
  isScrolled = false;
  isHomeRoute = false;

  constructor() {
    this.updateRouteState();
    this.updateScrolledState();

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
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrolledState();
  }

  get isHomeTop(): boolean {
    return this.isHomeRoute && !this.isScrolled;
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
