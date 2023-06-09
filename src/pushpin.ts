import { Component } from "./component";
import { M } from "./global";

let _defaults = {
  top: 0,
  bottom: Infinity,
  offset: 0,
  onPositionChange: null
};

export class Pushpin extends Component {
  static _pushpins: any[];
  originalOffset: any;

  constructor(el, options) {
    super(Pushpin, el, options);
    (this.el as any).M_Pushpin = this;
    this.options = {...Pushpin.defaults, ...options};
    this.originalOffset = (this.el as HTMLElement).offsetTop;
    Pushpin._pushpins.push(this);
    this._setupEventHandlers();
    this._updatePosition();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    let domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Pushpin;
  }

  destroy() {
    (this.el as HTMLElement).style.top = null;
    this._removePinClasses();
    // Remove pushpin Inst
    let index = Pushpin._pushpins.indexOf(this);
    Pushpin._pushpins.splice(index, 1);
    if (Pushpin._pushpins.length === 0) {
      this._removeEventHandlers();
    }
    (this.el as any).M_Pushpin = undefined;
  }

  static _updateElements() {
    for (let elIndex in Pushpin._pushpins) {
      let pInstance = Pushpin._pushpins[elIndex];
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
    let scrolled = M.getDocumentScrollTop() + this.options.offset;

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
