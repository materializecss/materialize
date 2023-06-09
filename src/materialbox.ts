import { Component } from "./component";
import anim from "animejs";
import { M } from "./global";

const _defaults = {
  inDuration: 275,
  outDuration: 200,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null
};

export class Materialbox extends Component {
  el: HTMLElement;
  overlayActive: boolean;
  doneAnimating: boolean;
  caption: string;
  originalWidth: number;
  originalHeight: number;
  private originInlineStyles: string;
  private placeholder: HTMLElement;
  private _changedAncestorList: HTMLElement[];
  private newHeight: number;
  private newWidth: number;
  private windowWidth: number;
  private windowHeight: number;
  private attrWidth: string;
  private attrHeight: string;
  private _overlay: HTMLElement;
  private _photoCaption: HTMLElement;
  private _handleMaterialboxClickBound: any;
  private _handleWindowScrollBound: any;
  private _handleWindowResizeBound: any;
  private _handleWindowEscapeBound: any;

  constructor(el, options) {
    super(Materialbox, el, options);
    (this.el as any).M_Materialbox = this;
    this.options = {...Materialbox.defaults, ...options};
    this.overlayActive = false;
    this.doneAnimating = true;
    this.placeholder = document.createElement('div');
    this.placeholder.classList.add('material-placeholder');
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.originInlineStyles = this.el.getAttribute('style');
    this.caption = this.el.getAttribute('data-caption') || '';
    // Wrap
    this.el.before(this.placeholder);
    this.placeholder.append(this.el);
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
    return domElem.M_Materialbox;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_Materialbox = undefined;
    // Unwrap image
    //this.placeholder.after(this.el).remove();
    this.placeholder.remove();
    this.el.removeAttribute('style');
  }

