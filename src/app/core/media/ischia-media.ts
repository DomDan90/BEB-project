/**
 * Immagini locali (white-label) in tema isola / ospitalità.
 * Tutte le foto sono in `src/assets/bEb-esempio/` e vengono riutilizzate/duplicate
 * per mantenere solo 3 immagini diverse (bEb-esempio-1/-2/-3) + 1 hero (bEb-home-esempio).
 */

const ASSET_BASE = '/assets/bEb-esempio';
const HERO_IMG = `${ASSET_BASE}/bEb-home-esempio.jpg`;
const IMG_1 = `${ASSET_BASE}/bEb-esempio-1.jpg`;
const IMG_2 = `${ASSET_BASE}/bEb-esempio-2.jpg`;
const IMG_3 = `${ASSET_BASE}/bEb-esempio-3.jpg`;

/** Foto reale hero / Open Graph (camere, Ischia). */
export const ISCHIA_HERO_WIDE = HERO_IMG;
export const ISCHIA_HERO_OG = HERO_IMG;

/** Sfondo sezione servizi / facilities. */
export const ISCHIA_FACILITIES_BG = IMG_2;

/** Sezione Chi siamo. */
export const ISCHIA_ABOUT = IMG_1;

/** Camere: anteprima + tre scatti per galleria stanza (solo 3 foto distinte, duplicate ok). */
export const ISCHIA_ROOM_IMAGES = {
  standard: {
    thumb: IMG_1,
    gallery: [IMG_1, IMG_2, IMG_3],
  },
  deluxe: {
    thumb: IMG_2,
    gallery: [IMG_2, IMG_3, IMG_1],
  },
  suite: {
    thumb: IMG_3,
    gallery: [IMG_3, IMG_1, IMG_2],
  },
  family: {
    thumb: IMG_1,
    gallery: [IMG_1, IMG_3, IMG_2],
  },
} as const;

export interface IschiaGalleryItem {
  thumbSrc: string;
  fullSrc: string;
  /** Chiave i18n (ngx-translate). */
  altKey: string;
  thumbW: number;
  thumbH: number;
}

function galleryItem(src: string, thumbW: number, thumbH: number, altKey: string): IschiaGalleryItem {
  // Per immagini locali: thumb/full puntano alla stessa risorsa.
  return {
    thumbSrc: src,
    fullSrc: src,
    altKey,
    thumbW,
    thumbH,
  };
}

/** Galleria home. */
export const ISCHIA_GALLERY: ReadonlyArray<IschiaGalleryItem> = [
  galleryItem(IMG_1, 800, 600, 'home.gallery.items.brightRoom'),
  galleryItem(IMG_2, 600, 800, 'home.gallery.items.stairs'),
  galleryItem(IMG_3, 800, 800, 'home.gallery.items.breakfastTable'),
  galleryItem(IMG_1, 800, 600, 'home.gallery.items.garden'),
  galleryItem(IMG_2, 600, 800, 'home.gallery.items.lounge'),
  galleryItem(IMG_3, 800, 800, 'home.gallery.items.greenView'),
  galleryItem(IMG_1, 800, 600, 'home.gallery.items.relaxCorner'),
  galleryItem(IMG_2, 600, 800, 'home.gallery.items.terrace'),
  galleryItem(IMG_3, 800, 800, 'home.gallery.items.linens'),
];

/** Avatar recensioni. */
export const ISCHIA_REVIEW_AVATARS: ReadonlyArray<string> = [
  IMG_1,
  IMG_2,
  IMG_3,
  IMG_1,
  IMG_2,
];
