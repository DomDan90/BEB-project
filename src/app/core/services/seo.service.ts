import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { BnbConfigService } from './bnb-config.service';
import type { PageSeoConfig } from '../config/pages-seo.config';
import type { BnbHours } from '../config/bnb.config';

const JSON_LD_ID = 'app-jsonld-bnb';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const TWITTER_CARD = 'summary_large_image';

export type RobotsMeta = 'index,follow' | 'noindex,follow';

export type SeoUpdateParams = {
  pageTitle: string; // parte sinistra (verra' completata con separatore + nome B&B)
  description: string;
  pageKeywords: string[]; // keywords specifiche pagina; verranno unite a keywords globali
  canonicalUrl: string; // assoluta
  ogImage?: string; // assoluta
  robots: RobotsMeta;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly bnb = inject(BnbConfigService);

  updateSeoForPage(page: PageSeoConfig, overrides?: Partial<Pick<SeoUpdateParams, 'ogImage' | 'pageKeywords' | 'description'>>): void {
    const ogImage = overrides?.ogImage ?? page.ogImage ?? this.bnb.seo.ogImage;
    const description = overrides?.description ?? page.description;
    const pageKeywords = overrides?.pageKeywords ?? page.keywords;

    // Title univoco: titolo pagina + separatore + nome B&B
    const title = `${page.title}${this.bnb.seo.separator}${this.bnb.identity.name}`;

    const canonicalUrl = this.normalizeCanonicalUrl(page.canonicalPath);

    const keywords = [...this.bnb.seo.keywordsGlobal, ...pageKeywords]
      .map((k) => k.trim())
      .filter(Boolean);

    this.setTitleAndBaseMeta({
      pageTitle: title,
      description,
      keywords,
      canonicalUrl,
      ogImage,
      robots: page.robots,
    });

    this.writeBedAndBreakfastJsonLd({
      canonicalUrl,
      description,
      ogImage,
      hours: this.bnb.hours,
    });
  }

  updateSeo(params: SeoUpdateParams): void {
    const canonicalUrl = params.canonicalUrl;
    const ogImage = params.ogImage ?? this.bnb.seo.ogImage;
    const title = `${params.pageTitle}${this.bnb.seo.separator}${this.bnb.identity.name}`;
    const keywords = [...this.bnb.seo.keywordsGlobal, ...params.pageKeywords].map((k) => k.trim()).filter(Boolean);

    this.setTitleAndBaseMeta({
      pageTitle: title,
      description: params.description,
      keywords,
      canonicalUrl,
      ogImage,
      robots: params.robots,
    });

    this.writeBedAndBreakfastJsonLd({
      canonicalUrl,
      description: params.description,
      ogImage,
      hours: this.bnb.hours,
    });
  }

  /**
   * Backward compat: mantenuto per componenti non aggiornati.
   * Gestisce title/description/OG/canonical e genera JSON-LD BedAndBreakfast.
   */
  updateMeta(title: string, description: string, image?: string, canonical?: string): void {
    const ogImage = image ?? this.bnb.seo.ogImage;
    const canonicalUrl = canonical ?? this.normalizeCanonicalUrl('/');

    this.setTitleAndBaseMeta({
      pageTitle: title,
      description,
      keywords: this.bnb.seo.keywordsGlobal,
      canonicalUrl,
      ogImage,
      robots: 'index,follow',
    });

    this.writeBedAndBreakfastJsonLd({
      canonicalUrl,
      description,
      ogImage,
      hours: this.bnb.hours,
    });
  }

  private setOrUpdateLink(rel: string, href: string): void {
    let link = this.document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private normalizeCanonicalUrl(canonicalPath: string): string {
    if (canonicalPath.startsWith('http://') || canonicalPath.startsWith('https://')) {
      return canonicalPath;
    }
    const base = this.bnb.seo.urlSite.replace(/\/+$/, '');
    const path = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    return `${base}${path}`;
  }

  private setTitleAndBaseMeta(params: {
    pageTitle: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage: string;
    robots: RobotsMeta;
  }): void {
    const { pageTitle, description, keywords, canonicalUrl, ogImage, robots } = params;

    // Favicon white-label (HTML base puo' essere riutilizzato senza tocchi).
    this.setOrUpdateIcon();

    // Title + description
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: this.bnb.identity.legalName });
    this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
    this.meta.updateTag({ name: 'robots', content: robots });

    // Canonical
    this.setOrUpdateLink('canonical', canonicalUrl);

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: this.bnb.seo.schemaType });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: String(OG_IMAGE_WIDTH) });
    this.meta.updateTag({ property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: this.bnb.identity.name });
    this.meta.updateTag({ property: 'og:locale', content: this.bnb.seo.locale });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: TWITTER_CARD });
    this.meta.updateTag({ name: 'twitter:site', content: this.bnb.seo.twitterHandle });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });
  }

  private setOrUpdateIcon(): void {
    const faviconPath = this.bnb.identity.faviconPath;
    if (!faviconPath) {
      return;
    }
    let link = this.document.querySelector(`link[rel="icon"]`) as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      this.document.head.appendChild(link);
    }
    link.href = faviconPath;
    link.type = link.type || 'image/x-icon';
  }

  private writeBedAndBreakfastJsonLd(params: {
    canonicalUrl: string;
    description: string;
    ogImage: string;
    hours: BnbHours;
  }): void {
    const sameAs = [
      this.bnb.social.instagramUrl,
      this.bnb.social.facebookUrl,
      this.bnb.social.whatsappUrl,
      this.bnb.social.tripAdvisorUrl,
    ].filter((u) => !!u && u !== '#');

    const schema = {
      '@context': 'https://schema.org',
      '@type': this.bnb.seo.schemaType,
      name: this.bnb.identity.name,
      description: params.description,
      url: params.canonicalUrl,
      telephone: this.bnb.contacts.phone.general.display,
      image: params.ogImage,
      priceRange: this.bnb.seo.priceRange,
      starRating: this.bnb.seo.starRating,
      checkinTime: `${params.hours.checkIn.from} - ${params.hours.checkIn.to}`,
      checkoutTime: params.hours.checkOutBy,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.bnb.contacts.address.street,
        addressLocality: this.bnb.contacts.address.city,
        addressRegion: this.bnb.contacts.address.region,
        postalCode: this.bnb.contacts.address.postalCode,
        addressCountry: this.bnb.contacts.address.countryCode,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: this.bnb.geo.latitude,
        longitude: this.bnb.geo.longitude,
      },
      ...(sameAs.length ? { sameAs } : {}),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: this.bnb.seo.starRating,
        bestRating: 5,
      },
    };

    this.writeJsonLd(schema);
  }

  private writeJsonLd(payload: object): void {
    let el = this.document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
    if (!el) {
      el = this.document.createElement('script');
      el.id = JSON_LD_ID;
      el.type = 'application/ld+json';
      this.document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);
  }
}
