import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  readonly brandLogoSrc = 'https://picsum.photos/seed/bnb-logo/200/56';
  readonly brandLogoAlt = 'Logo B&B — torna alla homepage';
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
      });
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
