import { Utils } from './utils';
import { BaseOptions, Component, InitElements, MElement } from './component';

export interface MaterialboxOptions extends BaseOptions {
  /**
   * Transition in duration in milliseconds.
   * @default 275
   */
  inDuration: number;
  /**
   * Transition out duration in milliseconds.
   * @default 200
   */
  outDuration: number;
  /**
   * Callback function called before materialbox is opened.
   * @default null
   */
  onOpenStart: (el: Element) => void;
  /**
   * Callback function called after materialbox is opened.
   * @default null
   */
  onOpenEnd: (el: Element) => void;
  /**
   * Callback function called before materialbox is closed.
   * @default null
   */
  onCloseStart: (el: Element) => void;
  /**
   * Callback function called after materialbox is closed.
   * @default null
   */
  onCloseEnd: (el: Element) => void;
}

const _defaults: MaterialboxOptions = {
  inDuration: 275,
  outDuration: 200,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null
};

export class Materialbox extends Component<MaterialboxOptions> {
  /** If the materialbox overlay is showing. */
  overlayActive: boolean;
  /** If the materialbox is no longer being animated. */
  doneAnimating: boolean;
  /** Caption, if specified. */
  caption: string;
  /** Original width of image. */
  originalWidth: number;
  /** Original height of image. */
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

  constructor(el: HTMLElement, options: Partial<MaterialboxOptions>) {
    super(el, options, Materialbox);
    this.el['M_Materialbox'] = this;

    this.options = {
      ...Materialbox.defaults,
      ...options
    };

    this.overlayActive = false;
    this.doneAnimating = true;
    this.placeholder = document.createElement('div');
    this.placeholder.classList.add('material-placeholder');
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.originInlineStyles = this.el.getAttribute('style');
    this.caption = this.el.getAttribute('data-caption') || '';
    this.el.tabIndex = 0;
    // Wrap
    this.el.before(this.placeholder);
    this.placeholder.append(this.el);
    this._setupEventHandlers();
  }

  static get defaults(): MaterialboxOptions {
    return _defaults;
  }

