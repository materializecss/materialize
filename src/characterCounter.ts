import { Component } from "./component";

let _defaults = {};

export class CharacterCounter extends Component {
  isInvalid: boolean;
  isValidLength: boolean;
  counterEl: HTMLSpanElement;

  constructor(el: Element, options: Object) {
    super(CharacterCounter, el, options);
    (this.el as any).M_CharacterCounter = this;
    this.options = {...CharacterCounter.defaults, ...options};
    this.isInvalid = false;
    this.isValidLength = false;
    this._setupCounter();
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    let domElem = !!el.jquery ? el[0] : el;
    return domElem.M_CharacterCounter;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).CharacterCounter = undefined;
    this._removeCounter();
  }

  _setupEventHandlers() {
    this.el.addEventListener('focus', this.updateCounter, true);
    this.el.addEventListener('input', this.updateCounter, true);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('focus', this.updateCounter, true);
    this.el.removeEventListener('input', this.updateCounter, true);
  }

  _setupCounter() {
    this.counterEl = document.createElement('span');
    this.counterEl.classList.add('character-counter');
    this.counterEl.style.float = 'right';
    this.counterEl.style.fontSize = '12px';
    this.counterEl.style.height = '1';
    this.el.parentElement.appendChild(this.counterEl);
  }

  _removeCounter() {
    this.counterEl.remove();
  }

  updateCounter = () => {
    let maxLength = parseInt(this.el.getAttribute('data-length')),
      actualLength = (this.el as HTMLInputElement).value.length;

    this.isValidLength = actualLength <= maxLength;
    let counterString = actualLength.toString();
    if (maxLength) {
      counterString += '/' + maxLength;
      this._validateInput();
    }
    this.counterEl.innerHTML = counterString;
  }

  _validateInput() {
    if (this.isValidLength && this.isInvalid) {
      this.isInvalid = false;
      this.el.classList.remove('invalid');
    }
    else if (!this.isValidLength && !this.isInvalid) {
      this.isInvalid = true;
      this.el.classList.remove('valid');
      this.el.classList.add('invalid');
    }
  }
}
