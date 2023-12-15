import { Utils } from "./utils";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface ModalOptions extends BaseOptions {
  /**
   * Opacity of the modal overlay.
   * @default 0.5
   */
  opacity: number;
  /**
   * Transition in duration in milliseconds.
   * @default 250
   */
  inDuration: number;
  /**
   * Transition out duration in milliseconds.
   * @default 250
   */
  outDuration: number;
  /**
   * Prevent page from scrolling while modal is open.
   * @default true
   */
  preventScrolling: boolean;
  /**
   * Callback function called before modal is opened.
   * @default null
   */
  onOpenStart: (this: Modal, el: HTMLElement) => void;
  /**
   * Callback function called after modal is opened.
   * @default null
   */
  onOpenEnd: (this: Modal, el: HTMLElement) => void;
  /**
   * Callback function called before modal is closed.
   * @default null
   */
  onCloseStart: (el: HTMLElement) => void;
  /**
   * Callback function called after modal is closed.
   * @default null
   */
  onCloseEnd: (el: HTMLElement) => void;
  /**
   * Allow modal to be dismissed by keyboard or overlay click.
   * @default true
   */
  dismissible: boolean;
  /**
   * Starting top offset.
   * @default '4%'
   */
  startingTop: string;
  /**
   * Ending top offset.
   * @default '10%'
   */
  endingTop: string;
}

const _defaults = {
  opacity: 0.5,
  inDuration: 250,
  outDuration: 250,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null,
  preventScrolling: true,
  dismissible: true,
  startingTop: '4%',
  endingTop: '10%'
};

export class Modal extends Component<ModalOptions> {

  static _modalsOpen: number;
  static _count: number;
  
  /**
   * ID of the modal element.
   */
  id: string;
  /**
   * If the modal is open.
   */
  isOpen: boolean;
  
  private _openingTrigger: any;
  private _overlay: HTMLDivElement;
  private _nthModalOpened: number;

