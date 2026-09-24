import { Utils } from '../utils';
import { Autocomplete } from '../autocomplete/autocomplete';
import { Component } from '../component';

const _defaults = {
  data: [],
  placeholder: '',
  secondaryPlaceholder: '',
  closeIconClass: 'material-icons',
  autocompleteOptions: {},
  autocompleteOnly: false,
  limit: Infinity,
  allowUserInput: false,
  onChipAdd: null,
  onChipSelect: null,
  onChipDelete: null
};

function gGetIndex(el) {
  return [...el.parentNode.children].indexOf(el);
}

class ChipSet extends Component {
  chipsData;
  hasAutocomplete;
  autocomplete;
  #input;
  #label;
  #chips;
  static #keydown = false;
  #selectedChip;

  constructor(el, options) {
    super(el, options, ChipSet);
    this.el['M_Chips'] = this;
    this.options = {
      ...ChipSet.defaults,
      ...options
    };
    this.el.classList.add('chips');
    this.chipsData = [];
    this.#chips = [];

    // Render initial chips
    if (this.options.data.length) {
      this.chipsData = this.options.data;
      this.#renderChips();
    }

    // Render input element, setup event handlers
    if (this.options.allowUserInput) {
      this.#setupLabel();
      this.el.classList.add('input-field');
      this.#setupInput();
      this.#setupEventHandlers();
      // move input to end
      this.el.append(this.#input);
    }
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance(s) of Chips.
   * @param {HTMLElement|Array} els HTML element(s).
   * @param {Object} options Component options.
   */
  static init(els, options = {}) {
    return super.init(els, options, ChipSet);
  }

  static getInstance(el) {
    return el['M_Chips'];
  }

  getData() {
    return this.chipsData;
  }

  destroy() {
    if (this.options.allowUserInput) this.#removeEventHandlers();
    this.#chips.forEach((c) => c.remove());
    this.#chips = [];
    this.el['M_Chips'] = undefined;
  }

  #setupEventHandlers() {
    this.el.addEventListener('click', this.#handleChipClick);
    document.addEventListener('keydown', ChipSet.#handleChipsKeydown);
    document.addEventListener('keyup', ChipSet.#handleChipsKeyup);
    this.el.addEventListener('blur', ChipSet.#handleChipsBlur, true);
    this.#input.addEventListener('focus', this.#handleInputFocus);
    this.#input.addEventListener('blur', this.#handleInputBlur);
    this.#input.addEventListener('keydown', this.#handleInputKeydown);
  }

  #removeEventHandlers() {
    this.el.removeEventListener('click', this.#handleChipClick);
    document.removeEventListener('keydown', ChipSet.#handleChipsKeydown);
    document.removeEventListener('keyup', ChipSet.#handleChipsKeyup);
    this.el.removeEventListener('blur', ChipSet.#handleChipsBlur, true);
    this.#input.removeEventListener('focus', this.#handleInputFocus);
    this.#input.removeEventListener('blur', this.#handleInputBlur);
    this.#input.removeEventListener('keydown', this.#handleInputKeydown);
  }

  #handleChipClick = (e) => {
    const _chip = e.target.closest('.chip');
    const clickedClose = e.target.classList.contains('close');
    if (_chip) {
      const index = [..._chip.parentNode.children].indexOf(_chip);
      if (clickedClose) {
        this.deleteChip(index);
        this.#input.focus();
      } else {
        this.selectChip(index);
      }
    } else {
      this.#input.focus();
    }
  };

  static #handleChipsKeydown(e) {
    ChipSet.#keydown = true;
    const chips = e.target.closest('.chips');
    const chipsKeydown = e.target && chips;

    // Don't handle keydown inputs on input and textarea
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || !chipsKeydown) return;

    const currChips = chips['M_Chips'];

    if (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.DELETE.includes(e.key)) {
      e.preventDefault();
      let selectIndex = currChips.chipsData.length;
      if (currChips.#selectedChip) {
        const index = gGetIndex(currChips.#selectedChip);
        currChips.deleteChip(index);
        currChips.#selectedChip = null;
        selectIndex = Math.max(index - 1, 0);
      }
      if (currChips.chipsData.length) currChips.selectChip(selectIndex);
      else currChips.#input.focus();
    } else if (Utils.keys.ARROW_LEFT.includes(e.key)) {
      if (currChips.#selectedChip) {
        const selectIndex = gGetIndex(currChips.#selectedChip) - 1;
        if (selectIndex < 0) return;
        currChips.selectChip(selectIndex);
      }
    } else if (Utils.keys.ARROW_RIGHT.includes(e.key)) {
      if (currChips.#selectedChip) {
        const selectIndex = gGetIndex(currChips.#selectedChip) + 1;
        if (selectIndex >= currChips.chipsData.length) currChips.#input.focus();
        else currChips.selectChip(selectIndex);
      }
    }
  }

  static #handleChipsKeyup() {
    ChipSet.#keydown = false;
  }

  static #handleChipsBlur(e) {
    if (!ChipSet.#keydown && document.hidden) {
      const chips = e.target.closest('.chips');
      const currChips = chips['M_Chips'];
      currChips.#selectedChip = null;
    }
  }

  #handleInputFocus = () => {
    this.el.classList.add('focus');
  };

  #handleInputBlur = () => {
    this.el.classList.remove('focus');
  };

  #handleInputKeydown = (e) => {
    ChipSet.#keydown = true;
    if (Utils.keys.ENTER.includes(e.key)) {
      if (this.hasAutocomplete && this.autocomplete && this.autocomplete.isOpen) {
        return;
      }
      e.preventDefault();
      if (!this.hasAutocomplete || (this.hasAutocomplete && !this.options.autocompleteOnly)) {
        this.addChip({ id: this.#input.value });
      }
      this.#input.value = '';
    } else if (
      (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.ARROW_LEFT.includes(e.key)) &&
      this.#input.value === '' &&
      this.chipsData.length
    ) {
      e.preventDefault();
      this.selectChip(this.chipsData.length - 1);
    }
  };

  #renderChip(chip) {
    if (!chip.id) return;
    const renderedChip = document.createElement('li');
    renderedChip.classList.add('chip');
    renderedChip.innerText = chip.text || chip.id;
    if (chip.image) {
      const img = document.createElement('img');
      img.setAttribute('src', chip.image);
      renderedChip.insertBefore(img, renderedChip.firstChild);
    }
    if (this.options.allowUserInput) {
      const closeButton = document.createElement('button');
      closeButton.classList.add(this.options.closeIconClass, 'close');
      closeButton.innerText = 'close';
      renderedChip.appendChild(closeButton);
    }
    return renderedChip;
  }

  #renderChips() {
    this.#chips = [];
    for (let i = 0; i < this.chipsData.length; i++) {
      const chipElem = this.#renderChip(this.chipsData[i]);
      this.el.appendChild(chipElem);
      this.#chips.push(chipElem);
    }
  }

  #setupAutocomplete() {
    this.options.autocompleteOptions.onAutocomplete = (items) => {
      if (items.length > 0)
        this.addChip({
          id: items[0].id,
          text: items[0].text,
          image: items[0].image
        });
      this.#input.value = '';
      this.#input.focus();
    };
    this.autocomplete = Autocomplete.init(this.#input, this.options.autocompleteOptions);
  }

  #setupInput() {
    this.#input = this.el.querySelector('input');
    if (!this.#input) {
      this.#input = document.createElement('input');
      this.el.append(this.#input);
    }
    this.#input.classList.add('input');
    this.hasAutocomplete = Object.keys(this.options.autocompleteOptions).length > 0;
    if (this.hasAutocomplete) this.#setupAutocomplete();
    this.#setPlaceholder();
    if (!this.#input.getAttribute('id')) this.#input.setAttribute('id', Utils.guid());
  }

  #setupLabel() {
    this.#label = this.el.querySelector('label');
    if (this.#label) this.#label.setAttribute('for', this.#input.getAttribute('id'));
  }

  #setPlaceholder() {
    if (this.chipsData !== undefined && !this.chipsData.length && this.options.placeholder) {
      this.#input.placeholder = this.options.placeholder;
    } else if (
      (this.chipsData === undefined || !!this.chipsData.length) &&
      this.options.secondaryPlaceholder
    ) {
      this.#input.placeholder = this.options.secondaryPlaceholder;
    }
  }

  #isValidAndNotExist(chip) {
    const isValid = !!chip.id;
    const doesNotExist = !this.chipsData.some((item) => item.id == chip.id);
    return isValid && doesNotExist;
  }

  /**
   * Add chip to input.
   * @param {Object} chip Chip data object
   */
  addChip(chip) {
    if (!this.#isValidAndNotExist(chip) || this.chipsData.length >= this.options.limit) return;
    const renderedChip = this.#renderChip(chip);
    this.#chips.push(renderedChip);
    this.chipsData.push(chip);
    this.#input.before(renderedChip);
    this.#setPlaceholder();
    if (typeof this.options.onChipAdd === 'function') {
      this.options.onChipAdd(this.el, renderedChip);
    }
  }

  /**
   * Delete nth chip.
   * @param {number} chipIndex Index of chip
   */
  deleteChip(chipIndex) {
    const chip = this.#chips[chipIndex];
    this.#chips[chipIndex].remove();
    this.#chips.splice(chipIndex, 1);
    this.chipsData.splice(chipIndex, 1);
    this.#setPlaceholder();
    if (typeof this.options.onChipDelete === 'function') {
      this.options.onChipDelete(this.el, chip);
    }
  }

  /**
   * Select nth chip.
   * @param {number} chipIndex Index of chip
   */
  selectChip(chipIndex) {
    const chip = this.#chips[chipIndex];
    this.#selectedChip = chip;
    chip.focus();
    if (typeof this.options.onChipSelect === 'function') {
      this.options.onChipSelect(this.el, chip);
    }
  }

  static Init() {
    if (typeof document !== 'undefined')
      document.addEventListener('DOMContentLoaded', () => {
        const chips = document.querySelectorAll('.chips');
        chips.forEach((el) => {
          el.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
              const chip = e.target.closest('.chip');
              if (chip) chip.remove();
            }
          });
        });
      });
  }
}

export { ChipSet };
