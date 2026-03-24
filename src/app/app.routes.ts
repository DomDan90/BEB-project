import { Routes } from '@angular/router';
import { bookingConfirmGuard, bookingSuccessGuard } from './core/guards/booking.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'camere',
    loadComponent: () =>
      import('./features/rooms/rooms-list/rooms-list.component').then((m) => m.RoomsListComponent),
  },
  {
    path: 'camere/:slug',
    loadComponent: () =>
      import('./features/rooms/room-detail/room-detail.component').then((m) => m.RoomDetailComponent),
  },
  {
    path: 'prenota',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/booking/booking-form/booking-form.component').then(
            (m) => m.BookingFormComponent,
          ),
      },
      {
        path: 'conferma',
        canActivate: [bookingConfirmGuard],
        loadComponent: () =>
          import('./features/booking/booking-confirm/booking-confirm.component').then(
            (m) => m.BookingConfirmComponent,
          ),
      },
      {
        path: 'successo',
        canActivate: [bookingSuccessGuard],
        loadComponent: () =>
          import('./features/booking/booking-success/booking-success.component').then(
            (m) => m.BookingSuccessComponent,
          ),
      },
    ],
  },
  {
    path: 'chi-siamo',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'galleria',
    loadComponent: () =>
      import('./features/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'contatti',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./features/legal/legal-page.component').then((m) => m.LegalPageComponent),
    data: { titleKey: 'legal.privacyTitle' },
  },
  {
    path: 'cookie-policy',
    loadComponent: () =>
      import('./features/legal/legal-page.component').then((m) => m.LegalPageComponent),
    data: { titleKey: 'legal.cookieTitle' },
  },
  { path: '**', redirectTo: '' },
];
