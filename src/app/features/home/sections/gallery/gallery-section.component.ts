import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import type { IAlbum } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';

import { ISCHIA_GALLERY, type IschiaGalleryItem } from '../../../../core/media/ischia-media';

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss',
})
export class GallerySectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lightbox = inject(Lightbox);
  private readonly translate = inject(TranslateService);

  readonly items: ReadonlyArray<IschiaGalleryItem> = ISCHIA_GALLERY;

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

  private buildAlbum(): IAlbum[] {
    return this.items.map((item) => ({
      src: item.fullSrc,
      thumb: item.thumbSrc,
      caption: this.translate.instant(item.altKey),
    }));
  }

  openAlbum(index: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.lightbox.open(this.buildAlbum(), index);
  }
}
