import { Utils } from "./utils";
import { Autocomplete, AutocompleteOptions } from "./autocomplete";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface ChipData {
  /**
   * Unique identifier.
   */
  id: number|string;
  /**
   * Chip text. If not specified, "id" will be used.
   */
  text?: string;
  /**
   * Chip image (URL).
   */
  image?: string;
}

export interface ChipsOptions extends BaseOptions{
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

let _defaults: ChipsOptions = {
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

export class Chips extends Component<ChipsOptions> {
  /** Array of the current chips data. */
  chipsData: ChipData[];
  /** If the chips has autocomplete enabled. */
  hasAutocomplete: boolean;
  /** Autocomplete instance, if any. */
  autocomplete: Autocomplete;
  _input: HTMLInputElement;
  _label: any;
  _chips: HTMLElement[];
  static _keydown: boolean;
  private _selectedChip: any;

  constructor(el: HTMLElement, options: Partial<ChipsOptions>) {
    super(el, options, Chips);
    (this.el as any).M_Chips = this;

    this.options = {
      ...Chips.defaults,
      ...options
    };

    this.el.classList.add('chips');
    this.chipsData = [];
    this._chips = [];

    // Render initial chips
    if (this.options.data.length) {
      this.chipsData = this.options.data;
      this._renderChips();
    }
    this._setupLabel();

    // Render input element, setup event handlers
    if(this.options.allowUserInput) {
      this.el.classList.add('input-field');
      this._setupInput();
      this._setupEventHandlers();
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
  static init(el: InitElements<MElement>, options?: Partial<ChipsOptions>): Chips;
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
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<ChipsOptions> = {}): Chips | Chips[] {
    return super.init(els, options, Chips);
  }

  static getInstance(el: HTMLElement): Chips {
    return (el as any).M_Chips;
  }

  getData() {
    return this.chipsData;
  }

  destroy() {
    if(this.options.allowUserInput) {
      this._removeEventHandlers();
    }
    this._chips.forEach(c => c.remove());
    this._chips = [];
    (this.el as any).M_Chips = undefined;
  }

  _setupEventHandlers() {
    this.el.addEventListener('click', this._handleChipClick);
    document.addEventListener('keydown', Chips._handleChipsKeydown);
    document.addEventListener('keyup', Chips._handleChipsKeyup);
    this.el.addEventListener('blur', Chips._handleChipsBlur, true);
    this._input.addEventListener('focus', this._handleInputFocus);
    this._input.addEventListener('blur', this._handleInputBlur);
    this._input.addEventListener('keydown', this._handleInputKeydown);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleChipClick);
    document.removeEventListener('keydown', Chips._handleChipsKeydown);
    document.removeEventListener('keyup', Chips._handleChipsKeyup);
    this.el.removeEventListener('blur', Chips._handleChipsBlur, true);
    this._input.removeEventListener('focus', this._handleInputFocus);
    this._input.removeEventListener('blur', this._handleInputBlur);
    this._input.removeEventListener('keydown', this._handleInputKeydown);
  }

  _handleChipClick = (e: MouseEvent) => {
    const _chip = (<HTMLElement>e.target).closest('.chip');
    const clickedClose = (<HTMLElement>e.target).classList.contains('close');
    if (_chip) {
      const index = [..._chip.parentNode.children].indexOf(_chip);
      if (clickedClose) {
        this.deleteChip(index);
        this._input.focus();
      }
      else {
        this.selectChip(index);
      }
      // Default handle click to focus on input
    }
    else {
      this._input.focus();
    }
  }

  static _handleChipsKeydown(e: KeyboardEvent) {
    Chips._keydown = true;
    const chips = (<HTMLElement>e.target).closest('.chips');
    const chipsKeydown = e.target && chips;

    // Don't handle keydown inputs on input and textarea
    const tag = (<HTMLElement>e.target).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || !chipsKeydown) return;

    const currChips: Chips = (chips as any).M_Chips;

    if (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.DELETE.includes(e.key)) {
      e.preventDefault();
      let selectIndex = currChips.chipsData.length;
      if (currChips._selectedChip) {
        const index = gGetIndex(currChips._selectedChip);
        currChips.deleteChip(index);
        currChips._selectedChip = null;
        // Make sure selectIndex doesn't go negative
        selectIndex = Math.max(index - 1, 0);
      }
      if (currChips.chipsData.length)
        currChips.selectChip(selectIndex);
      else
        currChips._input.focus();
    }
    else if (Utils.keys.ARROW_LEFT.includes(e.key)) {
      if (currChips._selectedChip) {
        const selectIndex = gGetIndex(currChips._selectedChip) - 1;
        if (selectIndex < 0) return;
        currChips.selectChip(selectIndex);
      }
    }
    else if (Utils.keys.ARROW_RIGHT.includes(e.key)) {
      if (currChips._selectedChip) {
        const selectIndex = gGetIndex(currChips._selectedChip) + 1;
        if (selectIndex >= currChips.chipsData.length)
          currChips._input.focus();
        else
          currChips.selectChip(selectIndex);
      }
    }
  }

  static _handleChipsKeyup(e: Event) {
    Chips._keydown = false;
  }

  static _handleChipsBlur(e: Event) {
    if (!Chips._keydown && document.hidden) {
      const chips = (<HTMLElement>e.target).closest('.chips');
      const currChips: Chips = (chips as any).M_Chips;
      currChips._selectedChip = null;
    }
  }

  _handleInputFocus = () => {
    this.el.classList.add('focus');
  }

  _handleInputBlur = () => {
    this.el.classList.remove('focus');
  }

  _handleInputKeydown = (e: KeyboardEvent) => {
    Chips._keydown = true;
    if (Utils.keys.ENTER.includes(e.key)) {
      // Override enter if autocompleting.
      if (this.hasAutocomplete && this.autocomplete && this.autocomplete.isOpen) {
        return;
      }
      e.preventDefault();
      if (!this.hasAutocomplete || (this.hasAutocomplete && !this.options.autocompleteOnly)) {
        this.addChip({id: this._input.value});
      }
      this._input.value = '';
    }
    else if (      
      (Utils.keys.BACKSPACE.includes(e.key) || Utils.keys.ARROW_LEFT.includes(e.key)) &&
      this._input.value === '' &&
      this.chipsData.length
    ) {
      e.preventDefault();
      this.selectChip(this.chipsData.length - 1);
    }
  }

  _renderChip(chip: ChipData): HTMLDivElement {
    if (!chip.id) return;
    const renderedChip = document.createElement('div');
    renderedChip.classList.add('chip');
    renderedChip.innerText = chip.text || <string>chip.id;
    renderedChip.setAttribute('tabindex', "0");
    const closeIcon = document.createElement('i');
    closeIcon.classList.add(this.options.closeIconClass, 'close');
    closeIcon.innerText = 'close';
    // attach image if needed
    if (chip.image) {
      const img = document.createElement('img');
      img.setAttribute('src', chip.image);
      renderedChip.insertBefore(img, renderedChip.firstChild);
    }
    renderedChip.appendChild(closeIcon);
    return renderedChip;
  }

  _renderChips() {
    this._chips = []; //.remove();
    for (let i = 0; i < this.chipsData.length; i++) {
      const chipElem = this._renderChip(this.chipsData[i]);
      this.el.appendChild(chipElem);
      this._chips.push(chipElem);
    }
    if(this.options.allowUserInput) {
      // move input to end
      this.el.append(this._input);
    }
  }

  _setupAutocomplete() {
    this.options.autocompleteOptions.onAutocomplete = (items) => {
      if (items.length > 0) this.addChip({
        id: items[0].id,
        text: items[0].text,
        image: items[0].image
      });
      this._input.value = '';
      this._input.focus();
    };
    this.autocomplete = Autocomplete.init(this._input, this.options.autocompleteOptions);
  }

  _setupInput() {
    this._input = this.el.querySelector('input');
    if (!this._input) {
      this._input = document.createElement('input');
      this.el.append(this._input);
    }
    this._input.classList.add('input');
    this.hasAutocomplete = Object.keys(this.options.autocompleteOptions).length > 0;
    // Setup autocomplete if needed
    if (this.hasAutocomplete) this._setupAutocomplete();
    this._setPlaceholder();
    // Set input id
    if (!this._input.getAttribute('id'))
      this._input.setAttribute('id', Utils.guid());
  }

  _setupLabel() {
    this._label = this.el.querySelector('label');
    if (this._label) this._label.setAttribute('for', this._input.getAttribute('id'));
  }

  _setPlaceholder() {
    if (this.chipsData !== undefined && !this.chipsData.length && this.options.placeholder) {
      this._input.placeholder = this.options.placeholder;
    }
    else if (
      (this.chipsData === undefined || !!this.chipsData.length) &&
      this.options.secondaryPlaceholder
    ) {
      this._input.placeholder = this.options.secondaryPlaceholder;
    }
  }

  _isValidAndNotExist(chip: ChipData) {
    const isValid = !!chip.id;
    const doesNotExist = !this.chipsData.some(item => item.id == chip.id);
    return isValid && doesNotExist;
  }

  /**
   * Add chip to input.
   * @param chip Chip data object
   */
  addChip(chip: ChipData) {
    if (!this._isValidAndNotExist(chip) || this.chipsData.length >= this.options.limit) return;
    const renderedChip = this._renderChip(chip);
    this._chips.push(renderedChip);
    this.chipsData.push(chip);
    //$(this._input).before(renderedChip);
    this._input.before(renderedChip);
    this._setPlaceholder();
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
    const chip = this._chips[chipIndex];
    this._chips[chipIndex].remove();
    this._chips.splice(chipIndex, 1);
    this.chipsData.splice(chipIndex, 1);
    this._setPlaceholder();
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
    const chip = this._chips[chipIndex];
    this._selectedChip = chip;
    chip.focus();
    // fire chipSelect callback
    if (typeof this.options.onChipSelect === 'function') {
      this.options.onChipSelect(this.el, chip);
    }
  }

  static Init(){
    if (typeof document !== 'undefined')
    document.addEventListener("DOMContentLoaded", () => {
      // Handle removal of static chips.
      document.body.addEventListener('click', e => {
        if ((<HTMLElement>e.target).closest('.chip .close')) {
          const chips = (<HTMLElement>e.target).closest('.chips');
          if (chips && (chips as any).M_Chips == undefined) return;
          (<HTMLElement>e.target).closest('.chip').remove();
        }
      });
    });
  }

  static {
    Chips._keydown = false;
  }
}
