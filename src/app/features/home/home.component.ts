import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { HeroComponent } from './sections/hero/hero.component';
import { RoomsPreviewComponent } from './sections/rooms-preview/rooms-preview.component';
import { AboutSectionComponent } from './sections/about/about-section.component';
import { ServicesSectionComponent } from './sections/services/services-section.component';
import { GallerySectionComponent } from './sections/gallery/gallery-section.component';
import { ReviewsSectionComponent } from './sections/reviews/reviews-section.component';
import { LocationSectionComponent } from './sections/location/location-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    RoomsPreviewComponent,
    AboutSectionComponent,
    ServicesSectionComponent,
    GallerySectionComponent,
    ReviewsSectionComponent,
    LocationSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta(
      'B&B — Prenotazione diretta',
      'Bed & breakfast elegante in Italia: camere curate, colazione inclusa e prenotazione diretta online.',
    );
  }
}
