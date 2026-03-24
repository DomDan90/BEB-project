export interface Review {
  id: number;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  source: 'google' | 'booking' | 'airbnb' | 'direct' | 'tripadvisor';
  verified: boolean;
}
