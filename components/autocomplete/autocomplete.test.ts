// @vitest-environment happy-dom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { Autocomplete, AutocompleteData } from './autocomplete';

// Mock dependencies if required by your setup
vi.mock('../dropdown/dropdown', () => ({
  Dropdown: {
    init: vi.fn(() => ({
      open: vi.fn(),
      close: vi.fn(),
      recalculateDimensions: vi.fn(),
      isOpen: false
    }))
  }
}));

vi.mock('../../src/utils', () => ({
  Utils: {
    guid: () => '12345',
    keys: {
      ENTER: ['Enter'],
      ARROW_UP: ['ArrowUp'],
      ARROW_DOWN: ['ArrowDown']
    },
    tabPressed: false
  }
}));

describe('Autocomplete Component', () => {
  let inputEl: HTMLInputElement;
  let sampleData: AutocompleteData[];

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input type="text" id="autocomplete-input" />
      </div>
    `;
    inputEl = document.querySelector('#autocomplete-input') as HTMLInputElement;

    sampleData = [
      { id: 1, text: 'Apple', description: 'Fruit' },
      { id: 2, text: 'Banana', description: 'Fruit' },
      { id: 3, text: 'Cherry', description: 'Fruit' }
    ];
  });

  afterEach(() => {
    const instance = Autocomplete.getInstance(inputEl);
    if (instance) {
      instance.destroy();
    }
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should initialize correctly and attach instance to element', () => {
    const instance = new Autocomplete(inputEl, { data: sampleData });

    expect(instance).toBeInstanceOf(Autocomplete);
    expect(Autocomplete.getInstance(inputEl)).toBe(instance);
    expect(inputEl.getAttribute('data-target')).toContain('autocomplete-options-');
  });

  it('should render menu items when opened', () => {
    const instance = new Autocomplete(inputEl, { data: sampleData, minLength: 1 });
    inputEl.value = 'App';

    instance.open();

    const listItems = instance.container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
    expect(listItems[0].getAttribute('data-id')).toBe('1');
    expect(listItems[0].textContent).toContain('Apple');
  });

  it('should filter items via default onSearch handler', () => {
    const instance = new Autocomplete(inputEl, { data: sampleData });
    inputEl.value = 'Ban';

    // Simulate input change detection triggered by keyup/focus
    instance._inputChangeDetection('ban');

    const listItems = instance.container.querySelectorAll('li');
    expect(instance.menuItems.length).toBe(1);
    expect(instance.menuItems[0].text).toBe('Banana');
  });

  it('should trigger onAutocomplete callback when an option is selected', () => {
    const onAutocompleteMock = vi.fn();
    const instance = new Autocomplete(inputEl, {
      data: sampleData,
      onAutocomplete: onAutocompleteMock
    });

    instance.selectOption(2);

    expect(onAutocompleteMock).toHaveBeenCalledWith([
      { id: 2, text: 'Banana', description: 'Fruit' }
    ]);
    expect(inputEl.value).toBe('Banana');
  });

  it('should handle multi-selection correctly', () => {
    const onAutocompleteMock = vi.fn();
    const instance = new Autocomplete(inputEl, {
      data: sampleData,
      isMultiSelect: true,
      onAutocomplete: onAutocompleteMock
    });

    instance.selectOption(1);
    instance.selectOption(3);

    expect(instance.selectedValues.length).toBe(2);
    expect(instance.selectedValues).toEqual([sampleData[0], sampleData[2]]);
    expect(onAutocompleteMock).toHaveBeenLastCalledWith([sampleData[0], sampleData[2]]);
  });

  it('should highlight partial matching text correctly', () => {
    const instance = new Autocomplete(inputEl, { data: sampleData });
    inputEl.value = 'App';

    const item = instance._createDropdownItem(sampleData[0]);
    const highlightSpan = item.querySelector('.highlight');

    expect(highlightSpan).not.toBeNull();
    expect(highlightSpan?.textContent).toBe('App');
  });

  it('should clean up DOM and event listeners on destroy', () => {
    const instance = new Autocomplete(inputEl, { data: sampleData });
    const containerId = instance.container.id;

    instance.destroy();

    expect(Autocomplete.getInstance(inputEl)).toBeUndefined();
    expect(document.getElementById(containerId)).toBeNull();
  });
});
