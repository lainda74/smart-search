import { SearchResultType } from '@temp-nx/smart-search';
import { mockData } from '../../mock-data/search-results.mock-data';

/**
 * Simulates an asynchronous API call to fetch search results.
 */
export async function getSearchResults(): Promise<SearchResultType[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
}
