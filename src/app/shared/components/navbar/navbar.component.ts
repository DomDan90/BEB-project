import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly brandLogoSrc = 'https://picsum.photos/seed/bnb-logo/200/56';
  readonly brandLogoAlt = 'Logo B&B — torna alla homepage';
}
