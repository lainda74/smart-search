/**
 * Represents a single search result item.
 * This model is used across the library for filtering and display logic.
 */
export interface SearchResultType {
  id: string;
  title: string;
  description: string;
  category: 'account' | 'transaction' | 'customer' | 'entity' | string;
  metadata?: Record<string, any>;
}
