import type { TranslationObject } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, of } from 'rxjs';

/** Loader SSR/prerender: legge i JSON da disco (HttpClient non serve `/assets/...` durante il prerender). */
export class TranslateFsLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const fileName = `${lang}.json`;
    const candidates = [
      join(process.cwd(), 'src', 'assets', 'i18n', fileName),
      join(process.cwd(), 'dist', 'BEB-project', 'browser', 'assets', 'i18n', fileName),
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        try {
          return of(JSON.parse(readFileSync(p, 'utf8')) as TranslationObject);
        } catch {
          return of({} as TranslationObject);
        }
      }
    }
    return of({} as TranslationObject);
  }
}
