import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface CharacterCounterOptions extends BaseOptions {};

const _defaults = Object.freeze({});

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export class CharacterCounter extends Component<{}> {
  
  declare el: InputElement;
  /** Stores the reference to the counter HTML element. */
  counterEl: HTMLSpanElement;
  /** Specifies whether the input is valid or not. */
  isInvalid: boolean;
  /** Specifies whether the input text has valid length or not. */
  isValidLength: boolean;

  constructor(el: HTMLInputElement | HTMLTextAreaElement, options: Partial<CharacterCounterOptions>) {
    super(el, {}, CharacterCounter);
    (this.el as any).M_CharacterCounter = this;

    this.options = {
      ...CharacterCounter.defaults,
      ...options
    };

    this.isInvalid = false;
    this.isValidLength = false;
    
    this._setupCounter();
    this._setupEventHandlers();
  }

  static get defaults(): CharacterCounterOptions {
    return _defaults;
  }

  /**
   * Initializes instance of CharacterCounter.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: InputElement, options?: Partial<CharacterCounterOptions>): CharacterCounter;
  /**
   * Initializes instances of CharacterCounter.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<InputElement | MElement>, options?: Partial<CharacterCounterOptions>): CharacterCounter[];
  /**
   * Initializes instances of CharacterCounter.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InputElement | InitElements<InputElement | MElement>, options: Partial<CharacterCounterOptions> = {}): CharacterCounter | CharacterCounter[] {
    return super.init(els, options, CharacterCounter);
  }

  static getInstance(el: InputElement): CharacterCounter {
    return (el as any).M_CharacterCounter;
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
    const maxLength = parseInt(this.el.getAttribute('maxlength')),
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
