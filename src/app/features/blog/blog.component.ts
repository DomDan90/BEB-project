import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';
import { pagesSeoConfig } from '../../core/config/pages-seo.config';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeoForPage(pagesSeoConfig.blog);
  }
}
