import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Allineato ai mock della LocationSection (Napoli). */
const ADDRESS_LINE = 'Via Toledo 156, 80132 Napoli';
const PHONE_DISPLAY = '+39 081 555 0142';
const PHONE_TEL = '+390815550142';
const EMAIL = 'accoglienza@bb-napoli-esempio.it';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly brandLogoSrc = 'https://picsum.photos/seed/bnb-logo/200/56';
  readonly brandLogoAlt = 'Logo B&B';

  readonly tagline =
    'Ospitalità autentica nel cuore di Napoli: camere curate, colazione inclusa e accoglienza che fa la differenza.';

  readonly addressLine = ADDRESS_LINE;
  readonly phoneDisplay = PHONE_DISPLAY;
  readonly phoneTel = PHONE_TEL;
  readonly email = EMAIL;

  readonly quickLinks: ReadonlyArray<{ label: string; path: string }> = [
    { label: 'Home', path: '/' },
    { label: 'Chi siamo', path: '/chi-siamo' },
    { label: 'Camere', path: '/camere' },
    { label: 'Galleria', path: '/galleria' },
    { label: 'Contatti', path: '/contatti' },
  ];

  readonly socialLinks: ReadonlyArray<{ icon: string; label: string; href: string }> = [
    { icon: 'bi-instagram', label: 'Instagram', href: '#' },
    { icon: 'bi-facebook', label: 'Facebook', href: '#' },
    { icon: 'bi-whatsapp', label: 'WhatsApp', href: '#' },
  ];
}
