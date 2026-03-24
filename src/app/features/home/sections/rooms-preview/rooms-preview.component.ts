import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOCK_ROOMS } from '../../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../../shared/pipes/currency-eur.pipe';
import { LazyImageDirective } from '../../../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-rooms-preview',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, LazyImageDirective],
  templateUrl: './rooms-preview.component.html',
  styleUrl: './rooms-preview.component.scss',
})
export class RoomsPreviewComponent {
  readonly rooms = MOCK_ROOMS.filter((r) => r.featured).slice(0, 3);
}
