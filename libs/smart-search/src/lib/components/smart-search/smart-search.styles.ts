import { css } from 'lit';

export const smartSearchStyles = css`
  :host {
    display: block;
    font-family: var(--_ss-font-family);
    box-sizing: border-box;
  }

  :host *, :host *::before, :host *::after {
    box-sizing: inherit;
  }

  .container { position: relative; width: 100%; }

  input {
    width: 100%;
    min-height: 48px;
    padding: 0 10px;
    border: 1px solid var(--_ss-border);
    border-radius: 6px;
    background: var(--_ss-bg);
    color: var(--_ss-text);
    outline: none;
  }

  input:focus {
    border-color: var(--_ss-primary);
    box-shadow: 0 0 0 2px var(--_ss-selected);
  }

  .dropdown {
    position: fixed;
    z-index: 1000;
    background: var(--_ss-bg);
    border: 1px solid var(--_ss-border);
    display: none;
    flex-direction: column;
    height: fit-content;
    overflow-y: auto;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .dropdown.visible { display: flex; }

  .item {
    padding: 10px;
    cursor: pointer;
    color: var(--_ss-text);
  }

  .item:hover, .item.selected { 
    background: var(--_ss-selected); 
  }

  mark {
    background: transparent;
    color: var(--_ss-primary);
    font-weight: bold;
    text-decoration: underline;
  }

  .loading-state, .empty-state {
    padding: 15px;
    text-align: center;
    color: var(--_ss-text);
    opacity: 0.7;
    font-size: 0.9em;
  }
`;
