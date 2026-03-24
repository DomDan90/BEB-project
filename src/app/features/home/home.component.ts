import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { RoomsPreviewComponent } from './sections/rooms-preview/rooms-preview.component';
import { AboutSectionComponent } from './sections/about-section/about-section.component';
import { ServicesSectionComponent } from './sections/services-section/services-section.component';
import { GallerySectionComponent } from './sections/gallery/gallery-section.component';
import { ReviewsSectionComponent } from './sections/reviews-section/reviews-section.component';
import { LocationSectionComponent } from './sections/location-section/location-section.component';

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
export class HomeComponent {}