  /**
   * Initializes instance of MaterialBox.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<MaterialboxOptions>): Materialbox;
  /**
   * Initializes instances of MaterialBox.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<MaterialboxOptions>): Materialbox[];
  /**
   * Initializes instances of MaterialBox.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<MaterialboxOptions> = {}
  ): Materialbox | Materialbox[] {
    return super.init(els, options, Materialbox);
  }

  static getInstance(el: HTMLElement): Materialbox {
    return el['M_Materialbox'];
  }

  destroy() {
    this._removeEventHandlers();
    this.el['M_Materialbox'] = undefined;
    // Unwrap image
    //this.placeholder.after(this.el).remove();
    this.placeholder.remove();
    this.el.removeAttribute('style');
  }

  private _setupEventHandlers() {
    this.el.addEventListener('click', this._handleMaterialboxClick);
    this.el.addEventListener('keypress', this._handleMaterialboxKeypress);
  }

  private _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleMaterialboxClick);
    this.el.removeEventListener('keypress', this._handleMaterialboxKeypress);
  }

  private _handleMaterialboxClick = () => {
    this._handleMaterialboxToggle();
  };

  private _handleMaterialboxKeypress = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this._handleMaterialboxToggle();
    }
  };

  private _handleMaterialboxToggle = () => {
    // If already modal, return to original
    if (this.doneAnimating === false || (this.overlayActive && this.doneAnimating)) this.close();
    else this.open();
  };

  private _handleWindowScroll = () => {
    if (this.overlayActive) this.close();
  };

  private _handleWindowResize = () => {
    if (this.overlayActive) this.close();
  };

  private _handleWindowEscape = (e: KeyboardEvent) => {
    if (Utils.keys.ESC.includes(e.key) && this.doneAnimating && this.overlayActive) this.close();
  };

  private _makeAncestorsOverflowVisible() {
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

  private _offset(el: HTMLElement) {
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;
    return {
      top: box.top + window.scrollY - docElem.clientTop,
      left: box.left + window.scrollX - docElem.clientLeft
    };
  }
  private _updateVars(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.caption = this.el.getAttribute('data-caption') || '';
  }

  // Image
  private _animateImageIn(): void {
    this.el.style.maxHeight = this.newHeight.toString() + 'px';
    this.el.style.maxWidth = this.newWidth.toString() + 'px';
    const duration = this.options.inDuration;
    // from
    this.el.style.transition = 'none';
    this.el.style.height = this.originalHeight + 'px';
    this.el.style.width = this.originalWidth + 'px';
    setTimeout(() => {
      // easeOutQuad
      this.el.style.transition = `height ${duration}ms ease,
        width ${duration}ms ease,
        left ${duration}ms ease,
        top ${duration}ms ease
      `;
      // to
      this.el.style.height = this.newHeight + 'px';
      this.el.style.width = this.newWidth + 'px';
      this.el.style.left =
        Utils.getDocumentScrollLeft() +
        this.windowWidth / 2 -
        this._offset(this.placeholder).left -
        this.newWidth / 2 +
        'px';

      this.el.style.top =
        Utils.getDocumentScrollTop() +
        this.windowHeight / 2 -
        this._offset(this.placeholder).top -
        this.newHeight / 2 +
        'px';
    }, 1);

    setTimeout(() => {
      this.doneAnimating = true;
      if (typeof this.options.onOpenEnd === 'function') this.options.onOpenEnd.call(this, this.el);
    }, duration);

    /*
    anim({
      targets: this.el, // image
      height: [this.originalHeight, this.newHeight],
      width: [this.originalWidth, this.newWidth],
      left:
        Utils.getDocumentScrollLeft() +
        this.windowWidth / 2 -
        this._offset(this.placeholder).left -
        this.newWidth / 2,
      top:
        Utils.getDocumentScrollTop() +
        this.windowHeight / 2 -
        this._offset(this.placeholder).top -
        this.newHeight / 2,

      duration: this.options.inDuration,
      easing: 'easeOutQuad',
      complete: () => {
        this.doneAnimating = true;
        if (typeof this.options.onOpenEnd === 'function') this.options.onOpenEnd.call(this, this.el);
      }
    });
    */
  }
  private _animateImageOut(): void {
    const duration = this.options.outDuration;
    // easeOutQuad
    this.el.style.transition = `height ${duration}ms ease,
      width ${duration}ms ease,
      left ${duration}ms ease,
      top ${duration}ms ease
    `;
    // to
    this.el.style.height = this.originalWidth + 'px';
    this.el.style.width = this.originalWidth + 'px';
    this.el.style.left = '0';
    this.el.style.top = '0';
    setTimeout(() => {
      this.placeholder.style.height = '';
      this.placeholder.style.width = '';
      this.placeholder.style.position = '';
      this.placeholder.style.top = '';
      this.placeholder.style.left = '';
      // Revert to width or height attribute
      if (this.attrWidth) this.el.setAttribute('width', this.attrWidth.toString());
      if (this.attrHeight) this.el.setAttribute('height', this.attrHeight.toString());
      this.el.removeAttribute('style');
      if (this.originInlineStyles) this.el.setAttribute('style', this.originInlineStyles);
      // Remove class
      this.el.classList.remove('active');
      this.doneAnimating = true;
      // Remove overflow overrides on ancestors
      this._changedAncestorList.forEach((anchestor) => (anchestor.style.overflow = ''));
      // onCloseEnd callback
      if (typeof this.options.onCloseEnd === 'function')
        this.options.onCloseEnd.call(this, this.el);
    }, duration);
  }

  // Caption
  private _addCaption(): void {
    this._photoCaption = document.createElement('div');
    this._photoCaption.classList.add('materialbox-caption');
    this._photoCaption.innerText = this.caption;
    document.body.append(this._photoCaption);
    this._photoCaption.style.display = 'inline';
    // Animate
    this._photoCaption.style.transition = 'none';
    this._photoCaption.style.opacity = '0';
    const duration = this.options.inDuration;
    setTimeout(() => {
      this._photoCaption.style.transition = `opacity ${duration}ms ease`;
      this._photoCaption.style.opacity = '1';
    }, 1);
  }
  private _removeCaption(): void {
    const duration = this.options.outDuration;
    this._photoCaption.style.transition = `opacity ${duration}ms ease`;
    this._photoCaption.style.opacity = '0';
    setTimeout(() => {
      this._photoCaption.remove();
    }, duration);
  }

  // Overlay
  private _addOverlay(): void {
    this._overlay = document.createElement('div');
    this._overlay.id = 'materialbox-overlay';
    this._overlay.addEventListener(
      'click',
      () => {
        if (this.doneAnimating) this.close();
      },
      { once: true }
    );

    // Put before in origin image to preserve z-index layering.
    this.el.before(this._overlay);

    // Set dimensions if needed
    const overlayOffset = this._overlay.getBoundingClientRect();
    this._overlay.style.width = this.windowWidth + 'px';
    this._overlay.style.height = this.windowHeight + 'px';
    this._overlay.style.left = -1 * overlayOffset.left + 'px';
    this._overlay.style.top = -1 * overlayOffset.top + 'px';

    // Animate
    this._overlay.style.transition = 'none';
    this._overlay.style.opacity = '0';
    const duration = this.options.inDuration;
    setTimeout(() => {
      this._overlay.style.transition = `opacity ${duration}ms ease`;
      this._overlay.style.opacity = '1';
    }, 1);
  }
  private _removeOverlay(): void {
    const duration = this.options.outDuration;
    this._overlay.style.transition = `opacity ${duration}ms ease`;
    this._overlay.style.opacity = '0';
    setTimeout(() => {
      this.overlayActive = false;
      this._overlay.remove();
    }, duration);
  }

  /**
   * Open materialbox.
   */
  open = () => {
    this._updateVars();
    this.originalWidth = this.el.getBoundingClientRect().width;
    this.originalHeight = this.el.getBoundingClientRect().height;
    // Set states
    this.doneAnimating = false;
    this.el.classList.add('active');
    this.overlayActive = true;
    // onOpenStart callback
    if (typeof this.options.onOpenStart === 'function')
      this.options.onOpenStart.call(this, this.el);
    // Set positioning for placeholder
    this.placeholder.style.width = this.placeholder.getBoundingClientRect().width + 'px';
    this.placeholder.style.height = this.placeholder.getBoundingClientRect().height + 'px';
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
      this.el.style.width = this.attrWidth + 'px';
      this.el.removeAttribute('width');
    }
    if (this.attrHeight) {
      this.el.style.width = this.attrHeight + 'px';
      this.el.removeAttribute('height');
    }
    this._addOverlay();
    // Add and animate caption if it exists
    if (this.caption !== '') this._addCaption();
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
    } else {
      // Height first
      const ratio = this.originalWidth / this.originalHeight;
      this.newWidth = this.windowHeight * 0.9 * ratio;
      this.newHeight = this.windowHeight * 0.9;
    }
    this._animateImageIn();
    // Handle Exit triggers
    window.addEventListener('scroll', this._handleWindowScroll);
    window.addEventListener('resize', this._handleWindowResize);
    window.addEventListener('keyup', this._handleWindowEscape);
  };

  /**
   * Close materialbox.
   */
  close = () => {
    this._updateVars();
    this.doneAnimating = false;
    // onCloseStart callback
    if (typeof this.options.onCloseStart === 'function')
      this.options.onCloseStart.call(this, this.el);
    //anim.remove(this.el);
    //anim.remove(this._overlay);
    //if (this.caption !== '') anim.remove(this._photoCaption);
    // disable exit handlers
    window.removeEventListener('scroll', this._handleWindowScroll);
    window.removeEventListener('resize', this._handleWindowResize);
    window.removeEventListener('keyup', this._handleWindowEscape);
    this._removeOverlay();
    this._animateImageOut();
    if (this.caption !== '') this._removeCaption();
  };
}
