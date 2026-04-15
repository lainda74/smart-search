import { css } from 'lit';

/**
 * Shared theme variables for the Smart Search library.
 * These define the standard tokens used across all components.
 */
export const themeVariables = css`
  :host {
    /* Internal Mapping with Global Hooks */
    --_ss-primary:  var(--ss-primary, #3b82f6);
    --_ss-bg:       var(--ss-bg, #ffffff);
    --_ss-text:     var(--ss-text, #111111);
    --_ss-muted:    var(--ss-muted, #666666);
    --_ss-border:   var(--ss-border, #dddddd);
    --_ss-hover:    var(--ss-hover, #f5f5f5);
    --_ss-selected: var(--ss-selected, #e0edff);
    --_ss-font-family: var(--ss-font-family, system-ui);
  }

  :host([theme='dark']) {
    --_ss-bg:       var(--ss-bg-dark, #111111);
    --_ss-text:     var(--ss-text-dark, #ffffff);
    --_ss-muted:    var(--ss-muted-dark, #aaaaaa);
    --_ss-border:   var(--ss-border-dark, #333333);
    --_ss-hover:    var(--ss-hover-dark, #222222);
    --_ss-selected: var(--ss-selected-dark, #1e3a8a);
  }
`;
