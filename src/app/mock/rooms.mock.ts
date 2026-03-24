import { ISCHIA_ROOM_IMAGES } from '../core/media/ischia-media';
import { Room } from '../models/room.model';

export const MOCK_ROOMS: Room[] = [
  {
    id: 1,
    name: 'rooms.standard.name',
    slug: 'camera-standard',
    description: 'rooms.standard.description',
    shortDescription: 'rooms.standard.shortDescription',
    pricePerNight: 80,
    maxGuests: 2,
    size: 18,
    bedType: 'double',
    thumbnail: ISCHIA_ROOM_IMAGES.standard.thumb,
    images: [...ISCHIA_ROOM_IMAGES.standard.gallery],
    amenities: [
      'rooms.amenity.wifi',
      'rooms.amenity.tv',
      'rooms.amenity.ac',
      'rooms.amenity.privateBath',
      'rooms.amenity.breakfast',
    ],
    isAvailable: true,
    featured: false,
    smoobuApartmentId: 1001,
  },
  {
    id: 2,
    name: 'rooms.deluxe.name',
    slug: 'camera-deluxe',
    description: 'rooms.deluxe.description',
    shortDescription: 'rooms.deluxe.shortDescription',
    pricePerNight: 120,
    maxGuests: 2,
    size: 25,
    bedType: 'queen',
    thumbnail: ISCHIA_ROOM_IMAGES.deluxe.thumb,
    images: [...ISCHIA_ROOM_IMAGES.deluxe.gallery],
    amenities: [
      'rooms.amenity.wifi',
      'rooms.amenity.smartTv',
      'rooms.amenity.minibar',
      'rooms.amenity.balcony',
      'rooms.amenity.ac',
      'rooms.amenity.breakfast',
    ],
    isAvailable: true,
    featured: true,
    smoobuApartmentId: 1002,
  },
  {
    id: 3,
    name: 'rooms.suite.name',
    slug: 'suite-junior',
    description: 'rooms.suite.description',
    shortDescription: 'rooms.suite.shortDescription',
    pricePerNight: 160,
    maxGuests: 3,
    size: 35,
    bedType: 'king',
    thumbnail: ISCHIA_ROOM_IMAGES.suite.thumb,
    images: [...ISCHIA_ROOM_IMAGES.suite.gallery],
    amenities: [
      'rooms.amenity.wifi',
      'rooms.amenity.smartTv',
      'rooms.amenity.living',
      'rooms.amenity.safe',
      'rooms.amenity.ac',
      'rooms.amenity.breakfast',
    ],
    isAvailable: true,
    featured: true,
    smoobuApartmentId: 1003,
  },
  {
    id: 4,
    name: 'rooms.family.name',
    slug: 'camera-familiare',
    description: 'rooms.family.description',
    shortDescription: 'rooms.family.shortDescription',
    pricePerNight: 140,
    maxGuests: 4,
    size: 30,
    bedType: 'twin',
    thumbnail: ISCHIA_ROOM_IMAGES.family.thumb,
    images: [...ISCHIA_ROOM_IMAGES.family.gallery],
    amenities: [
      'rooms.amenity.wifi',
      'rooms.amenity.tv',
      'rooms.amenity.fridge',
      'rooms.amenity.teaCorner',
      'rooms.amenity.ac',
      'rooms.amenity.breakfast',
    ],
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
