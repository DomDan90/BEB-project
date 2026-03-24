import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import type { IAlbum } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';

import { ISCHIA_GALLERY, type IschiaGalleryItem } from '../../../../core/media/ischia-media';

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss',
})
export class GallerySectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lightbox = inject(Lightbox);

  readonly items: ReadonlyArray<IschiaGalleryItem> = ISCHIA_GALLERY;
  readonly album: IAlbum[] = ISCHIA_GALLERY.map((item) => ({
    src: item.fullSrc,
    thumb: item.thumbSrc,
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

  gridSrc(item: IschiaGalleryItem): string {
    return item.thumbSrc;
  }

  openAlbum(index: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.lightbox.open(this.album, index);
  }
}
