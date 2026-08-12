// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Chips } from './chips.ts';

// Attach M to both global and window contexts
const globalM = { Chips };
global.M = globalM;
if (typeof window !== 'undefined') {
  (window as any).M = globalM;
}

// Utility helper to replace done() timeouts with async/await
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Event helpers to dispatch native DOM events compatible with Happy DOM
const keydown = (element: Element, keyCode: number) => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      keyCode: keyCode,
      which: keyCode,
      key: keyCode === 13 ? 'Enter' : '',
      code: keyCode === 13 ? 'Enter' : '',
      bubbles: true,
      cancelable: true
    })
  );
};

const click = (element: Element) => {
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

    // Initialize Components
    (global.M as any).Chips.init(document.querySelector('.chips'));
    (global.M as any).Chips.init(document.querySelector('.chips-initial'), {
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
    (global.M as any).Chips.init(document.querySelector('.chips.input-field'), {
      allowUserInput: true
    });
    (global.M as any).Chips.init(document.querySelector('.chips-initial.input-field'), {
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
    (global.M as any).Chips.init(document.querySelector('.chips-placeholder.input-field'), {
      allowUserInput: true,
      placeholder: 'Enter a tag',
      secondaryPlaceholder: '+Tag'
    });
    (global.M as any).Chips.init(document.querySelector('.chips-autocomplete.input-field'), {
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

  describe('chips plugin', () => {
    let chips: HTMLElement | null,
      chipsUserInput: HTMLElement | null,
      input: HTMLInputElement | NodeListOf<HTMLInputElement> | null;

    it('should work with multiple initializations', () => {
      chips = document.querySelector('.chips');
      (global.M as any).Chips.init(chips);
      (global.M as any).Chips.init(chips);
      (global.M as any).Chips.init(chips);
      chipsUserInput = document.querySelector('.chips.input-field');
      (global.M as any).Chips.init(chips, { allowUserInput: true });

      const inputs = chipsUserInput?.querySelectorAll('input');
      expect(inputs?.length, 'Should dynamically generate chips structure.').toBe(1);
    });

    it('should be able to add chip', async () => {
      chips = document.querySelector('.chips.input-field');
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
      chips = document.querySelector('.chips.chips-initial.input-field');
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
      chips = document.querySelector('.chips.input-field');
      let chipWasAdded = false;
      let chipAddedElem = null;
      let chipSelect = false;
      let chipSelected = null;
      let chipDelete = false;
      let chipDeleted = null;

      (global.M as any).Chips.init(chips, {
        allowUserInput: true,
        data: [{ id: 'One' }, { id: 'Two' }, { id: 'Three' }],
        onChipAdd: (_chipsEl, chipEl) => {
          chipAddedElem = chipEl;
          chipWasAdded = true;
        },
        onChipSelect: (_chipsEl, chipEl) => {
          chipSelected = chipEl;
          chipSelect = true;
        },
        onChipDelete: (_chipsEl, chipEl) => {
          chipDeleted = chipEl;
          chipDelete = true;
        }
      });

      const inputEl = chips?.querySelector('input') as HTMLInputElement;
      inputEl.value = 'Four';
      expect(chipWasAdded, 'callback not yet fired').toBe(false);
      expect(chipSelect, 'callback not yet fired').toBe(false);
      expect(chipDelete, 'callback not yet fired').toBe(false);

      keydown(inputEl, 13);

      await delay(100);

      expect(chipWasAdded, 'add callback fired').toBe(true);
      expect(
        chipAddedElem.childNodes[0].nodeValue,
        'add callback provides correct chip element'
      ).toBe('Four');

      const chipList = chips?.querySelectorAll('.chip');
      if (chipList && chipList[1]) {
        click(chipList[1]);
      }

      await delay(100);

      expect(chipSelect, 'select callback fired').toBe(true);
      expect(
        chipSelected.childNodes[0].nodeValue,
        'select callback provides correct chip element'
      ).toBe('Two');

      const closeList = chips?.querySelectorAll('.close');
      if (closeList && closeList[2]) {
        click(closeList[2]);
      }

      await delay(100);

      expect(chipDelete, 'delete callback fired').toBe(true);
      expect(
        chipDeleted.childNodes[0].nodeValue,
        'delete callback provides correct chip element'
      ).toBe('Three');
    });
  });
});
