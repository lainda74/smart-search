import type { DetailedHTMLProps, HTMLAttributes, Ref } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'smart-search': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        theme?: string;
        items?: unknown[];
        ref?: Ref<HTMLElement>;
        placeholder?: string;
      };
    }
  }
}