  constructor(el: HTMLElement, options: Partial<ModalOptions>) {
    super(el, options, Modal);
    (this.el as any).M_Modal = this;

    this.options = {
      ...Modal.defaults,
      ...options
    };
    
    this.isOpen = false;
    this.id = this.el.id;
    this._openingTrigger = undefined;
    console.log("create new overlay");
    this._overlay = document.createElement('div');
    this._overlay.classList.add('modal-overlay');
    this.el.tabIndex = 0;
    this._nthModalOpened = 0;
    Modal._count++;
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance of Modal.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<ModalOptions>): Modal;
  /**
   * Initializes instances of Modal.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<ModalOptions>): Modal[];
  /**
   * Initializes instances of Modal.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<ModalOptions> = {}): Modal | Modal[] {
    return super.init(els, options, Modal);
  }

  static getInstance(el: HTMLElement): Modal {
    return (el as any).M_Modal;
  }

  destroy() {
    Modal._count--;
    this._removeEventHandlers();
    this.el.removeAttribute('style');
    this._overlay.remove();
    (this.el as any).M_Modal = undefined;
  }

  _setupEventHandlers() {
    if (Modal._count === 1) {
      document.body.addEventListener('click', this._handleTriggerClick);
    }
    this._overlay.addEventListener('click', this._handleOverlayClick);
    this.el.addEventListener('click', this._handleModalCloseClick);
  }

  _removeEventHandlers() {
    if (Modal._count === 0) {
      document.body.removeEventListener('click', this._handleTriggerClick);
    }
    this._overlay.removeEventListener('click', this._handleOverlayClick);
    this.el.removeEventListener('click', this._handleModalCloseClick);
  }

  _handleTriggerClick = (e: MouseEvent) => {
    const trigger = (e.target as HTMLElement).closest('.modal-trigger');
    if (!trigger) return;
    const modalId = Utils.getIdFromTrigger(trigger as HTMLElement);
    const modalInstance = (document.getElementById(modalId) as any).M_Modal;
    if (modalInstance) modalInstance.open(trigger);
    e.preventDefault();
  }

  _handleOverlayClick = () => {
    if (this.options.dismissible) this.close();
  }

  _handleModalCloseClick = (e: MouseEvent) => {
    const closeTrigger = (e.target as HTMLElement).closest('.modal-close');
    if (closeTrigger) this.close();
  }

  _handleKeydown = (e: KeyboardEvent) => {
    if (Utils.keys.ESC.includes(e.key) && this.options.dismissible) this.close();
  }

  _handleFocus = (e: FocusEvent) => {
    // Only trap focus if this modal is the last model opened (prevents loops in nested modals).
    if (!this.el.contains(e.target as HTMLElement) && this._nthModalOpened === Modal._modalsOpen) {
      this.el.focus();
    }
  }

  _animateIn() {
    // Set initial styles
    this._overlay.style.display = 'block';
    this._overlay.style.opacity = '0';
    this.el.style.display = 'block';    
    this.el.style.opacity = '0';

    const duration = this.options.inDuration;
    const isBottomSheet = this.el.classList.contains('bottom-sheet');

    if (!isBottomSheet) {
      this.el.style.top = this.options.startingTop;
      this.el.style.transform = 'scaleX(0.9) scaleY(0.9)';
    }
    // Overlay
    this._overlay.style.transition = `opacity ${duration}ms ease-out`; // v1: easeOutQuad
    // Modal
    this.el.style.transition = `
      top ${duration}ms ease-out,
      bottom ${duration}ms ease-out,
      opacity ${duration}ms ease-out,
      transform ${duration}ms ease-out
    `;

    setTimeout(() => {
      this._overlay.style.opacity = this.options.opacity.toString();
      this.el.style.opacity = '1';
      if (isBottomSheet) {
        this.el.style.bottom = '0';
      }
      else {
        this.el.style.top = this.options.endingTop;    
        this.el.style.transform = 'scaleX(1) scaleY(1)';
      }
      setTimeout(() => {
        if (typeof this.options.onOpenEnd === 'function') {
          this.options.onOpenEnd.call(this, this.el, this._openingTrigger);
        }
      }, duration);
    }, 1);
  }

  _animateOut() {
    const duration = this.options.outDuration;
    const isBottomSheet = this.el.classList.contains('bottom-sheet');
    if (!isBottomSheet) {
      this.el.style.top = this.options.endingTop;
//      this.el.style.transform = 'scaleX(0.9) scaleY(0.9)';
    }

    // Overlay
    this._overlay.style.transition = `opacity ${duration}ms ease-out`; // v1: easeOutQuart

    // Modal // easeOutCubic
    this.el.style.transition = `
      top ${duration}ms ease-out,
      bottom ${duration}ms ease-out,
      opacity ${duration}ms ease-out,
      transform ${duration}ms ease-out
    `;

    setTimeout(() => {
      this._overlay.style.opacity = '0';
      this.el.style.opacity = '0';
      if (isBottomSheet) {
        this.el.style.bottom = '-100%';
      }
      else {
        this.el.style.top = this.options.startingTop;    
        this.el.style.transform = 'scaleX(0.9) scaleY(0.9)';
      }
      setTimeout(() => {
        this.el.style.display = 'none';
        this._overlay.remove();
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this, this.el);
        }
      }, duration);
    }, 1);
  }

  /**
   * Open modal.
   */
  open = (trigger?: HTMLElement): Modal => {
    if (this.isOpen) return;
    this.isOpen = true;
    Modal._modalsOpen++;
    this._nthModalOpened = Modal._modalsOpen;
    // Set Z-Index based on number of currently open modals
    this._overlay.style.zIndex = (1000 + Modal._modalsOpen * 2).toString();
    this.el.style.zIndex = (1000 + Modal._modalsOpen * 2 + 1).toString();
    // Set opening trigger, undefined indicates modal was opened by javascript
    this._openingTrigger = !!trigger ? trigger : undefined;
    // onOpenStart callback
    if (typeof this.options.onOpenStart === 'function') {
      this.options.onOpenStart.call(this, this.el, this._openingTrigger);
    }
    if (this.options.preventScrolling) {
      document.body.style.overflow = 'hidden';
    }
    this.el.classList.add('open');
    this.el.insertAdjacentElement('afterend', this._overlay);
    if (this.options.dismissible) {
      document.addEventListener('keydown', this._handleKeydown);
      document.addEventListener('focus', this._handleFocus, true);
    }
    this._animateIn();
    // Focus modal
    this.el.focus();
    return this;
  }

  /**
   * Close modal.
   */
  close = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    Modal._modalsOpen--;
    this._nthModalOpened = 0;
    // Call onCloseStart callback
    if (typeof this.options.onCloseStart === 'function') {
      this.options.onCloseStart.call(this, this.el);
    }
    this.el.classList.remove('open');
    // Enable body scrolling only if there are no more modals open.
    if (Modal._modalsOpen === 0) {
      document.body.style.overflow = '';
    }
    if (this.options.dismissible) {
      document.removeEventListener('keydown', this._handleKeydown);
      document.removeEventListener('focus', this._handleFocus, true);
    }
    this._animateOut();
    return this;
  }

  static{
    Modal._modalsOpen = 0;
    Modal._count = 0;
  }
}
