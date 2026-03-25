import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  HostListener,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss',
})
export class BackToTopComponent {
  private readonly platformId = inject(PLATFORM_ID);

  private static readonly thresholdPx = 400;

  readonly visible = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.syncVisibility();
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.syncVisibility();
  }

  private syncVisibility(): void {
    const y = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
    this.visible.set(y > BackToTopComponent.thresholdPx);
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
