import { Utils } from '../../src/utils';
import { Autocomplete, AutocompleteOptions } from '../search/autocomplete';
import { Component, BaseOptions, InitElements, MElement } from '../../src/component';

interface ChipData {
  /** Unique identifier. */
  id: number | string;
  /** Chip text. If not specified, "id" will be used. */
  text?: string;
  /** Chip image (URL). */
  image?: string;
}

interface ChipsOptions extends BaseOptions {
  /**
   * Set the chip data.
   * @default []
   */
  data: ChipData[];
  /**
   * Set first placeholder when there are no tags.
   * @default ""
   */
  placeholder: string;
  /**
   * Set second placeholder when adding additional tags.
   * @default ""
   */
  secondaryPlaceholder: string;
  /**
   * Set autocomplete options.
   * @default {}
   */
  autocompleteOptions: Partial<AutocompleteOptions>;
  /**
   * Toggles abililty to add custom value not in autocomplete list.
   * @default false
   */
  autocompleteOnly: boolean;
  /**
   * Set chips limit.
   * @default Infinity
   */
  limit: number;
  /**
   * Specifies class to be used in "close" button (useful when working with Material Symbols icon set).
   * @default 'material-icons'
   */
  closeIconClass: string;
  /**
   *  Specifies option to render user input field
   *  @default false;
   */
  allowUserInput: boolean;
  /**
   * Callback for chip add.
   * @default null
   */
  onChipAdd: (element: HTMLElement, chip: HTMLElement) => void;
  /**
   * Callback for chip select.
   * @default null
   */
  onChipSelect: (element: HTMLElement, chip: HTMLElement) => void;
  /**
   * Callback for chip delete.
   * @default null
   */
  onChipDelete: (element: HTMLElement, chip: HTMLElement) => void;
}

