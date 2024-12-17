import { Component, BaseOptions, InitElements, MElement } from './component';

// Obsolete for versions > 2.1.1

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
  //static _modalsOpen: number;
  //static _count: number;
  /**
   * ID of the modal element.
   */
  //id: string;
  /**
   * If the modal is open.
   */
  //isOpen: boolean;

  //private _openingTrigger: any;
  //private _overlay: HTMLDivElement;
  //private _nthModalOpened: number;

  constructor(el: HTMLElement, options: Partial<ModalOptions>) {
    super(el, options, Modal);
    (this.el as any).M_Modal = this;
    this.options = {
      ...Modal.defaults,
      ...options
    };
    this.el.tabIndex = 0;
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance of Modal.
   * @param el HTML element.
   * @param options Component options.
   * @returns {Modal}
   */
  static init(el: HTMLElement, options?: Partial<ModalOptions>): Modal;
  /**
   * Initializes instances of Modal.
   * @param els HTML elements.
   * @param options Component options.
   * @returns {Modal[]}
   */
  static init(els: InitElements<MElement>, options?: Partial<ModalOptions>): Modal[];
  /**
   * Initializes instances of Modal.
   * @param els HTML elements.
   * @param options Component options.
   * @returns {Modal | Modal[]}
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<ModalOptions> = {}
  ): Modal | Modal[] {
    return super.init(els, options, Modal);
  }

  static getInstance(el: HTMLElement): Modal {
    return (el as any).M_Modal;
  }

  destroy() {
    //Modal._count--;
    this._removeEventHandlers();
    //this.el.removeAttribute('style');
    //this._overlay.remove();
    (this.el as any).M_Modal = undefined;
  }

  _setupEventHandlers() {}
  _removeEventHandlers() {}
  _handleTriggerClick = (e: MouseEvent) => {};
  _handleOverlayClick = () => {};
  _handleModalCloseClick = (e: MouseEvent) => {};
  _handleKeydown = (e: KeyboardEvent) => {};
  _handleFocus = (e: FocusEvent) => {};

  /**
   * Open modal.
   */
  open(): Modal {
    return this;
  }

  /**
   * Close modal.
   */
  close(): Modal {
    return this;
  }

  // Experimental!
  // also note: https://stackoverflow.com/a/35385518/8830502
  static createHtml(children: string = ''): string {
    return `<dialog id="modal1" class="modal">
      <div class="modal-content">
        <h4>${children}</h4>
        <p>A bunch of text</p>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect btn-flat">Agree</a>
      </div>
    </dialog>`;
  }

  static {}
}
