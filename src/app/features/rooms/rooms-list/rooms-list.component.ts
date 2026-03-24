import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
import { MOCK_ROOMS } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, LazyImageDirective, BreadcrumbComponent, TranslatePipe],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly rooms = MOCK_ROOMS;
  readonly crumbs: BreadcrumbItem[] = [{ label: 'nav.home', link: '/' }, { label: 'nav.rooms' }];

  constructor() {
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateSeo());
  }

  ngOnInit(): void {
    this.updateSeo();
  }

  private updateSeo(): void {
    this.translate.get(['seo.roomsTitle', 'seo.roomsDesc']).subscribe((t) => {
      this.seo.updateMeta(t['seo.roomsTitle'], t['seo.roomsDesc']);
    });
  }
}
