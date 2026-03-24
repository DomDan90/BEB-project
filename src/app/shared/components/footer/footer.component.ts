import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

/** Allineato ai mock della LocationSection (Ischia). */
const ADDRESS_LINE = 'Via Roma 42, 80077 Ischia (NA)';
const PHONE_DISPLAY = '+39 081 333 0142';
const PHONE_TEL = '+390813330142';
const EMAIL = 'info@beb-ischia-esempio.it';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly brandLogoAlt = 'B&B Ischia';

  readonly tagline =
    'Ospitalità a Ischia, tra mare e terme: camere curate, colazione con prodotti dell’isola e consigli per spiagge e borghi.';

  readonly addressLine = ADDRESS_LINE;
  readonly phoneDisplay = PHONE_DISPLAY;
  readonly phoneTel = PHONE_TEL;
  readonly email = EMAIL;

  /** Stesso ordine delle sezioni home (scroll) della navbar. */
  readonly quickLinks: ReadonlyArray<{ label: string; path: string }> = [
    { label: 'Home', path: '/' },
    { label: 'Camere', path: '/camere' },
    { label: 'Chi siamo', path: '/chi-siamo' },
    { label: 'Galleria', path: '/galleria' },
    { label: 'Contatti', path: '/contatti' },
  ];

  readonly socialLinks: ReadonlyArray<{ icon: string; label: string; href: string }> = [
    { icon: 'bi-instagram', label: 'Instagram', href: '#' },
    { icon: 'bi-facebook', label: 'Facebook', href: '#' },
    { icon: 'bi-whatsapp', label: 'WhatsApp', href: '#' },
  ];
}
