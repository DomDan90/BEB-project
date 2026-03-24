export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  maxGuests: number;
  size: number;
  bedType: 'single' | 'double' | 'queen' | 'king' | 'twin';
  images: string[];
  thumbnail: string;
  amenities: string[];
  isAvailable: boolean;
  featured: boolean;
  smoobuApartmentId?: number;
}
