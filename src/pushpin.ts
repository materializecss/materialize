import { Utils } from "./utils";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface PushpinOptions extends BaseOptions {
  /**
   * The distance in pixels from the top of the page where
   * the element becomes fixed.
   * @default 0
   */
  top: number;
  /**
   * The distance in pixels from the top of the page where
   * the elements stops being fixed.
   * @default Infinity
   */
  bottom: number;
  /**
   * The offset from the top the element will be fixed at.
   * @default 0
   */
  offset: number;
  /**
   * Callback function called when pushpin position changes.
   * You are provided with a position string.
   * @default null
   */
  onPositionChange: (position: "pinned" | "pin-top" | "pin-bottom") => void;
}

const _defaults = {
  top: 0,
  bottom: Infinity,
  offset: 0,
  onPositionChange: null
};

export class Pushpin extends Component<PushpinOptions> {
  static _pushpins: any[];
  originalOffset: any;

  constructor(el: HTMLElement, options: Partial<PushpinOptions>) {
    super(el, options, Pushpin);
    (this.el as any).M_Pushpin = this;

    this.options = {
      ...Pushpin.defaults,
      ...options
    };

    this.originalOffset = (this.el as HTMLElement).offsetTop;
    Pushpin._pushpins.push(this);
    this._setupEventHandlers();
    this._updatePosition();
  }

  static get defaults(): PushpinOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Pushpin.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<PushpinOptions>): Pushpin;
  /**
   * Initializes instances of Pushpin.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<PushpinOptions>): Pushpin[];
  /**
   * Initializes instances of Pushpin.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<PushpinOptions> = {}): Pushpin | Pushpin[] {
    return super.init(els, options, Pushpin);
  }

  static getInstance(el: HTMLElement): Pushpin {
    return (el as any).M_Pushpin;
  }

  destroy() {
    (this.el as HTMLElement).style.top = null;
    this._removePinClasses();
    // Remove pushpin Inst
    const index = Pushpin._pushpins.indexOf(this);
    Pushpin._pushpins.splice(index, 1);
    if (Pushpin._pushpins.length === 0) {
      this._removeEventHandlers();
    }
    (this.el as any).M_Pushpin = undefined;
  }

  static _updateElements() {
    for (const elIndex in Pushpin._pushpins) {
      const pInstance = Pushpin._pushpins[elIndex];
      pInstance._updatePosition();
    }
  }

  _setupEventHandlers() {
    document.addEventListener('scroll', Pushpin._updateElements);
  }

  _removeEventHandlers() {
    document.removeEventListener('scroll', Pushpin._updateElements);
  }

  _updatePosition() {
    const scrolled = Utils.getDocumentScrollTop() + this.options.offset;

    if (
      this.options.top <= scrolled &&
      this.options.bottom >= scrolled &&
      !this.el.classList.contains('pinned')
    ) {
      this._removePinClasses();
      (this.el as HTMLElement).style.top = `${this.options.offset}px`;
      this.el.classList.add('pinned');

      // onPositionChange callback
      if (typeof this.options.onPositionChange === 'function') {
        this.options.onPositionChange.call(this, 'pinned');
      }
    }

    // Add pin-top (when scrolled position is above top)
    if (scrolled < this.options.top && !this.el.classList.contains('pin-top')) {
      this._removePinClasses();
      (this.el as HTMLElement).style.top = '0';
      this.el.classList.add('pin-top');

      // onPositionChange callback
      if (typeof this.options.onPositionChange === 'function') {
        this.options.onPositionChange.call(this, 'pin-top');
      }
    }

    // Add pin-bottom (when scrolled position is below bottom)
    if (scrolled > this.options.bottom && !this.el.classList.contains('pin-bottom')) {
      this._removePinClasses();
      this.el.classList.add('pin-bottom');
      (this.el as HTMLElement).style.top = `${this.options.bottom - this.originalOffset}px`;

      // onPositionChange callback
      if (typeof this.options.onPositionChange === 'function') {
        this.options.onPositionChange.call(this, 'pin-bottom');
      }
    }
  }

  _removePinClasses() {
    // IE 11 bug (can't remove multiple classes in one line)
    this.el.classList.remove('pin-top');
    this.el.classList.remove('pinned');
    this.el.classList.remove('pin-bottom');
  }

  static {
    Pushpin._pushpins = [];
  }
}
