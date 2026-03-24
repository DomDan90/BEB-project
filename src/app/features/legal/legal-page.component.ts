import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** Placeholder condiviso per route legali (titolo da `data.title`). */
@Component({
  standalone: true,
  template: `
    <main class="legal-page container-bnb py-5">
      <h1 class="legal-page__title">{{ title }}</h1>
      <p class="legal-page__lead text-body-secondary">Pagina in costruzione — contenuto legale da integrare.</p>
    </main>
  `,
  styleUrl: './legal-page.component.scss',
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = (this.route.snapshot.data['title'] as string) ?? 'Documento legale';
}
