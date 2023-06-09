import { Component } from "./component";
import { M } from "./global";
import { Autocomplete } from "./autocomplete";

let _defaults = {
  data: [],
  placeholder: '',
  secondaryPlaceholder: '',
  autocompleteOptions: {},
  autocompleteOnly: false,
  limit: Infinity,
  onChipAdd: null,
  onChipSelect: null,
  onChipDelete: null
};

interface DataBit {
  id: string, // required
  text?: string,
  image?: string,
  description?: string,
}

function gGetIndex(el: HTMLElement): number {
  return [...el.parentNode.children].indexOf(el);
}

export class Chips extends Component {
  chipsData: DataBit[];
  hasAutocomplete: boolean;
  autocomplete: Autocomplete;
  _input: HTMLInputElement;
  _label: any;
  _chips: HTMLElement[];
  private _handleChipClickBound: any;
  private _handleInputKeydownBound: any;
  private _handleInputFocusBound: any;
  private _handleInputBlurBound: any;
  static _keydown: boolean;
  private _selectedChip: any;

  constructor(el, options) {
    super(Chips, el, options);
    (this.el as any).M_Chips = this;
    this.options = {...Chips.defaults, ...options};

    this.el.classList.add('chips', 'input-field');
    this.chipsData = [];
    this._chips = [];
    this._setupInput();
    this.hasAutocomplete = Object.keys(this.options.autocompleteOptions).length > 0;

    // Set input id
    if (!this._input.getAttribute('id'))
      this._input.setAttribute('id', M.guid());

    // Render initial chips
    if (this.options.data.length) {
      this.chipsData = this.options.data;
      this._renderChips();
    }
    // Setup autocomplete if needed
    if (this.hasAutocomplete) this._setupAutocomplete();
    this._setPlaceholder();
    this._setupLabel();
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Chips;
  }

  getData() {
    return this.chipsData;
  }

  destroy() {
    this._removeEventHandlers();
    this._chips.forEach(c => c.remove());
    this._chips = [];
    (this.el as any).M_Chips = undefined;
  }

  _setupEventHandlers() {
    this._handleChipClickBound = this._handleChipClick.bind(this);
    this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
    this._handleInputFocusBound = this._handleInputFocus.bind(this);
    this._handleInputBlurBound = this._handleInputBlur.bind(this);
    this.el.addEventListener('click', this._handleChipClickBound);
    document.addEventListener('keydown', Chips._handleChipsKeydown);
    document.addEventListener('keyup', Chips._handleChipsKeyup);
    this.el.addEventListener('blur', Chips._handleChipsBlur, true);
    this._input.addEventListener('focus', this._handleInputFocusBound);
    this._input.addEventListener('blur', this._handleInputBlurBound);
    this._input.addEventListener('keydown', this._handleInputKeydownBound);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleChipClickBound);
    document.removeEventListener('keydown', Chips._handleChipsKeydown);
    document.removeEventListener('keyup', Chips._handleChipsKeyup);
    this.el.removeEventListener('blur', Chips._handleChipsBlur, true);
    this._input.removeEventListener('focus', this._handleInputFocusBound);
    this._input.removeEventListener('blur', this._handleInputBlurBound);
    this._input.removeEventListener('keydown', this._handleInputKeydownBound);
  }

  _handleChipClick(e) {
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

  static _handleChipsKeydown(e) {
    Chips._keydown = true;
    const chips = (<HTMLElement>e.target).closest('.chips');
    const chipsKeydown = e.target && chips;

    // Don't handle keydown inputs on input and textarea
    const tag = (<HTMLElement>e.target).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || !chipsKeydown) return;

    const currChips: Chips = (chips as any).M_Chips;
    // backspace and delete
    if (e.keyCode === 8 || e.keyCode === 46) {
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
    // left arrow key
    else if (e.keyCode === 37) {
      if (currChips._selectedChip) {
        const selectIndex = gGetIndex(currChips._selectedChip) - 1;
        if (selectIndex < 0) return;
        currChips.selectChip(selectIndex);
      }
    }
    // right arrow key
    else if (e.keyCode === 39) {
      if (currChips._selectedChip) {
        const selectIndex = gGetIndex(currChips._selectedChip) + 1;
        if (selectIndex >= currChips.chipsData.length)
          currChips._input.focus();
        else
          currChips.selectChip(selectIndex);
      }
    }
  }

  static _handleChipsKeyup(e) {
    Chips._keydown = false;
  }

  static _handleChipsBlur(e) {
    if (!Chips._keydown && document.hidden) {
      const chips = (<HTMLElement>e.target).closest('.chips');
      const currChips: Chips = (chips as any).M_Chips;
      currChips._selectedChip = null;
    }
  }

  _handleInputFocus() {
    this.el.classList.add('focus');
  }

  _handleInputBlur() {
    this.el.classList.remove('focus');
  }

  _handleInputKeydown(e) {
    Chips._keydown = true;
    // enter
    if (e.keyCode === 13) {
      // Override enter if autocompleting.
      if (this.hasAutocomplete && this.autocomplete && this.autocomplete.isOpen) {
        return;
      }
      e.preventDefault();
      if (!this.hasAutocomplete || (this.hasAutocomplete && !this.options.autocompleteOnly)) {
        this.addChip({id: this._input.value});
      }
      this._input.value = '';
      // delete or left
    }
    else if (
      (e.keyCode === 8 || e.keyCode === 37) &&
      this._input.value === '' &&
      this.chipsData.length
    ) {
      e.preventDefault();
      this.selectChip(this.chipsData.length - 1);
    }
  }

  _renderChip(chip: DataBit): HTMLDivElement {
    if (!chip.id) return;
    const renderedChip = document.createElement('div');
    renderedChip.classList.add('chip');
    renderedChip.innerText = chip.text || chip.id;
    renderedChip.setAttribute('tabindex', "0");
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('material-icons', 'close');
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
    // move input to end
    this.el.append(this._input);
  }

  _setupAutocomplete() {
    this.options.autocompleteOptions.onAutocomplete = (items) => {
      if (items.length > 0) this.addChip(items[0]);
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

  _isValidAndNotExist(chip: DataBit) {
    const isValid = !!chip.id;
    const doesNotExist = !this.chipsData.some(item => item.id == chip.id);
    return isValid && doesNotExist;
  }

  addChip(chip: DataBit) {
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
