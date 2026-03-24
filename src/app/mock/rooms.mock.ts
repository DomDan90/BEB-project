import { Room } from '../models/room.model';

const seedImg = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    name: 'Camera Standard',
    slug: 'camera-standard',
    description:
      'Camera accogliente con vista sul cortile interno, arredi in legno chiaro e bagno privato con doccia. Ideale per soggiorni brevi nel cuore del centro storico.',
    shortDescription: 'Comfort essenziale per due ospiti, bagno privato.',
    pricePerNight: 80,
    maxGuests: 2,
    size: 18,
    bedType: 'double',
    thumbnail: seedImg('room-1'),
    images: [seedImg('room-1', 1200, 800), seedImg('room-1b', 1200, 800), seedImg('room-1c', 1200, 800)],
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
      'Spaziosa camera deluxe con balconcino, minifrigo e set da tè. Letto queen size e biancheria di cotone premium per un riposo rigenerante.',
    shortDescription: 'Balconcino, minifrigo e letto queen size.',
    pricePerNight: 120,
    maxGuests: 2,
    size: 25,
    bedType: 'queen',
    thumbnail: seedImg('room-2'),
    images: [seedImg('room-2', 1200, 800), seedImg('room-2b', 1200, 800), seedImg('room-2c', 1200, 800)],
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
      'Suite open space con zona giorno separata, divano letto singolo e scrivania. Perfetta per famiglie con un bambino o per chi desidera più spazio.',
    shortDescription: 'Open space fino a 3 ospiti, zona living.',
    pricePerNight: 160,
    maxGuests: 3,
    size: 35,
    bedType: 'king',
    thumbnail: seedImg('room-3'),
    images: [seedImg('room-3', 1200, 800), seedImg('room-3b', 1200, 800), seedImg('room-3c', 1200, 800)],
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
      'Due ambienti comunicanti con letto matrimoniale e letti singoli, ideale per famiglie. Bagno grande con vasca e set cortesia bio.',
    shortDescription: 'Fino a 4 ospiti, due ambienti, bagno con vasca.',
    pricePerNight: 140,
    maxGuests: 4,
    size: 30,
    bedType: 'twin',
    thumbnail: seedImg('room-4'),
    images: [seedImg('room-4', 1200, 800), seedImg('room-4b', 1200, 800), seedImg('room-4c', 1200, 800)],
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
