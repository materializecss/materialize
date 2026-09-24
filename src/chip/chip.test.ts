// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Chips } from './chips.js';
import { Dropdown } from '../dropdown/dropdown.ts'; // Adjust path as needed

declare global {
  var M: {
    Chips: typeof Chips;
    Dropdown?: typeof Dropdown;
  };
}

const globalM = { Chips, Dropdown };
globalThis.M = globalM;

if (typeof window !== 'undefined') {
  (window as unknown as { M: typeof globalM }).M = globalM;
  (window as unknown as { Dropdown: typeof Dropdown }).Dropdown = Dropdown;
}

// Utility helper to replace done() timeouts with async/await
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Event helpers to dispatch native DOM events compatible with Happy DOM
const keydown = (element: Element, keyCode: number): void => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      keyCode,
      which: keyCode,
      key: keyCode === 13 ? 'Enter' : '',
      code: keyCode === 13 ? 'Enter' : '',
      bubbles: true,
      cancelable: true
    })
  );
};

const click = (element: Element): void => {
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  );
};

describe('Chips', () => {
  const fixture = `<div class="chips"></div>
<div class="chips chips-initial"></div>
<div class="chips input-field"><input></div>
<div class="chips chips-initial input-field"><input></div>
<div class="chips chips-placeholder input-field"><input></div>
<div class="chips chips-autocomplete input-field"><input></div>`;

  beforeEach(() => {
    // Inject fixture HTML directly into the DOM
    document.body.innerHTML = fixture;

    // Helper to query element safely
    const select = (selector: string): HTMLElement => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) throw new Error(`Element not found: ${selector}`);
      return el;
    };

    // Initialize Components
    globalThis.M.Chips.init(select('.chips'));
    globalThis.M.Chips.init(select('.chips-initial'), {
      data: [
        { id: 12, text: 'Apple' },
        { id: 13, text: 'Microsoft' },
        {
          id: 42,
          text: 'Google',
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        }
      ]
    });
    globalThis.M.Chips.init(select('.chips.input-field'), {
      allowUserInput: true
    });
    globalThis.M.Chips.init(select('.chips-initial.input-field'), {
      allowUserInput: true,
      data: [
        { id: 12, text: 'Apple' },
        { id: 13, text: 'Microsoft' },
        {
          id: 42,
          text: 'Google',
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        }
      ]
    });
    globalThis.M.Chips.init(select('.chips-placeholder.input-field'), {
      allowUserInput: true,
      placeholder: 'Enter a tag',
      secondaryPlaceholder: '+Tag'
    });
    globalThis.M.Chips.init(select('.chips-autocomplete.input-field'), {
      allowUserInput: true,
      autocompleteOptions: {
        data: [
          { id: 12, text: 'Apple' },
          { id: 13, text: 'Microsoft' },
          { id: 42, text: 'Google' }
        ]
      }
    });
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  describe('chips', () => {
    it('should work with multiple initializations', () => {
      const chips = document.querySelector('.chips') as HTMLElement;
      globalThis.M.Chips.init(chips);
      globalThis.M.Chips.init(chips);
      globalThis.M.Chips.init(chips);

      const chipsUserInput = document.querySelector('.chips.input-field') as HTMLElement;
      globalThis.M.Chips.init(chips, { allowUserInput: true });

      const inputs = chipsUserInput?.querySelectorAll('input');
      expect(inputs?.length, 'Should dynamically generate chips structure.').toBe(1);
    });

    it('should be able to add chip', async () => {
      const chips = document.querySelector('.chips.input-field');
      const inputEl = chips?.querySelector('input') as HTMLInputElement;
      inputEl.value = 'one';
      keydown(inputEl, 13);

      await delay(100);

      const numChips = chips?.querySelectorAll('.chip').length;
      const oneChip = chips?.querySelector('.chip') as HTMLElement;
      expect(numChips, 'one chip should have been added').toBe(1);

      for (let i = oneChip.children.length - 1; i >= 0; i--) {
        oneChip.children[i].remove();
      }
      expect(oneChip.innerText, 'the chip should have value "one"').toBe('one');
    });

    it('should be able to delete chip', async () => {
      const chips = document.querySelector('.chips.chips-initial.input-field');
      let numChips = chips?.querySelectorAll('.chip').length;
      expect(numChips, '3 initial chips should have been added').toBe(3);

      const chipCloseButton = chips?.querySelectorAll('.chip .close');
      expect(chipCloseButton?.length, 'expected all chips to have close button').toBe(3);

      if (chipCloseButton && chipCloseButton[0]) {
        click(chipCloseButton[0]);
      }
      await delay(100);

      numChips = chips?.querySelectorAll('.chip').length;
      expect(numChips, 'one chip should have been deleted').toBe(2);
    });

    it('should have working callbacks', async () => {
      const chips = document.querySelector<HTMLElement>('.chips.input-field')!;
      let chipWasAdded = false;
      let chipAddedElem: HTMLElement | null = null;
      let chipSelect = false;
      let chipSelected: HTMLElement | null = null;
      let chipDelete = false;
      let chipDeleted: HTMLElement | null = null;

      globalThis.M.Chips.init(chips, {
        allowUserInput: true,
        data: [{ id: 'One' }, { id: 'Two' }, { id: 'Three' }],
        onChipAdd: (_chipsEl: HTMLElement, chipEl: HTMLElement) => {
          chipAddedElem = chipEl;
          chipWasAdded = true;
        },
        onChipSelect: (_chipsEl: HTMLElement, chipEl: HTMLElement) => {
          chipSelected = chipEl;
          chipSelect = true;
        },
        onChipDelete: (_chipsEl: HTMLElement, chipEl: HTMLElement) => {
          chipDeleted = chipEl;
          chipDelete = true;
        }
      });

      const inputEl = chips.querySelector('input') as HTMLInputElement;
      inputEl.value = 'Four';

      keydown(inputEl, 13);
      await delay(100);

      const valueAdd = chipAddedElem ? (chipAddedElem as HTMLElement).firstChild?.nodeValue : '';
      expect(chipWasAdded, 'add callback fired').toBe(true);
      expect(valueAdd, 'add callback provides correct chip element').toBe('Four');

      const chipList = chips.querySelectorAll('.chip');
      if (chipList[1]) {
        click(chipList[1]);
      }

      await delay(100);

      const valueSel = chipSelected ? (chipSelected as HTMLElement).firstChild?.nodeValue : '';
      expect(chipSelect, 'select callback fired').toBe(true);
      expect(valueSel, 'select callback provides correct chip element').toBe('Two');

      const closeList = chips.querySelectorAll('.close');
      if (closeList[2]) {
        click(closeList[2]);
      }

      await delay(100);

      const valueDel = chipDeleted ? (chipDeleted as HTMLElement).firstChild?.nodeValue : '';
      expect(chipDelete, 'delete callback fired').toBe(true);
      expect(valueDel, 'delete callback provides correct chip element').toBe('Three');
    });
  });
});
