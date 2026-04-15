import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import App from './app';


// Mock the custom element
beforeAll(() => {
  if (!customElements.get('smart-search')) {
    customElements.define(
      'smart-search',
      class SmartSearch extends HTMLElement {}
    );
  }
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(baseElement).toBeTruthy();
  });
});
