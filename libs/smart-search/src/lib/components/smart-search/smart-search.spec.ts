import { fireEvent } from '@testing-library/dom';
import { html, fixture, expect } from '@open-wc/testing';
import * as sinon from 'sinon';
import { SmartSearch } from './smart-search';
import './smart-search';

const mockItems = [
  { id: '1', title: 'Apple', category: 'fruit' },
  { id: '2', title: 'Banana', category: 'fruit' },
  { id: '3', title: 'Carrot', category: 'vegetable' },
];

describe('SmartSearch', () => {
  let element: SmartSearch;

  async function renderComponent(props: Partial<SmartSearch> = {}) {
    element = await fixture<SmartSearch>(
      html`
        <smart-search
          .items=${props.items ?? mockItems}
          .placeholder=${props.placeholder ?? 'Search...'}
          .maxResults=${props.maxResults ?? 10}
          .theme=${props.theme ?? 'light'}
          .filters=${props.filters ?? ['all', 'fruit', 'vegetable']}
          .loading=${props.loading ?? false}
        ></smart-search>
      `
    );
    await element.updateComplete;
    return element;
  }

  function getFromShadow(selector: string) {
    return element.shadowRoot!.querySelector(selector);
  }

  function getAllFromShadow(selector: string) {
    return element.shadowRoot!.querySelectorAll(selector);
  }

  it('should render the input with a placeholder', async () => {
    await renderComponent({ placeholder: 'Custom Placeholder' });
    const input = getFromShadow('input');
    expect(input).to.have.attribute('placeholder', 'Custom Placeholder');
  });

  it('should open the dropdown on input focus', async () => {
    await renderComponent();
    const input = getFromShadow('input')!;
    fireEvent.focus(input);
    await element.updateComplete;
    const dropdown = getFromShadow('#dropdown');
    expect(dropdown).to.have.class('visible');
  });

  it('should filter results based on user input', async () => {
    await renderComponent();
    const input = getFromShadow('input')! as HTMLInputElement;

    // Use a small delay to allow for debouncing
    fireEvent.input(input, { target: { value: 'Apple' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    await element.updateComplete;

    const items = getAllFromShadow('.item');
    expect(items.length).to.equal(1);
    expect(items[0]).to.contain.text('Apple');
  });

  it('should handle keyboard navigation', async () => {
    await renderComponent();
    const input = getFromShadow('input')! as HTMLInputElement;

    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'a' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    await element.updateComplete;

    expect(getAllFromShadow('.item').length).to.equal(3);

    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await element.updateComplete;
    expect(getFromShadow('.item.selected')).to.contain.text('Apple');

    // Navigate down again
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await element.updateComplete;
    expect(getFromShadow('.item.selected')).to.contain.text('Banana');

    // Navigate up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    await element.updateComplete;
    expect(getFromShadow('.item.selected')).to.contain.text('Apple');
  });

  it('should select an item on Enter key press', async () => {
    const itemSelectedSpy = sinon.spy();
    element = await renderComponent();
    element.addEventListener('item-selected', itemSelectedSpy);

    const input = getFromShadow('input')! as HTMLInputElement;

    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'Bana' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    await element.updateComplete;

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await element.updateComplete;

    fireEvent.keyDown(input, { key: 'Enter' });
    await element.updateComplete;

    expect(itemSelectedSpy).to.have.been.calledOnce;
    expect(itemSelectedSpy.getCall(0).args[0].detail).to.deep.equal(mockItems[1]);
    expect(input.value).to.equal('Banana');
    expect(getFromShadow('#dropdown')).not.to.have.class('visible');
  });

  it('should select an item on click', async () => {
    const itemSelectedSpy = sinon.spy();
    element = await renderComponent();
    element.addEventListener('item-selected', itemSelectedSpy);

    const input = getFromShadow('input')! as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'Carrot' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    await element.updateComplete;

    const item = getFromShadow('.item')!;
    fireEvent.click(item);
    await element.updateComplete;

    expect(itemSelectedSpy).to.have.been.calledOnce;
    expect(itemSelectedSpy.getCall(0).args[0].detail).to.deep.equal(mockItems[2]);
    expect(input.value).to.equal('Carrot');
  });

  it('should show a loading state', async () => {
    element = await renderComponent({ loading: true });
    const input = getFromShadow('input')!;
    fireEvent.focus(input);
    await element.updateComplete;

    const loadingState = getFromShadow('.loading-state');
    expect(loadingState).to.exist;
    expect(loadingState).to.contain.text('Loading...');
  });

  it('should show "no results" message when no items match', async () => {
    await renderComponent();
    const input = getFromShadow('input')! as HTMLInputElement;
    fireEvent.input(input, { target: { value: 'xyz' } });
    await new Promise(resolve => setTimeout(resolve, 300));
    await element.updateComplete;

    const emptyState = getFromShadow('.empty-state');
    expect(emptyState).to.exist;
    expect(emptyState).to.contain.text('No results found for "xyz"');
  });

  it('should close dropdown on outside click', async () => {
    await renderComponent();
    const input = getFromShadow('input')!;
    fireEvent.focus(input);
    await element.updateComplete;

    expect(getFromShadow('#dropdown')).to.have.class('visible');

    fireEvent.pointerDown(document.body);
    await element.updateComplete;

    expect(getFromShadow('#dropdown')).not.to.have.class('visible');
  });
});

