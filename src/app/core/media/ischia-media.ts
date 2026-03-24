/**
 * Immagini stock (Unsplash) in tema isola / ospitalità.
 * Gli ID foto sono verificati (URL che rispondono 200); alcuni ID generici online risultano 404.
 * Logo: file locale `public/logo-beb-ischia.svg`.
 * Da sostituire con foto reali del cliente in `public/` quando disponibili.
 *
 * Licenza Unsplash: https://unsplash.com/license
 */
function unsplash(photoId: string, w: number, h: number): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

/** Logo in UI: componente `app-brand-logo` (SVG inline). File opzionale in `public/logo-beb-ischia.svg` per condivisione/stampa. */

/** Hero + Open Graph. */
export const ISCHIA_HERO_WIDE = unsplash('1559827260-dc66d52bef19', 1920, 900);
export const ISCHIA_HERO_OG = unsplash('1559827260-dc66d52bef19', 1200, 630);

/** Sfondo sezione servizi / facilities. */
export const ISCHIA_FACILITIES_BG = unsplash('1540555700478-4be289fbecef', 1920, 600);

/** Sezione Chi siamo. */
export const ISCHIA_ABOUT = unsplash('1564013799919-ab600027ffc6', 800, 600);

/** Camere: anteprima + tre scatti per galleria stanza. */
export const ISCHIA_ROOM_IMAGES = {
  standard: {
    thumb: unsplash('1590490360182-c33d57733427', 800, 600),
    gallery: [
      unsplash('1590490360182-c33d57733427', 1200, 800),
      unsplash('1582719478250-c89cae4dc85b', 1200, 800),
      unsplash('1631049307264-da0ec9d70304', 1200, 800),
    ],
  },
  deluxe: {
    thumb: unsplash('1506905925346-21bda4d32df4', 800, 600),
    gallery: [
      unsplash('1506905925346-21bda4d32df4', 1200, 800),
      unsplash('1598928506311-c55ded91a20c', 1200, 800),
      unsplash('1582719478250-c89cae4dc85b', 1200, 800),
    ],
  },
  suite: {
    thumb: unsplash('1512917774080-9991f1c4c750', 800, 600),
    gallery: [
      unsplash('1512917774080-9991f1c4c750', 1200, 800),
      unsplash('1564013799919-ab600027ffc6', 1200, 800),
      unsplash('1631049307264-da0ec9d70304', 1200, 800),
    ],
  },
  family: {
    thumb: unsplash('1598928506311-c55ded91a20c', 800, 600),
    gallery: [
      unsplash('1598928506311-c55ded91a20c', 1200, 800),
      unsplash('1506905925346-21bda4d32df4', 1200, 800),
      unsplash('1522771739844-6a9f6d5f14af', 1200, 800),
    ],
  },
} as const;

export interface IschiaGalleryItem {
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  thumbW: number;
  thumbH: number;
}

function galleryItem(photoId: string, thumbW: number, thumbH: number, alt: string): IschiaGalleryItem {
  const maxEdge = 1600;
  let fullW: number;
  let fullH: number;
  if (thumbW >= thumbH) {
    fullW = maxEdge;
    fullH = Math.round((maxEdge * thumbH) / thumbW);
  } else {
    fullH = maxEdge;
    fullW = Math.round((maxEdge * thumbW) / thumbH);
  }
  return {
    thumbSrc: unsplash(photoId, thumbW, thumbH),
    fullSrc: unsplash(photoId, fullW, fullH),
    alt,
    thumbW,
    thumbH,
  };
}

/** Galleria home. */
export const ISCHIA_GALLERY: ReadonlyArray<IschiaGalleryItem> = [
  galleryItem('1631049307264-da0ec9d70304', 800, 600, 'Camera luminosa con letto matrimoniale e lenzuola chiare'),
  galleryItem('1618773928121-c32242e63f39', 600, 800, 'Dettaglio scala e arredi in stile mediterraneo'),
  galleryItem('1556912172-45b7abe8b7e1', 800, 800, 'Tavola della colazione con prodotti locali e caffè'),
  galleryItem('1512917774080-9991f1c4c750', 800, 600, 'Giardino e spazi esterni della struttura'),
  galleryItem('1586023492125-27b2c045efd7', 600, 800, 'Salone comune con divani e luce naturale'),
  galleryItem('1600210492486-724fe5c67fb0', 800, 800, 'Camera con vista sul verde e tende leggere'),
  galleryItem('1506905925346-21bda4d32df4', 800, 600, 'Angolo relax con arredi chiari'),
  galleryItem('1564013799919-ab600027ffc6', 600, 800, 'Terrazza e zona living all’aperto'),
  galleryItem('1522771739844-6a9f6d5f14af', 800, 800, 'Dettaglio biancheria e fiori freschi in camera'),
];

/** Avatar recensioni. */
export const ISCHIA_REVIEW_AVATARS: ReadonlyArray<string> = [
  unsplash('1438761681033-6461ffad8d80', 100, 100),
  unsplash('1500648767791-00dcc994a43e', 100, 100),
  unsplash('1494790108377-be9c29b29330', 100, 100),
  unsplash('1506794778202-cad84cf45f1d', 100, 100),
  unsplash('1534528741775-53994a69daeb', 100, 100),
];
