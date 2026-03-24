import { Review } from '../models/review.model';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Laura M.',
    rating: 5,
    date: '2025-11-12',
    comment:
      'Posizione perfetta, colazione con torte fatte in casa e proprietari disponibilissimi. Torneremo in primavera!',
    source: 'google',
    verified: true,
  },
  {
    id: 2,
    author: 'Marco e Giulia',
    rating: 5,
    date: '2025-10-28',
    comment:
      'Camera Deluxe pulitissima, silenziosa nonostante fossimo in centro. Il balconcino la sera è stato un plus.',
    source: 'booking',
    verified: true,
  },
  {
    id: 3,
    author: 'Sophie L.',
    rating: 4,
    date: '2025-09-03',
    comment:
      'Lovely B&B, authentic Italian breakfast. Only small note: stairs are steep (typical old building).',
    source: 'airbnb',
    verified: true,
  },
  {
    id: 4,
    author: 'Andrea P.',
    rating: 5,
    date: '2025-08-19',
    comment:
      'Abbiamo soggiornato in Suite Junior con nostra figlia: spaziosa e ben organizzata. Consigliatissima.',
    source: 'google',
    verified: true,
  },
  {
    id: 5,
    author: 'Elena R.',
    rating: 4,
    date: '2025-07-07',
    comment:
      'Ottimo rapporto qualità-prezzo, parcheggio convenzionato a due minuti. Personale cordiale.',
    source: 'booking',
    verified: true,
  },
  {
    id: 6,
    author: 'Famiglia Verdi',
    rating: 5,
    date: '2025-06-22',
    comment:
      'Camera familiare ideale per noi con due bambini. Letti comodi e bagno grande. Esperienza da ripetere.',
    source: 'direct',
    verified: false,
  },
];
