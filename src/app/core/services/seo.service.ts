import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo?: { latitude: number; longitude: number };
  image?: string;
  priceRange?: string;
}

export interface BnBSchemaData extends LocalBusinessData {
  numberOfRooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
}

const JSON_LD_ID = 'app-jsonld-bnb';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateMeta(title: string, description: string, image?: string, canonical?: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
    }
    if (canonical) {
      this.setOrUpdateLink('canonical', canonical);
    }
  }

  setLocalBusinessSchema(data: LocalBusinessData): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      description: data.description,
      url: data.url,
      telephone: data.telephone,
      image: data.image,
      priceRange: data.priceRange,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.street,
        addressLocality: data.address.city,
        addressRegion: data.address.region,
        postalCode: data.address.postalCode,
        addressCountry: data.address.country,
      },
      ...(data.geo
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: data.geo.latitude,
              longitude: data.geo.longitude,
            },
          }
        : {}),
    };
    this.writeJsonLd(schema);
  }

  setBedAndBreakfastSchema(data: BnBSchemaData): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BedAndBreakfast',
      name: data.name,
      description: data.description,
      url: data.url,
      telephone: data.telephone,
      image: data.image,
      numberOfRooms: data.numberOfRooms,
      checkinTime: data.checkInTime,
      checkoutTime: data.checkOutTime,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.street,
        addressLocality: data.address.city,
        addressRegion: data.address.region,
        postalCode: data.address.postalCode,
        addressCountry: data.address.country,
      },
      ...(data.geo
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: data.geo.latitude,
              longitude: data.geo.longitude,
            },
          }
        : {}),
    };
    this.writeJsonLd(schema);
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
