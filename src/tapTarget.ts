import { Component } from "./component";
import { M } from "./global";

let _defaults = {
  onOpen: undefined,
  onClose: undefined
};

export class TapTarget extends Component {
  el: HTMLElement
  isOpen: boolean;
  private wrapper: HTMLElement;
  private _handleDocumentClickBound: (this: HTMLElement, ev: MouseEvent) => any;
  private _origin: HTMLElement;
  private _handleTargetClickBound: EventListenerOrEventListenerObject;
  private originEl: HTMLElement;
  private _handleOriginClickBound: any;
  private _handleThrottledResizeBound: any;
  private waveEl: HTMLElement & Element & Node;
  private contentEl: HTMLElement;

  constructor(el, options) {
    super(TapTarget, el, options);
    (this.el as any).M_TapTarget = this;
    this.options = {...TapTarget.defaults, ...options};
    this.isOpen = false;
    // setup
    this._origin = document.querySelector('#'+this.el.getAttribute('data-target'));
    this._setup();
    this._calculatePositioning();
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
    return domElem.M_TapTarget;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).TapTarget = undefined;
  }

  _setupEventHandlers() {
    this._handleDocumentClickBound = this._handleDocumentClick.bind(this);
    this._handleTargetClickBound = this._handleTargetClick.bind(this);
    this._handleOriginClickBound = this._handleOriginClick.bind(this);
    this.el.addEventListener('click', this._handleTargetClickBound);
    this.originEl.addEventListener('click', this._handleOriginClickBound);
    // Resize
    let throttledResize = M.throttle(this._handleResize, 200);
    this._handleThrottledResizeBound = throttledResize.bind(this);
    window.addEventListener('resize', this._handleThrottledResizeBound);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleTargetClickBound);
    this.originEl.removeEventListener('click', this._handleOriginClickBound);
    window.removeEventListener('resize', this._handleThrottledResizeBound);
  }

  _handleTargetClick(e) {
    this.open();
  }

  _handleOriginClick(e) {
    this.close();
  }

  _handleResize(e) {
    this._calculatePositioning();
  }

  _handleDocumentClick(e) {
    if (!e.target.closest('.tap-target-wrapper')) {
      this.close();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  _setup() {
    // Creating tap target
    this.wrapper = this.el.parentElement;
    this.waveEl = this.wrapper.querySelector('.tap-target-wave');
    this.originEl = this.wrapper.querySelector('.tap-target-origin');
    this.contentEl = this.el.querySelector('.tap-target-content');
    // Creating wrapper
    if (!this.wrapper.classList.contains('.tap-target-wrapper')) {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('tap-target-wrapper');
      this.el.before(this.wrapper);
      this.wrapper.append(this.el);
    }
    // Creating content
    if (!this.contentEl) {
      this.contentEl = document.createElement('div');
      this.contentEl.classList.add('tap-target-content');
      this.el.append(this.contentEl);
    }
    // Creating foreground wave
    if (!this.waveEl) {
      this.waveEl = document.createElement('div');
      this.waveEl.classList.add('tap-target-wave');
      // Creating origin
      if (!this.originEl) {
        this.originEl = <HTMLElement>this._origin.cloneNode(true); // .clone(true, true);
        this.originEl.classList.add('tap-target-origin');
        this.originEl.removeAttribute('id');
        this.originEl.removeAttribute('style');
        this.waveEl.append(this.originEl);
      }
      this.wrapper.append(this.waveEl);
    }
  }

  private _offset(el) {
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }

  _calculatePositioning() {
    // Element or parent is fixed position?
    let isFixed = getComputedStyle(this._origin).position === 'fixed';
    if (!isFixed) {

      let currentElem: any = this._origin;
      const parents = [];
      while ((currentElem = currentElem.parentNode) && currentElem !== document)
        parents.push(currentElem);

      for (let i = 0; i < parents.length; i++) {
        isFixed = getComputedStyle(parents[i]).position === 'fixed';
        if (isFixed) break;
      }
    }
    // Calculating origin
    const originWidth = this._origin.offsetWidth;
    const originHeight = this._origin.offsetHeight;
    const originTop = isFixed ? this._offset(this._origin).top - M.getDocumentScrollTop() : this._offset(this._origin).top;
    const originLeft = isFixed ? this._offset(this._origin).left - M.getDocumentScrollLeft() : this._offset(this._origin).left;

    // Calculating screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollBarWidth = windowWidth - document.documentElement.clientWidth;
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    const isLeft = originLeft <= centerX;
    const isRight = originLeft > centerX;
    const isTop = originTop <= centerY;
    const isBottom = originTop > centerY;
    const isCenterX = originLeft >= windowWidth * 0.25 && originLeft <= windowWidth * 0.75;

    // Calculating tap target
    const tapTargetWidth = this.el.offsetWidth;
    const tapTargetHeight = this.el.offsetHeight;
    const tapTargetTop = originTop + originHeight / 2 - tapTargetHeight / 2;
    const tapTargetLeft = originLeft + originWidth / 2 - tapTargetWidth / 2;
    const tapTargetPosition = isFixed ? 'fixed' : 'absolute';

    // Calculating content
    const tapTargetTextWidth = isCenterX ? tapTargetWidth : tapTargetWidth / 2 + originWidth;
    const tapTargetTextHeight = tapTargetHeight / 2;
    const tapTargetTextTop = isTop ? tapTargetHeight / 2 : 0;
    const tapTargetTextBottom = 0;
    const tapTargetTextLeft = isLeft && !isCenterX ? tapTargetWidth / 2 - originWidth : 0;
    const tapTargetTextRight = 0;
    const tapTargetTextPadding = originWidth;
    const tapTargetTextAlign = isBottom ? 'bottom' : 'top';

    // Calculating wave
    const tapTargetWaveWidth = originWidth > originHeight ? originWidth * 2 : originWidth * 2;
    const tapTargetWaveHeight = tapTargetWaveWidth;
    const tapTargetWaveTop = tapTargetHeight / 2 - tapTargetWaveHeight / 2;
    const tapTargetWaveLeft = tapTargetWidth / 2 - tapTargetWaveWidth / 2;

    // Setting tap target
    this.wrapper.style.top = isTop ? tapTargetTop + 'px' : '';
    this.wrapper.style.right = isRight ? windowWidth - tapTargetLeft - tapTargetWidth - scrollBarWidth + 'px' : '';
    this.wrapper.style.bottom = isBottom ? windowHeight - tapTargetTop - tapTargetHeight + 'px' : '';
    this.wrapper.style.left = isLeft ? tapTargetLeft + 'px' : '';
    this.wrapper.style.position = tapTargetPosition;

    // Setting content
    this.contentEl.style.width = tapTargetTextWidth + 'px';
    this.contentEl.style.height = tapTargetTextHeight + 'px';
    this.contentEl.style.top = tapTargetTextTop + 'px';
    this.contentEl.style.right = tapTargetTextRight + 'px';
    this.contentEl.style.bottom = tapTargetTextBottom + 'px';
    this.contentEl.style.left = tapTargetTextLeft + 'px';
    this.contentEl.style.padding = tapTargetTextPadding + 'px';
    this.contentEl.style.verticalAlign = tapTargetTextAlign;

    // Setting wave
    this.waveEl.style.top = tapTargetWaveTop+'px';
    this.waveEl.style.left = tapTargetWaveLeft+'px';
    this.waveEl.style.width = tapTargetWaveWidth+'px';
    this.waveEl.style.height = tapTargetWaveHeight+'px';
  }

  open() {
    if (this.isOpen) return;
    // onOpen callback
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen.call(this, this._origin);
    }
    this.isOpen = true;
    this.wrapper.classList.add('open');
    document.body.addEventListener('click', this._handleDocumentClickBound, true);
    document.body.addEventListener('touchend', this._handleDocumentClickBound);
  }

  close() {
    if (!this.isOpen) return;
    // onClose callback
    if (typeof this.options.onClose === 'function') {
      this.options.onClose.call(this, this._origin);
    }
    this.isOpen = false;
    this.wrapper.classList.remove('open');
    document.body.removeEventListener('click', this._handleDocumentClickBound, true);
    document.body.removeEventListener('touchend', this._handleDocumentClickBound);
  }
}
