import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './legal-page.component.html',
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly titleKey = (this.route.snapshot.data['titleKey'] as string) ?? 'legal.defaultTitle';
  readonly isPrivacy = this.titleKey === 'legal.privacyTitle';
  readonly isCookie = this.titleKey === 'legal.cookieTitle';
}
