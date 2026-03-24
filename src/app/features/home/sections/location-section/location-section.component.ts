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

/** Ischia Porto (centro, zona porto/traghetti). */
const MOCK_LAT = 40.7389;
const MOCK_LNG = 13.951;

const MOCK_PHONE_DISPLAY = '+39 081 333 0142';
const MOCK_PHONE_TEL = '+390813330142';
const MOCK_EMAIL = 'info@beb-ischia-esempio.it';

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

  private map: LeafletMap | null = null;
  private mapMarker: Marker | null = null;
  private mapResizeObserver: ResizeObserver | null = null;

  readonly lat = MOCK_LAT;
  readonly lng = MOCK_LNG;
  readonly phoneDisplay = MOCK_PHONE_DISPLAY;
  readonly phoneTel = MOCK_PHONE_TEL;
  readonly email = MOCK_EMAIL;

  /** Link esterno Google Maps (coordinate mock Ischia). */
  readonly googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${MOCK_LAT},${MOCK_LNG}`;

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
    }).setView([MOCK_LAT, MOCK_LNG], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    const popupText = this.translate.instant('home.location.mapPopup');
    this.mapMarker = L.marker([MOCK_LAT, MOCK_LNG], { icon: customIcon })
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
