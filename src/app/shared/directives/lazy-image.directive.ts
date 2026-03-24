import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'img[appLazyImage]',
  host: {
    loading: 'lazy',
    decoding: 'async',
  },
})
export class LazyImageDirective {}
