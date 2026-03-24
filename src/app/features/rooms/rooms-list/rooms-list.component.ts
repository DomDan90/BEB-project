import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { MOCK_ROOMS } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, LazyImageDirective, BreadcrumbComponent],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly rooms = MOCK_ROOMS;
  readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Camere' },
  ];

  ngOnInit(): void {
    this.seo.updateMeta('Camere | B&B', 'Scopri le nostre camere e suite con prezzi trasparenti e prenotazione diretta.');
  }
}
