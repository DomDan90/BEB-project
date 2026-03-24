import { ISCHIA_ROOM_IMAGES } from '../core/media/ischia-media';
import { Room } from '../models/room.model';

export const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    name: 'Camera Standard',
    slug: 'camera-standard',
    description:
      'Camera accogliente nel centro di Ischia Porto, ideale dopo una giornata al mare o alle terme. Arredi chiari, bagno privato con doccia e aria condizionata per le notti d’estate.',
    shortDescription: 'Comfort per due ospiti, bagno privato, vicino al porto.',
    pricePerNight: 80,
    maxGuests: 2,
    size: 18,
    bedType: 'double',
    thumbnail: ISCHIA_ROOM_IMAGES.standard.thumb,
    images: [...ISCHIA_ROOM_IMAGES.standard.gallery],
    amenities: ['Wi‑Fi', 'TV', 'Aria condizionata', 'Bagno privato', 'Colazione inclusa'],
    isAvailable: true,
    featured: false,
    smoobuApartmentId: 1001,
  },
  {
    id: 2,
    name: 'Camera Deluxe',
    slug: 'camera-deluxe',
    description:
      'Camera spaziosa con balconcino affacciato sui tetti e sulle colline verdi dell’isola. Letto queen size, minifrigo e set da tè: perfetta per colazioni in camera prima di una gita al Castello Aragonese.',
    shortDescription: 'Balconcino, minifrigo e letto queen size.',
    pricePerNight: 120,
    maxGuests: 2,
    size: 25,
    bedType: 'queen',
    thumbnail: ISCHIA_ROOM_IMAGES.deluxe.thumb,
    images: [...ISCHIA_ROOM_IMAGES.deluxe.gallery],
    amenities: ['Wi‑Fi', 'Smart TV', 'Minifrigo', 'Balcone', 'Aria condizionata', 'Colazione inclusa'],
    isAvailable: true,
    featured: true,
    smoobuApartmentId: 1002,
  },
  {
    id: 3,
    name: 'Suite Junior',
    slug: 'suite-junior',
    description:
      'Suite open space con zona giorno separata e divano letto singolo: ideale per famiglie con un bambino o per chi vuole più spazio dopo il sole di Citara o Maronti.',
    shortDescription: 'Open space fino a 3 ospiti, zona living.',
    pricePerNight: 160,
    maxGuests: 3,
    size: 35,
    bedType: 'king',
    thumbnail: ISCHIA_ROOM_IMAGES.suite.thumb,
    images: [...ISCHIA_ROOM_IMAGES.suite.gallery],
    amenities: ['Wi‑Fi', 'Smart TV', 'Zona living', 'Cassaforte', 'Aria condizionata', 'Colazione inclusa'],
    isAvailable: true,
    featured: true,
    smoobuApartmentId: 1003,
  },
  {
    id: 4,
    name: 'Camera Familiare',
    slug: 'camera-familiare',
    description:
      'Due ambienti comunicanti con letto matrimoniale e letti singoli, pensata per chi esplora l’isola in quattro. Bagno ampio con vasca, utile dopo una giornata in barca lungo la costa.',
    shortDescription: 'Fino a 4 ospiti, due ambienti, bagno con vasca.',
    pricePerNight: 140,
    maxGuests: 4,
    size: 30,
    bedType: 'twin',
    thumbnail: ISCHIA_ROOM_IMAGES.family.thumb,
    images: [...ISCHIA_ROOM_IMAGES.family.gallery],
    amenities: ['Wi‑Fi', 'TV', 'Frigorifero', 'Angolo tè', 'Aria condizionata', 'Colazione inclusa'],
    isAvailable: true,
    featured: false,
    smoobuApartmentId: 1004,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return MOCK_ROOMS.find((r) => r.slug === slug);
}

export function getRoomById(id: number): Room | undefined {
  return MOCK_ROOMS.find((r) => r.id === id);
}
