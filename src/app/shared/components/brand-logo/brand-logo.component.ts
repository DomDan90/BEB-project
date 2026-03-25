import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BnbConfigService } from '../../../core/services/bnb-config.service';

/**
 * Logo B&B Ischia come SVG inline: niente `src` esterno, niente problemi di base-href o file corrotti.
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  styleUrl: './brand-logo.component.scss',
  template: `
    @if (logoSrc) {
      <img [src]="logoSrc" [attr.alt]="ariaLabel() || fallbackAlt" width="200" height="56" />
    } @else {
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 56"
        role="img"
        focusable="false"
        [attr.aria-labelledby]="titleId"
        preserveAspectRatio="xMidYMid meet"
      >
        <title [id]="titleId">{{ ariaLabel() || fallbackAlt }}</title>
        <defs>
          <linearGradient [attr.id]="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0d3d52" />
            <stop offset="100%" stop-color="#1a5f7a" />
          </linearGradient>
        </defs>
        <rect width="200" height="56" rx="8" [attr.fill]="'url(#' + gradientId + ')'" />
        <path
          d="M14 38c5-6 10-6 15 0s10 6 15 0 10-6 15 0 10 6 15 0"
          stroke="#f8b600"
          stroke-width="2.2"
          stroke-linecap="round"
          fill="none"
          opacity="0.95"
        />
        <circle cx="34" cy="22" r="5" fill="#f8b600" opacity="0.9" />
        <text
          x="48"
          y="30"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="17"
          font-weight="700"
          fill="#ffffff"
        >
          {{ bnb.identity.name }}
        </text>
        <text
          x="48"
          y="44"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="6.5"
          fill="#f8b600"
          letter-spacing="0.12em"
        >
          {{ bnb.identity.logoSubtitle ?? '' }}
        </text>
      </svg>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  readonly bnb = inject(BnbConfigService);
  readonly logoSrc = this.bnb.identity.logoPath;
  readonly fallbackAlt = this.bnb.identity.logoAlt;

  private static nextId = 0;
  private readonly uid = `bb-logo-${BrandLogoComponent.nextId++}`;

  readonly gradientId = `${this.uid}-grad`;
  readonly titleId = `${this.uid}-title`;

  /** Override aria-label opzionale (se non fornito, usa `identity.logoAlt`). */
  readonly ariaLabel = input<string | null>(null);
}
