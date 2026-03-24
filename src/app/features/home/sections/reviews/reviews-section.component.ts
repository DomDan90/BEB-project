import { Component } from '@angular/core';
import { MOCK_REVIEWS } from '../../../../mock/reviews.mock';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionComponent {
  readonly reviews = MOCK_REVIEWS.slice(0, 3);
}
