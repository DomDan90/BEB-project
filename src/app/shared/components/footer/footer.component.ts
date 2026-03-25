import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

/** Allineato ai mock della LocationSection (Ischia). */
const ADDRESS_LINE = 'Via Roma 42, 80077 Ischia (NA)';
const PHONE_DISPLAY = '+39 081 333 0142';
const PHONE_TEL = '+390813330142';
const EMAIL = 'info@beb-ischia-esempio.it';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly addressLine = ADDRESS_LINE;
  readonly phoneDisplay = PHONE_DISPLAY;
  readonly phoneTel = PHONE_TEL;
  readonly email = EMAIL;

  readonly quickLinks: ReadonlyArray<{ labelKey: string; path: string }> = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/chi-siamo' },
    { labelKey: 'nav.rooms', path: '/camere' },
    { labelKey: 'nav.gallery', path: '/galleria' },
    { labelKey: 'nav.contacts', path: '/contatti' },
  ];

  readonly socialLinks: ReadonlyArray<{ icon: string; labelKey: string; href: string }> = [
    { icon: 'bi-instagram', labelKey: 'footer.socialInstagram', href: '#' },
    { icon: 'bi-facebook', labelKey: 'footer.socialFacebook', href: '#' },
    { icon: 'bi-whatsapp', labelKey: 'footer.socialWhatsapp', href: '#' },
  ];
}
