import { LitElement, html, PropertyValues } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { computePosition, offset, flip, shift, size } from '@floating-ui/dom';
import { SearchResultType } from '../../models/search-result.model.js';
import { themeVariables } from '../../shared/theme-vars.js';
import { smartSearchStyles } from './smart-search.styles.js';

/**
 * Smart Search Component
 * 
 * @fires item-selected - Dispatched when a search result is selected.
 */
export class SmartSearch extends LitElement {
  // Public API
  @property({ type: Array }) items: SearchResultType[] = [];
  @property({ type: String }) placeholder = 'Search...';
  @property({ type: Number }) maxResults = 10;
  @property({ reflect: true }) theme: 'light' | 'dark' = 'light';
  @property({ type: Array }) filters: string[] = ['all'];
  @property({ type: Boolean }) loading = false;

  // Internal State
  @state() private query = '';
  @state() private isOpen = false;
  @state() private selectedIndex = -1;
  @state() private activeFilter = 'all';
  @state() private filteredResults: SearchResultType[] = [];

  @query('#dropdown') private dropdown?: HTMLElement;
  @query('#container') private container?: HTMLElement;

  private debounceTimer?: ReturnType<typeof setTimeout>;

  static override styles = [themeVariables, smartSearchStyles];

  override render() {
    const hasResults = this.filteredResults.length > 0;
    const show = this.isOpen && (hasResults || this.loading || (this.query.length > 0 && !hasResults));

    return html`
      <div id="container" class="container">
        <input
          .value=${this.query}
          placeholder=${this.placeholder}
          @input=${this.onInput}
          @focus=${() => (this.isOpen = true)}
          @keydown=${this.onKeyDown}
          role="combobox"
          aria-expanded=${show}
          aria-autocomplete="list"
          aria-controls="dropdown"
          aria-activedescendant=${this.selectedIndex >= 0 ? `option-${this.selectedIndex}` : ''}
        />

        <div id="dropdown" class=${classMap({ dropdown: true, visible: show })} role="listbox">
          ${this.loading ? html`
            <div class="loading-state">
              Loading...
            </div>
          ` : this.filteredResults.length > 0 ? html`
            ${this.filteredResults.map((item, i) => html`
              <div
                id="option-${i}"
                class=${classMap({ item: true, selected: this.selectedIndex === i })}
                role="option"
                aria-selected=${this.selectedIndex === i}
                @mouseenter=${() => (this.selectedIndex = i)}
                @click=${() => this.select(item)}
              >
                ${this.highlight(item.title)}
              </div>
            `)}
          ` : this.query.length > 0 ? html`
            <div class="empty-state">No results found for "${this.query}"</div>
          ` : ''}
        </div>
      </div>
    `;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this.onOutsideClick);
    window.removeEventListener('resize', this.updatePosition);
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  override updated(changed: PropertyValues) {
    if (changed.has('query') || changed.has('items') || changed.has('activeFilter')) {
      this.filteredResults = this.computeResults();
    }

    if (changed.has('isOpen')) {
      if (this.isOpen) {
        document.addEventListener('pointerdown', this.onOutsideClick);
        window.addEventListener('resize', this.updatePosition);
        this.updatePosition();
      } else {
        document.removeEventListener('pointerdown', this.onOutsideClick);
        window.removeEventListener('resize', this.updatePosition);
      }
    } else if (this.isOpen) {
      this.updatePosition();
    }
  }

  private computeResults(): SearchResultType[] {
    let res = this.items;

    if (this.activeFilter !== 'all') {
      res = res.filter(i => i.category === this.activeFilter);
    }

    if (this.query) {
      const q = this.query.toLowerCase();
      res = res.filter(i => i.title.toLowerCase().includes(q));
    }

    return res.slice(0, this.maxResults);
  }

  private onInput(e: InputEvent) {
    clearTimeout(this.debounceTimer);
    const val = (e.target as HTMLInputElement).value;

    this.debounceTimer = setTimeout(() => {
      this.query = val;
      this.selectedIndex = -1;
      this.isOpen = true;
    }, 250);
  }

  private onKeyDown(e: KeyboardEvent) {
    const len = this.filteredResults.length;
    if (!len) return;

    if (e.key === 'ArrowDown') this.selectedIndex = (this.selectedIndex + 1) % len;
    if (e.key === 'ArrowUp') this.selectedIndex = (this.selectedIndex - 1 + len) % len;
    if (e.key === 'Enter') this.select(this.filteredResults[this.selectedIndex]);
    if (e.key === 'Escape') this.isOpen = false;
  }

  private select(item: SearchResultType) {
    this.query = item.title;
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('item-selected', { detail: item, bubbles: true, composed: true }));
  }

  private onOutsideClick = (e: any) => {
    if (!e.composedPath().includes(this)) {
      this.isOpen = false;
    }
  };

  private updatePosition = async () => {
    if (!this.container || !this.dropdown) {
      return;
    }

    const { x, y } = await computePosition(this.container, this.dropdown, {
      placement: 'bottom-start',
      middleware: [offset(4), flip(), shift(), size({
        apply: ({ rects, elements }) => {
          Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
        }
      })]
    });

    Object.assign(this.dropdown.style, { left: `${x}px`, top: `${y}px` });
  };

  private escape(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private highlight(text: string) {
    if (!this.query) {
      return text;
    }
    const safe = this.escape(this.query);
    const parts = text.split(new RegExp(`(${safe})`, 'gi'));

    return parts.map((p: string) =>
      p.toLowerCase() === this.query.toLowerCase()
        ? html`<mark>${p}</mark>`
        : p
    );
  }
}

if (!customElements.get('smart-search')) {
  customElements.define('smart-search', SmartSearch);
}

declare global {
  interface HTMLElementTagNameMap {
    'smart-search': SmartSearch;
  }
}
