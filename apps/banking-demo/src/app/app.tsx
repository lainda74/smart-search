import { useState, useRef, useEffect, useCallback } from 'react';
import '@temp-nx/smart-search';
import { getSearchResults } from './services/search.service';
import { Header } from './components/header/header';
import styles from './app.module.css';
import { ThemeProvider } from './contexts/ThemeContext';

interface SmartSearchElement extends HTMLElement {
  loading?: boolean;
  items?: unknown;
}

export function App() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const searchRef = useRef<HTMLElement | null>(null);

  const handleSelect = useCallback((e: CustomEvent) => {
    setSelectedItem(e.detail);
  }, []);

  const loadSearchData = useCallback(async (el: SmartSearchElement) => {
    el.loading = true;
    try {
      const data = await getSearchResults();
      el.items = data;
      el.addEventListener('item-selected', handleSelect as EventListener);
    } catch (error) {
      console.error('Failed to fetch search data:', error);
    } finally {
      el.loading = false;
    }
  }, [handleSelect]);

  useEffect(() => {
    const el = searchRef.current as SmartSearchElement | null;
    if (!el) return;

    loadSearchData(el);

    return () => {
      el.removeEventListener('item-selected', handleSelect as EventListener);
    };
  }, [handleSelect, loadSearchData]);

  return (
    <ThemeProvider>
      <div className={styles.dashboard}>
        <Header searchRef={searchRef} />

        <main className={styles['dashboard-content']}>
          <section>
            <h2>Selected Item:</h2>
            {selectedItem ? (
              <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
            ) : (
              <p>No option has been selected yet.</p>
            )}
          </section>
          <br />
          <section>
            <h2>Smart Search Component API</h2>
            <h3>Properties</h3>
            <ul>
              <li>
                <b>theme:</b> (string) - The theme of the component ('light' or
                'dark').
              </li>
              <li>
                <b>items:</b> (array) - The items to be displayed in the search
                results.
              </li>
              <li>
                <b>placeholder:</b> (string) - The placeholder text for the
                search input.
              </li>
              <li>
                <b>loading:</b> (boolean) - A boolean to indicate if the
                component is in a loading state.
              </li>
            </ul>
            <h3>Events</h3>
            <ul>
              <li>
                <b>item-selected:</b> (CustomEvent) - Fired when an item is
                selected from the search results. The selected item is
                available in the `detail` property of the event.
              </li>
            </ul>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
