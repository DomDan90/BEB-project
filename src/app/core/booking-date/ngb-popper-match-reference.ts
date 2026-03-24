import type { Options } from '@popperjs/core';

/** Larghezza da usare: tutto l’input-group (data + icona) se c’è, altrimenti il reference Popper. */
function referenceWidthEl(ref: HTMLElement): HTMLElement {
  return (ref.closest('.input-group') as HTMLElement | null) ?? ref;
}

function measureWidth(ref: HTMLElement): number {
  const el = referenceWidthEl(ref);
  return Math.round(el.getBoundingClientRect().width);
}

/**
 * Allinea larghezza del floating element al trigger (stessa larghezza del campo visibile).
 * Per le date combinare con `[positionTarget]="inputGroupRef"` sull’input così Popper usa tutto il gruppo.
 */
export function ngbPopperMatchReferenceWidth(options: Partial<Options>): Partial<Options> {
  const modifiers = options.modifiers ?? [];
  return {
    ...options,
    modifiers: [
      ...modifiers,
      {
        name: 'sameWidth',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: ({ state }) => {
          const ref = state.elements.reference as HTMLElement;
          const box = referenceWidthEl(ref).getBoundingClientRect();
          let w = measureWidth(ref);
          const vw = typeof window !== 'undefined' ? window.innerWidth : w;
          const margin = 12;
          const spaceRight = vw - box.left - margin;
          if (w > spaceRight) {
            w = Math.max(200, Math.round(spaceRight));
          }
          state.styles['popper'].width = `${w}px`;
        },
        effect: ({ state }) => {
          const ref = state.elements.reference as HTMLElement;
          const pop = state.elements.popper as HTMLElement;
          const apply = () => {
            let w = measureWidth(ref);
            const vw = window.innerWidth;
            const margin = 12;
            const left = referenceWidthEl(ref).getBoundingClientRect().left;
            const spaceRight = vw - left - margin;
            if (w > spaceRight) {
              w = Math.max(200, Math.round(spaceRight));
            }
            pop.style.width = `${w}px`;
            pop.style.minWidth = `${w}px`;
            pop.style.maxWidth = `${w}px`;
            pop.style.boxSizing = 'border-box';
          };
          apply();
          window.addEventListener('resize', apply);
          return () => {
            window.removeEventListener('resize', apply);
            pop.style.width = '';
            pop.style.minWidth = '';
            pop.style.maxWidth = '';
            pop.style.boxSizing = '';
          };
        },
      },
    ],
  };
}