const _defaults: ChipsOptions = {
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

function gGetIndex(el: HTMLElement): number {
  return [...el.parentNode.children].indexOf(el);
}

class Chips extends Component<ChipsOptions> {
  /** Array of the current chips data. */
  chipsData: ChipData[];
  /** If the chips has autocomplete enabled. */
  hasAutocomplete: boolean;
  /** Autocomplete instance, if any. */
  autocomplete: Autocomplete;
  #input: HTMLInputElement;
  #label: HTMLLabelElement;
  #chips: HTMLElement[];
  static #keydown: boolean;
  #selectedChip: HTMLElement;

  constructor(el: HTMLElement, options: Partial<ChipsOptions>) {
    super(el, options, Chips);
    this.el['M_Chips'] = this;
    this.options = {
      ...Chips.defaults,
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
   * Initializes instance of Chips.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<ChipsOptions>): Chips;
  /**
   * Initializes instances of Chips.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<ChipsOptions>): Chips[];
  /**
   * Initializes instances of Chips.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<ChipsOptions> = {}
  ): Chips | Chips[] {
    return super.init(els, options, Chips);
  }

  static getInstance(el: HTMLElement): Chips {
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
    // @todo why do we need this as document event listener, shouldn't we apply it to the element wrapper itself?
    document.addEventListener('keydown', Chips.#handleChipsKeydown);
    document.addEventListener('keyup', Chips.#handleChipsKeyup);
    this.el.addEventListener('blur', Chips.#handleChipsBlur, true);
    this.#input.addEventListener('focus', this.#handleInputFocus);
    this.#input.addEventListener('blur', this.#handleInputBlur);
    this.#input.addEventListener('keydown', this.#handleInputKeydown);
  }

  #removeEventHandlers() {
    this.el.removeEventListener('click', this.#handleChipClick);
    document.removeEventListener('keydown', Chips.#handleChipsKeydown);
    document.removeEventListener('keyup', Chips.#handleChipsKeyup);
    this.el.removeEventListener('blur', Chips.#handleChipsBlur, true);
    this.#input.removeEventListener('focus', this.#handleInputFocus);
    this.#input.removeEventListener('blur', this.#handleInputBlur);
    this.#input.removeEventListener('keydown', this.#handleInputKeydown);
  }

  #handleChipClick = (e: MouseEvent) => {
    const _chip = (<HTMLElement>e.target).closest('.chip');
    const clickedClose = (<HTMLElement>e.target).classList.contains('close');
    if (_chip) {
      const index = [..._chip.parentNode.children].indexOf(_chip);
      if (clickedClose) {
        this.deleteChip(index);
        this.#input.focus();
      } else {
        this.selectChip(index);
      }
      // Default handle click to focus on input
    } else {
      this.#input.focus();
    }
  };

  static #handleChipsKeydown(e: KeyboardEvent) {
    Chips.#keydown = true;
    const chips = (<HTMLElement>e.target).closest('.chips');
    const chipsKeydown = e.target && chips;

    // Don't handle keydown inputs on input and textarea
    const tag = (<HTMLElement>e.target).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || !chipsKeydown) return;

    const currChips: Chips = chips['M_Chips'];

    if (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.DELETE.includes(e.key)) {
      e.preventDefault();
      let selectIndex = currChips.chipsData.length;
      if (currChips.#selectedChip) {
        const index = gGetIndex(currChips.#selectedChip);
        currChips.deleteChip(index);
        currChips.#selectedChip = null;
        // Make sure selectIndex doesn't go negative
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
    Chips.#keydown = false;
  }

  static #handleChipsBlur(e: Event) {
    if (!Chips.#keydown && document.hidden) {
      const chips = (<HTMLElement>e.target).closest('.chips');
      const currChips: Chips = chips['M_Chips'];
      currChips.#selectedChip = null;
    }
  }

  #handleInputFocus = () => {
    this.el.classList.add('focus');
  };

  #handleInputBlur = () => {
    this.el.classList.remove('focus');
  };

  #handleInputKeydown = (e: KeyboardEvent) => {
    Chips.#keydown = true;
    if (Utils.keys.ENTER.includes(e.key)) {
      // Override enter if autocompleting.
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

  #renderChip(chip: ChipData): HTMLLIElement {
    if (!chip.id) return;
    const renderedChip = document.createElement('li');
    renderedChip.classList.add('chip');
    renderedChip.innerText = chip.text || <string>chip.id;
    // attach image if needed
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
    this.#chips = []; //.remove();
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
    // Setup autocomplete if needed
    if (this.hasAutocomplete) this.#setupAutocomplete();
    this.#setPlaceholder();
    // Set input id
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

  #isValidAndNotExist(chip: ChipData) {
    const isValid = !!chip.id;
    const doesNotExist = !this.chipsData.some((item) => item.id == chip.id);
    return isValid && doesNotExist;
  }

  /**
   * Add chip to input.
   * @param chip Chip data object
   */
  addChip(chip: ChipData) {
    if (!this.#isValidAndNotExist(chip) || this.chipsData.length >= this.options.limit) return;
    const renderedChip = this.#renderChip(chip);
    this.#chips.push(renderedChip);
    this.chipsData.push(chip);
    //$(this._input).before(renderedChip);
    this.#input.before(renderedChip);
    this.#setPlaceholder();
    // fire chipAdd callback
    if (typeof this.options.onChipAdd === 'function') {
      this.options.onChipAdd(this.el, renderedChip);
    }
  }

  /**
   * Delete nth chip.
   * @param chipIndex  Index of chip
   */
  deleteChip(chipIndex: number) {
    const chip = this.#chips[chipIndex];
    this.#chips[chipIndex].remove();
    this.#chips.splice(chipIndex, 1);
    this.chipsData.splice(chipIndex, 1);
    this.#setPlaceholder();
    // fire chipDelete callback
    if (typeof this.options.onChipDelete === 'function') {
      this.options.onChipDelete(this.el, chip);
    }
  }

  /**
   * Select nth chip.
   * @param chipIndex Index of chip
   */
  selectChip(chipIndex: number) {
    const chip = this.#chips[chipIndex];
    this.#selectedChip = chip;
    chip.focus();
    // fire chipSelect callback
    if (typeof this.options.onChipSelect === 'function') {
      this.options.onChipSelect(this.el, chip);
    }
  }

  static Init() {
    if (typeof document !== 'undefined')
      // Handle removal of static chips.
      document.addEventListener('DOMContentLoaded', () => {
        const chips = document.querySelectorAll('.chips');
        chips.forEach((el) => {
          // if (el && (el['M_Chips == undefined) return;
          el.addEventListener('click', (e) => {
            if ((<HTMLElement>e.target).classList.contains('close')) {
              const chip = (<HTMLElement>e.target).closest('.chip');
              if (chip) chip.remove();
            }
          });
        });
      });
  }

  static {
    Chips.#keydown = false;
  }
}

export { Chips, ChipData, ChipsOptions };
