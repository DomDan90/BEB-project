export type PageSeoKey =
  | 'home'
  | 'rooms'
  | 'about'
  | 'gallery'
  | 'contacts'
  | 'blog'
  | 'booking.form'
  | 'booking.confirm'
  | 'booking.success'
  | 'legal.privacy'
  | 'legal.cookie';

export type PageSeoConfig = {
  title: string; // parte sinistra (verra' completato con separatore + nome struttura)
  description: string; // 150-160 circa
  keywords: string[];
  canonicalPath: string; // percorso assoluto (inizia con /)
  ogImage?: string;
  robots: 'index,follow' | 'noindex,follow';
};

export const pagesSeoConfig: Record<PageSeoKey, PageSeoConfig> = {
  home: {
    title: 'Prenota a Ischia Porto',
    description:
      'Soggiorna in un B&B a Ischia tra mare e terme: camere curate, colazione con sapori locali e prenotazione diretta.',
    keywords: ['B&B Ischia Porto', 'prenotazione diretta', 'camere Ischia', 'terme e relax', 'colazione'],
    canonicalPath: '/',
    robots: 'index,follow',
  },
  rooms: {
    title: 'Le nostre camere a Ischia',
    description:
      'Scopri le camere e suite del B&B a Ischia Porto: comfort per coppie e famiglie, prezzi chiari e soggiorno senza intermediari.',
    keywords: ['camere Ischia Porto', 'suite Ischia', 'B&B Ischia', 'famiglie a Ischia', 'prenota online diretto'],
    canonicalPath: '/camere',
    robots: 'index,follow',
  },
  about: {
    title: 'Chi siamo a Ischia Porto',
    description:
      'Benvenuti nel nostro B&B a Ischia: ospitalita autentica, consigli locali e un soggiorno rilassante tra mare e terme.',
    keywords: ['chi siamo Ischia', 'ospitalita Ischia Porto', 'B&B Ischia Porto', 'consigli locali', 'relax'],
    canonicalPath: '/chi-siamo',
    robots: 'index,follow',
  },
  gallery: {
    title: 'Galleria immagini B&B Ischia',
    description:
      'Immagini del B&B a Ischia Porto: spazi, colazioni e dettagli. Idee per la tua vacanza tra mare, terme e relax.',
    keywords: ['galleria Ischia Porto', 'foto B&B Ischia', 'camere', 'terrazza', 'colazione'],
    canonicalPath: '/galleria',
    robots: 'index,follow',
  },
  contacts: {
    title: 'Contatti e posizione Ischia',
    description:
      'Indirizzo, contatti e mappa del B&B a Ischia Porto: raggiungici facilmente e pianifica il tuo soggiorno tra mare e terme.',
    keywords: ['contatti B&B Ischia', 'dove siamo Ischia', 'mappa Ischia Porto', 'tel e email', 'prenota Ischia'],
    canonicalPath: '/contatti',
    robots: 'index,follow',
  },
  blog: {
    title: 'Blog e guide per Ischia',
    description:
      'Notizie, eventi e consigli di viaggio per scoprire Ischia: itinerari, spiagge, terme e suggerimenti utili per il soggiorno.',
    keywords: ['blog Ischia', 'guide Ischia', 'eventi Ischia Porto', 'terme Ischia', 'itinerari'],
    canonicalPath: '/blog',
    robots: 'index,follow',
  },
  'booking.form': {
    title: 'Prenota a Ischia Porto',
    description:
      'Prenotazione diretta nel nostro B&B a Ischia Porto: scegli le date e la camera, invia la richiesta in pochi passaggi.',
    keywords: ['prenotazione diretta', 'B&B Ischia Porto', 'prenota camere', 'richiesta disponibilita'],
    canonicalPath: '/prenota',
    robots: 'index,follow',
  },
  'booking.confirm': {
    title: 'Conferma richiesta a Ischia',
    description:
      'Riepilogo e conferma della tua richiesta di prenotazione: dates, camera e dettagli nel nostro B&B a Ischia.',
    keywords: ['conferma prenotazione', 'B&B Ischia', 'richiesta di prenotazione'],
    canonicalPath: '/prenota/conferma',
    robots: 'index,follow',
  },
  'booking.success': {
    title: 'Prenotazione ricevuta - Ischia',
    description:
      'Grazie: abbiamo registrato la tua richiesta di prenotazione. Ti contatteremo a breve per confermare i dettagli.',
    keywords: ['prenotazione ricevuta', 'B&B Ischia', 'conferma soggiorno'],
    canonicalPath: '/prenota/successo',
    robots: 'index,follow',
  },
  'legal.privacy': {
    title: 'Privacy Policy',
    description: 'Informativa sulla privacy per il trattamento dei dati personali sul sito web.',
    keywords: ['privacy', 'GDPR', 'informativa dati personali'],
    canonicalPath: '/privacy-policy',
    robots: 'noindex,follow',
  },
  'legal.cookie': {
    title: 'Cookie Policy',
    description: 'Informativa sui cookie utilizzati dal sito e sulle tue preferenze di consenso.',
    keywords: ['cookie', 'GDPR', 'cookie policy'],
    canonicalPath: '/cookie-policy',
    robots: 'noindex,follow',
  },
};

