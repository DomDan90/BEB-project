import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { BnbConfigService } from '../../../core/services/bnb-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bnb = inject(BnbConfigService);

  readonly addressLine = `${this.bnb.contacts.address.street}, ${this.bnb.contacts.address.postalCode} ${this.bnb.contacts.address.city} (${this.bnb.contacts.address.region})`;
  readonly phoneDisplay = this.bnb.contacts.phone.general.display;
  readonly phoneTel = this.bnb.contacts.phone.general.tel;
  readonly email = this.bnb.contacts.email.general;
  readonly tagline = this.bnb.identity.tagline;
  readonly legalName = this.bnb.identity.legalName;
  readonly copyrightYear = this.bnb.identity.foundationYear;

  readonly quickLinks: ReadonlyArray<{ labelKey: string; path: string; fragment?: string }> = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/', fragment: 'home-chi-siamo' },
    { labelKey: 'nav.rooms', path: '/camere' },
    { labelKey: 'nav.gallery', path: '/', fragment: 'home-galleria' },
    { labelKey: 'nav.contacts', path: '/', fragment: 'home-dove-siamo' },
  ];

  readonly socialLinks: ReadonlyArray<{ icon: string; labelKey: string; href: string }> = [
    { icon: 'bi-instagram', labelKey: 'footer.socialInstagram', href: this.bnb.social.instagramUrl },
    { icon: 'bi-facebook', labelKey: 'footer.socialFacebook', href: this.bnb.social.facebookUrl },
    { icon: 'bi-whatsapp', labelKey: 'footer.socialWhatsapp', href: this.bnb.social.whatsappUrl },
    { icon: 'bi-tripadvisor', labelKey: 'footer.socialTripAdvisor', href: this.bnb.social.tripAdvisorUrl },
  ];

  openCookiePreferences(event?: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    event?.preventDefault();
    window.dispatchEvent(new CustomEvent('beb-open-cookie-preferences'));
  }
}
