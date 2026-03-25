import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';
import { BnbConfigService } from '../../core/services/bnb-config.service';
import { pagesSeoConfig } from '../../core/config/pages-seo.config';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './legal-page.component.html',
  styleUrl: './legal-page.component.scss',
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly bnb = inject(BnbConfigService);

  readonly titleKey = (this.route.snapshot.data['titleKey'] as string) ?? 'legal.defaultTitle';
  readonly isPrivacy = this.titleKey === 'legal.privacyTitle';
  readonly isCookie = this.titleKey === 'legal.cookieTitle';
  readonly legalName = this.bnb.identity.legalName;

  constructor() {
    if (this.isPrivacy) {
      this.seo.updateSeoForPage(pagesSeoConfig['legal.privacy']);
    } else if (this.isCookie) {
      this.seo.updateSeoForPage(pagesSeoConfig['legal.cookie']);
    }
  }
}
