import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MOCK_REVIEWS } from '../../../../mock/reviews.mock';

/** Non incluso nella home — mantenuto allineato alle chiavi i18n. */
@Component({
  selector: 'app-reviews-section-legacy',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionLegacyComponent {
  readonly reviews = MOCK_REVIEWS.slice(0, 3);
}
