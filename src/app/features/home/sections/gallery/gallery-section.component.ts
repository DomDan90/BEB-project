import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import type { IAlbum } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';

export interface GalleryGridItem {
  seed: string;
  width: number;
  height: number;
  alt: string;
}

function gridUrl(item: GalleryGridItem): string {
  return `https://picsum.photos/seed/${item.seed}/${item.width}/${item.height}`;
}

/** Stesso seed, risoluzione maggiore per la lightbox (frecce prev/next). */
function lightboxSrc(item: GalleryGridItem): string {
  const maxEdge = 1600;
  if (item.width >= item.height) {
    const w = maxEdge;
    const h = Math.round((maxEdge * item.height) / item.width);
    return `https://picsum.photos/seed/${item.seed}/${w}/${h}`;
  }
  const h = maxEdge;
  const w = Math.round((maxEdge * item.width) / item.height);
  return `https://picsum.photos/seed/${item.seed}/${w}/${h}`;
}

const MOCK_GALLERY: ReadonlyArray<GalleryGridItem> = [
  { seed: 'gallery-1', width: 800, height: 600, alt: 'Salone comune con divani e luce naturale dalle finestre' },
  { seed: 'gallery-2', width: 600, height: 800, alt: 'Dettaglio scala in legno e corrimano in ferro battuto' },
  { seed: 'gallery-3', width: 800, height: 800, alt: 'Cortile interno con vasi di erbe aromatiche e sedute' },
  { seed: 'gallery-4', width: 800, height: 600, alt: 'Tavola della colazione con torte, marmellate e caffè' },
  { seed: 'gallery-5', width: 600, height: 800, alt: 'Ingresso principale con portone storico restaurato' },
  { seed: 'gallery-6', width: 800, height: 800, alt: 'Giardino fiorito con sentiero in ghiaia e ombrelloni' },
  { seed: 'gallery-7', width: 800, height: 600, alt: 'Angolo lettura con libreria e poltrona vintage' },
  { seed: 'gallery-8', width: 600, height: 800, alt: 'Balcone camera con vista sui tetti del borgo' },
  { seed: 'gallery-9', width: 800, height: 800, alt: 'Dettaglio biancheria e fiori freschi in camera' },
];

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss',
})
export class GallerySectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lightbox = inject(Lightbox);

  readonly items = MOCK_GALLERY;
  readonly album: IAlbum[] = MOCK_GALLERY.map((item) => ({
    src: lightboxSrc(item),
    thumb: gridUrl(item),
    caption: item.alt,
  }));

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      void import('aos').then((mod) => mod.default.refresh());
    });
  }

  gridSrc(item: GalleryGridItem): string {
    return gridUrl(item);
  }

  openAlbum(index: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.lightbox.open(this.album, index);
  }
}
