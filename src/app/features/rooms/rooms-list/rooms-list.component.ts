import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
import { MOCK_ROOMS } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { pagesSeoConfig } from '../../../core/config/pages-seo.config';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, LazyImageDirective, BreadcrumbComponent, TranslatePipe],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly rooms = MOCK_ROOMS;
  readonly crumbs: BreadcrumbItem[] = [{ label: 'nav.home', link: '/' }, { label: 'nav.rooms' }];

  ngOnInit(): void {
    this.seo.updateSeoForPage(pagesSeoConfig.rooms);
  }
}