  _setupEventHandlers() {
    this._handleMaterialboxClickBound = this._handleMaterialboxClick.bind(this);
    this.el.addEventListener('click', this._handleMaterialboxClickBound);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleMaterialboxClickBound);
  }

  _handleMaterialboxClick(e) {
    // If already modal, return to original
    if (this.doneAnimating === false || (this.overlayActive && this.doneAnimating))
      this.close();
    else
      this.open();
  }

  _handleWindowScroll() {
    if (this.overlayActive) this.close();
  }

  _handleWindowResize() {
    if (this.overlayActive) this.close();
  }

  _handleWindowEscape(e) {
    // ESC key
    if (e.keyCode === 27 && this.doneAnimating && this.overlayActive) this.close();
  }

  _makeAncestorsOverflowVisible() {
    this._changedAncestorList = [];
    let ancestor = this.placeholder.parentNode;
    while (ancestor !== null && ancestor !== document) {
      const curr = <HTMLElement>ancestor;
      if (curr.style.overflow !== 'visible') {
        curr.style.overflow = 'visible';
        this._changedAncestorList.push(curr);
      }
      ancestor = ancestor.parentNode;
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

  _animateImageIn() {
    this.el.style.maxHeight = this.newHeight.toString()+'px';
    this.el.style.maxWidth = this.newWidth.toString()+'px';

    const animOptions = {
      targets: this.el, // image
      height: [this.originalHeight, this.newHeight],
      width: [this.originalWidth, this.newWidth],
      left:
        M.getDocumentScrollLeft() +
        this.windowWidth / 2 -
        this._offset(this.placeholder).left -
        this.newWidth / 2,
      top:
        M.getDocumentScrollTop() +
        this.windowHeight / 2 -
        this._offset(this.placeholder).top -
        this.newHeight / 2,
      duration: this.options.inDuration,
      easing: 'easeOutQuad',
      complete: () => {
        this.doneAnimating = true;
        // onOpenEnd callback
        if (typeof this.options.onOpenEnd === 'function') {
          this.options.onOpenEnd.call(this, this.el);
        }
      }
    };
    // Override max-width or max-height if needed
    //const elStyle = this.el.style;
    //console.log('mh', elStyle.maxHeight, '->', this.newHeight);
    //console.log('mw', elStyle.maxWidth, '->', this.newWidth);
    //if (elStyle.maxWidth !== 'none') animOptions.maxWidth = this.newWidth;
    //if (elStyle.maxHeight !== 'none') animOptions.maxHeight = this.newHeight;
    //console.log('>>> animate');
    //console.log(JSON.stringify(animOptions));
    anim(animOptions);
  }

  _animateImageOut() {
    const animOptions = {
      targets: this.el,
      width: this.originalWidth,
      height: this.originalHeight,
      left: 0,
      top: 0,
      duration: this.options.outDuration,
      easing: 'easeOutQuad',
      complete: () => {
        this.placeholder.style.height = '';
        this.placeholder.style.width = '';
        this.placeholder.style.position = '';
        this.placeholder.style.top = '';
        this.placeholder.style.left = '';
        // Revert to width or height attribute
        if (this.attrWidth) this.el.setAttribute('width', this.attrWidth.toString());
        if (this.attrHeight) this.el.setAttribute('height', this.attrHeight.toString());
        this.el.removeAttribute('style');
        this.originInlineStyles && this.el.setAttribute('style', this.originInlineStyles);
        // Remove class
        this.el.classList.remove('active');
        this.doneAnimating = true;
        // Remove overflow overrides on ancestors
        this._changedAncestorList.forEach(anchestor => anchestor.style.overflow = '');
        // onCloseEnd callback
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this, this.el);
        }
      }
    };
    anim(animOptions);
  }

  _updateVars() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.caption = this.el.getAttribute('data-caption') || '';
  }

  open() {
    this._updateVars();
    this.originalWidth = this.el.getBoundingClientRect().width;
    this.originalHeight = this.el.getBoundingClientRect().height;
    // Set states
    this.doneAnimating = false;
    this.el.classList.add('active');
    this.overlayActive = true;
    // onOpenStart callback
    if (typeof this.options.onOpenStart === 'function') {
      this.options.onOpenStart.call(this, this.el);
    }
    // Set positioning for placeholder
    this.placeholder.style.width = this.placeholder.getBoundingClientRect().width+'px';
    this.placeholder.style.height = this.placeholder.getBoundingClientRect().height+'px';
    this.placeholder.style.position = 'relative';
    this.placeholder.style.top = '0';
    this.placeholder.style.left = '0';
    this._makeAncestorsOverflowVisible();
    // Set css on origin
    this.el.style.position = 'absolute';
    this.el.style.zIndex = '1000';
    this.el.style.willChange = 'left, top, width, height';
    // Change from width or height attribute to css
    this.attrWidth = this.el.getAttribute('width');
    this.attrHeight = this.el.getAttribute('height');
    if (this.attrWidth) {
      this.el.style.width = this.attrWidth+'px';
      this.el.removeAttribute('width');
    }
    if (this.attrHeight) {
      this.el.style.width = this.attrHeight+'px';
      this.el.removeAttribute('height');
    }
    // Add overlay
    this._overlay = document.createElement('div');
    this._overlay.id = 'materialbox-overlay';
    this._overlay.style.opacity = '0';
    this._overlay.addEventListener('click', e => {
      if (this.doneAnimating) this.close();
    }, {once: true});
    // Put before in origin image to preserve z-index layering.
    this.el.before(this._overlay);
    // Set dimensions if needed
    const overlayOffset = this._overlay.getBoundingClientRect();
    this._overlay.style.width = this.windowWidth+'px';
    this._overlay.style.height = this.windowHeight+'px';
    this._overlay.style.left = -1 * overlayOffset.left+'px';
    this._overlay.style.top = -1 * overlayOffset.top+'px';
    anim.remove(this.el);
    anim.remove(this._overlay);
    // Animate Overlay
    anim({
      targets: this._overlay,
      opacity: 1,
      duration: this.options.inDuration,
      easing: 'easeOutQuad'
    });
    // Add and animate caption if it exists
    if (this.caption !== '') {
      if (this._photoCaption) anim.remove(this._photoCaption);
      this._photoCaption = document.createElement('div');
      this._photoCaption.classList.add('materialbox-caption');
      this._photoCaption.innerText = this.caption;
      document.body.append(this._photoCaption);
      this._photoCaption.style.display = 'inline';
      anim({
        targets: this._photoCaption,
        opacity: 1,
        duration: this.options.inDuration,
        easing: 'easeOutQuad'
      });
    }

    // Resize Image
    const widthPercent = this.originalWidth / this.windowWidth;
    const heightPercent = this.originalHeight / this.windowHeight;
    this.newWidth = 0;
    this.newHeight = 0;
    if (widthPercent > heightPercent) {
      // Width first
      const ratio = this.originalHeight / this.originalWidth;
      this.newWidth = this.windowWidth * 0.9;
      this.newHeight = this.windowWidth * 0.9 * ratio;
    }
    else {
      // Height first
      const ratio = this.originalWidth / this.originalHeight;
      this.newWidth = this.windowHeight * 0.9 * ratio;
      this.newHeight = this.windowHeight * 0.9;
    }
    this._animateImageIn();

    // Handle Exit triggers
    this._handleWindowScrollBound = this._handleWindowScroll.bind(this);
    this._handleWindowResizeBound = this._handleWindowResize.bind(this);
    this._handleWindowEscapeBound = this._handleWindowEscape.bind(this);
    window.addEventListener('scroll', this._handleWindowScrollBound);
    window.addEventListener('resize', this._handleWindowResizeBound);
    window.addEventListener('keyup', this._handleWindowEscapeBound);
  }

  close() {
    this._updateVars();
    this.doneAnimating = false;
    // onCloseStart callback
    if (typeof this.options.onCloseStart === 'function') {
      this.options.onCloseStart.call(this, this.el);
    }
    anim.remove(this.el);
    anim.remove(this._overlay);
    if (this.caption !== '') anim.remove(this._photoCaption);
    // disable exit handlers
    window.removeEventListener('scroll', this._handleWindowScrollBound);
    window.removeEventListener('resize', this._handleWindowResizeBound);
    window.removeEventListener('keyup', this._handleWindowEscapeBound);
    anim({
      targets: this._overlay,
      opacity: 0,
      duration: this.options.outDuration,
      easing: 'easeOutQuad',
      complete: () => {
        this.overlayActive = false;
        this._overlay.remove();
      }
    });
    this._animateImageOut();
    // Remove Caption + reset css settings on image
    if (this.caption !== '') {
      anim({
        targets: this._photoCaption,
        opacity: 0,
        duration: this.options.outDuration,
        easing: 'easeOutQuad',
        complete: () => {
          this._photoCaption.remove();
        }
      });
    }
  }
}
