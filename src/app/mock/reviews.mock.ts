import { Review } from '../models/review.model';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Laura M.',
    rating: 5,
    date: '2025-11-12',
    comment:
      'Posizione perfetta a Ischia Porto, colazione con torte fatte in casa e proprietari pieni di consigli sulle spiagge. Torneremo in primavera!',
    source: 'google',
    verified: true,
  },
  {
    id: 2,
    author: 'Marco e Giulia',
    rating: 5,
    date: '2025-10-28',
    comment:
      'Camera deluxe pulitissima, silenziosa nonostante fossimo vicino al centro. Il balconcino con vista sull’isola la sera è stato un plus.',
    source: 'booking',
    verified: true,
  },
  {
    id: 3,
    author: 'Sophie L.',
    rating: 4,
    date: '2025-09-03',
    comment:
      'Lovely B&B on Ischia, authentic breakfast with local lemons. Short walk to the ferry — stairs a bit steep, typical of the island.',
    source: 'airbnb',
    verified: true,
  },
  {
    id: 4,
    author: 'Andrea P.',
    rating: 5,
    date: '2025-08-19',
    comment:
      'Suite junior ideale con nostra figlia dopo le giornate a Maronti e Sant’Angelo. Spaziosa e ben organizzata.',
    source: 'google',
    verified: true,
  },
  {
    id: 5,
    author: 'Elena R.',
    rating: 4,
    date: '2025-07-07',
    comment:
      'Ottimo rapporto qualità-prezzo, parcheggio convenzionato a pochi minuti. Personale cordiale e disponibile per i traghetti.',
    source: 'booking',
    verified: true,
  },
  {
    id: 6,
    author: 'Famiglia Verdi',
    rating: 5,
    date: '2025-06-22',
    comment:
      'Camera familiare perfetta con due bambini: comoda per girare l’isola in bus. Letti comodi dopo il sole e il mare.',
    source: 'direct',
    verified: false,
  },
];
