export type BnbAddress = {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
};

export type BnbPhone = {
  display: string;
  tel: string;
};

export type BnbHours = {
  checkIn: { from: string; to: string };
  checkOutBy: string;
  reception: string;
};

export type BnbSeoConfig = {
  titleDefault: string;
  separator: string;
  descriptionDefault: string;
  keywordsGlobal: string[];
  urlSite: string;
  ogImage: string;
  twitterHandle: string;
  locale: string;
  schemaType: 'BedAndBreakfast' | string;
  priceRange: string;
  starRating: number;
};

export type BnbAnalyticsConfig = {
  googleAnalyticsId: string;
  tagManagerId: string;
  cookieBotId: string;
};

export type BnbConfig = {
  identity: {
    name: string;
    tagline: string;
    legalName: string;
    foundationYear: number;
    logoPath: string;
    faviconPath: string;
    logoAlt: string;
    logoSubtitle?: string;
  };
  contacts: {
    address: BnbAddress;
    phone: {
      general: BnbPhone;
      reservations: BnbPhone;
    };
    email: {
      general: string;
      reservations: string;
    };
  };
  geo: {
    latitude: number;
    longitude: number;
    googleMapsUrl: string;
  };
  hours: BnbHours;
  social: {
    instagramUrl: string;
    facebookUrl: string;
    whatsappUrl: string;
    tripAdvisorUrl: string;
  };
  booking: {
    smoobuApiKey: string;
    minimumStayNights: number;
    maxGuests: number;
    currency: 'EUR';
    // Solo per lotti/istanze reali: base URL API se disponibile.
    // In questa demo l'integrazione è mockata.
    smoobuApiBaseUrl?: string;
  };
  theme: {
    colors: {
      primary: string;
      accent: string;
    };
    images: {
      heroBackground: string;
      facilitiesBackground: string;
      heroOgImage: string;
    };
  };
  seo: BnbSeoConfig;
  analytics: BnbAnalyticsConfig;
};

export const bnbConfig: BnbConfig = {
  identity: {
    name: 'B&B Ischia',
    tagline: 'Ospitalita a Ischia, tra mare e terme: camere curate, colazione con prodotti dell’isola e consigli per spiagge e borghi.',
    legalName: 'B&B Ischia',
    foundationYear: 2026,
    // Branding white-label (file locali in src/assets)
    logoPath: '/assets/bEb-esempio/logo/logo.png',
    faviconPath: '/assets/bEb-esempio/logo/logo-icon.png',
    logoAlt: 'B&B Ischia - logo',
    logoSubtitle: 'MARE \u00b7 TERME \u00b7 RELAX',
  },
  contacts: {
    address: {
      street: 'Via Roma 42',
      city: 'Ischia',
      region: 'NA',
      postalCode: '80077',
      country: 'Italia',
      countryCode: 'IT',
    },
    phone: {
      general: {
        display: '+39 081 333 0142',
        tel: '+390813330142',
      },
      reservations: {
        display: '+39 081 333 0142',
        tel: '+390813330142',
      },
    },
    email: {
      general: 'info@beb-ischia-esempio.it',
      reservations: 'prenotazioni@beb-ischia-esempio.it',
    },
  },
  geo: {
    latitude: 40.7389,
    longitude: 13.951,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.7389,13.951',
  },
  hours: {
    checkIn: { from: '15:00', to: '20:00' },
    checkOutBy: '10:00',
    reception: 'Tutti i giorni 08:00 - 20:00',
  },
  social: {
    instagramUrl: 'https://www.instagram.com/beb-ischia/',
    facebookUrl: 'https://www.facebook.com/beb-ischia/',
    whatsappUrl: 'https://wa.me/390813330142',
    tripAdvisorUrl: 'https://www.tripadvisor.com/',
  },
  booking: {
    smoobuApiKey: '',
    minimumStayNights: 2,
    maxGuests: 4,
    currency: 'EUR',
  },
  theme: {
    colors: {
      primary: '#222222',
      accent: '#f8b600',
    },
    images: {
      // Home / hero: bEb-home-esempio
      heroBackground: '/assets/bEb-esempio/bEb-home-esempio.jpg',
      heroOgImage: '/assets/bEb-esempio/bEb-home-esempio.jpg',
      // Servizi / facilities: tra le 3 foto disponibili
      facilitiesBackground: '/assets/bEb-esempio/bEb-esempio-2.jpg',
    },
  },
  seo: {
    titleDefault: 'Prenotazione diretta',
    separator: ' | ',
    descriptionDefault: 'Prenota il tuo soggiorno a Ischia: B&B vicino al mare, colazione inclusa, terme e spiagge a portata di mano.',
    keywordsGlobal: [
      'B&B Ischia',
      'bed and breakfast Ischia',
      'camere Ischia',
      'Ischia Porto',
      'prenotazione diretta',
      'colazione inclusa',
      'terme e spiagge',
    ],
    urlSite: 'https://www.beb-ischia-esempio.it',
    ogImage: '/assets/bEb-esempio/bEb-home-esempio.jpg',
    twitterHandle: '@bebischia',
    locale: 'it_IT',
    schemaType: 'BedAndBreakfast',
    priceRange: '80-160 EUR',
    starRating: 4.5,
  },
  analytics: {
    googleAnalyticsId: '',
    tagManagerId: '',
    cookieBotId: '',
  },
};

