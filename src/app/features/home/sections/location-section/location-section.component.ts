import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import type { Map as LeafletMap } from 'leaflet';
import type { Marker } from 'leaflet';
import { BnbConfigService } from '../../../../core/services/bnb-config.service';

@Component({
  selector: 'app-location-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './location-section.component.html',
  styleUrl: './location-section.component.scss',
})
export class LocationSectionComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mapHost = viewChild<ElementRef<HTMLElement>>('mapHost');
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bnb = inject(BnbConfigService);

  private map: LeafletMap | null = null;
  private mapMarker: Marker | null = null;
  private mapResizeObserver: ResizeObserver | null = null;

  readonly lat = this.bnb.geo.latitude;
  readonly lng = this.bnb.geo.longitude;
  readonly phoneDisplay = this.bnb.contacts.phone.general.display;
  readonly phoneTel = this.bnb.contacts.phone.general.tel;
  readonly email = this.bnb.contacts.email.general;

  readonly addressLine = `${this.bnb.contacts.address.street}, ${this.bnb.contacts.address.postalCode} ${this.bnb.contacts.address.city} (${this.bnb.contacts.address.region})`;
  readonly checkInDisplay = `${this.bnb.hours.checkIn.from} - ${this.bnb.hours.checkIn.to}`;
  readonly checkOutDisplay = `Entro ${this.bnb.hours.checkOutBy}`;
  readonly receptionHoursDisplay = this.bnb.hours.reception;

  /** Link esterno Google Maps. */
  readonly googleMapsUrl = this.bnb.geo.googleMapsUrl;

  constructor() {
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const txt = this.translate.instant('home.location.mapPopup');
      this.mapMarker?.setPopupContent(txt);
    });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void this.initMap();
    });
  }

  ngOnDestroy(): void {
    this.mapResizeObserver?.disconnect();
    this.mapResizeObserver = null;
    this.mapMarker = null;
    this.map?.remove();
    this.map = null;
  }

  private async initMap(): Promise<void> {
    const el = this.mapHost()?.nativeElement;
    if (!el) {
      return;
    }

    const L = await import('leaflet');

    const customIcon = L.divIcon({
      className: 'location-section__leaflet-marker',
      html: '<span class="location-section__marker-inner" aria-hidden="true"><i class="bi bi-geo-alt-fill"></i></span>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -36],
    });

    this.map = L.map(el, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([this.lat, this.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    const popupText = this.translate.instant('home.location.mapPopup');
    this.mapMarker = L.marker([this.lat, this.lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(popupText);

    if (typeof ResizeObserver !== 'undefined') {
      this.mapResizeObserver = new ResizeObserver(() => {
        this.map?.invalidateSize();
      });
      this.mapResizeObserver.observe(el);
    }

    requestAnimationFrame(() => {
      this.map?.invalidateSize();
      setTimeout(() => {
        this.map?.invalidateSize();
        void import('aos').then((mod) => mod.default.refresh());
      }, 350);
    });
  }
}
