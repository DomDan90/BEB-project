import { RenderMode, ServerRoute } from '@angular/ssr';
import { MOCK_ROOMS } from './mock/rooms.mock';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'camere/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MOCK_ROOMS.map((r) => ({ slug: r.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
