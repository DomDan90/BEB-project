import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../core/services/seo.service';
import { getRoomBySlug } from '../../../mock/rooms.mock';
import { CurrencyEurPipe } from '../../../shared/pipes/currency-eur.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { BookingStore } from '../../../store/booking.store';
import { BnbConfigService } from '../../../core/services/bnb-config.service';
@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [RouterLink, CurrencyEurPipe, LazyImageDirective, BreadcrumbComponent, TranslatePipe],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss',
})
export class RoomDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly bookingStore = inject(BookingStore);
  private readonly translate = inject(TranslateService);
  private readonly bnb = inject(BnbConfigService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly room = computed(() => {
    const s = this.slug();
    return s ? getRoomBySlug(s) : undefined;
  });

  readonly crumbs = computed<BreadcrumbItem[]>(() => {
    const r = this.room();
    return [
      { label: 'nav.home', link: '/' },
      { label: 'nav.rooms', link: '/', fragment: 'home-camere' },
      ...(r ? [{ label: r.name }] : []),
    ];
  });

  constructor() {
    effect(() => {
      this.room();
      this.updateRoomSeo();
    });

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateRoomSeo());
  }

  private updateRoomSeo(): void {
    const r = this.room();
    if (!r) {
      return;
    }
    const roomName = this.translate.instant(r.name);
    const description = this.translate.instant(r.shortDescription);
    const canonicalUrl = this.buildRoomCanonicalUrl(r.slug);
    const pageKeywords = [roomName, r.slug];

    this.seo.updateSeo({
      pageTitle: roomName,
      description,
      pageKeywords,
      canonicalUrl,
      ogImage: r.thumbnail,
      robots: 'index,follow',
    });
  }

  private buildRoomCanonicalUrl(slug: string): string {
    const base = this.bnb.seo.urlSite.replace(/\/+$/, '');
    return `${base}/camere/${slug}`;
  }

  selectForBooking(): void {
    const r = this.room();
    if (r) {
      this.bookingStore.selectedRoom.set(r);
    }
  }
}
