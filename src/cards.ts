import { Utils } from './utils';
import { Component, BaseOptions, InitElements, MElement, Openable } from './component';

export interface CardsOptions extends BaseOptions {
  onOpen: (el: Element) => void;
  onClose: (el: Element) => void;
  inDuration: number;
  outDuration: number;
}

const _defaults: CardsOptions = {
  onOpen: null,
  onClose: null,
  inDuration: 225,
  outDuration: 300
};

export class Cards extends Component<CardsOptions> implements Openable {
  isOpen: boolean = false;
  private readonly cardReveal: HTMLElement | null;
  private readonly initialOverflow: string;
  private _activators: HTMLElement[] | null;
  private cardRevealClose: HTMLElement | null;

  constructor(el: HTMLElement, options: Partial<CardsOptions>) {
    super(el, options, Cards);
    this.el['M_Cards'] = this;

    this.options = {
      ...Cards.defaults,
      ...options
    };

    this.cardReveal = this.el.querySelector('.card-reveal');
    if (this.cardReveal) {
      this.initialOverflow = getComputedStyle(this.el).overflow;
      this._activators = Array.from(this.el.querySelectorAll('.activator'));
      this._activators.forEach((el: HTMLElement) => {
        if (el) el.tabIndex = 0;
      });

      this.cardRevealClose = this.cardReveal?.querySelector('.card-title');
      if (this.cardRevealClose) this.cardRevealClose.tabIndex = -1;

      this.cardReveal.ariaExpanded = 'false';
      this._setupEventHandlers();
    }
  }

  static get defaults(): CardsOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Cards.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<CardsOptions>): Cards;
  /**
   * Initializes instances of Cards.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<CardsOptions>): Cards[];
  /**
   * Initializes instances of Cards.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options?: Partial<CardsOptions>
  ): Cards | Cards[] {
    return super.init(els, options, Cards);
  }

  static getInstance(el: HTMLElement): Cards {
    return el['M_Cards'];
  }

  /**
   * {@inheritDoc}
   */
  destroy() {
    this._removeEventHandlers();
    this._activators = [];
  }

  _setupEventHandlers = () => {
    this._activators.forEach((el: HTMLElement) => {
      el.addEventListener('click', this._handleClickInteraction);
      el.addEventListener('keypress', this._handleKeypressEvent);
    });
  };

  _removeEventHandlers = () => {
    this._activators.forEach((el: HTMLElement) => {
      el.removeEventListener('click', this._handleClickInteraction);
      el.removeEventListener('keypress', this._handleKeypressEvent);
    });
  };

  _handleClickInteraction = () => {
    this._handleRevealEvent();
  };

  _handleKeypressEvent: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this._handleRevealEvent();
    }
  };

  _handleRevealEvent = () => {
    // Reveal Card
    this._activators.forEach((el: HTMLElement) => (el.tabIndex = -1));
    this.open();
  };

  _setupRevealCloseEventHandlers = () => {
    this.cardRevealClose.addEventListener('click', this.close);
    this.cardRevealClose.addEventListener('keypress', this._handleKeypressCloseEvent);
  };

  _removeRevealCloseEventHandlers = () => {
    this.cardRevealClose.addEventListener('click', this.close);
    this.cardRevealClose.addEventListener('keypress', this._handleKeypressCloseEvent);
  };

  _handleKeypressCloseEvent: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this.close();
    }
  };

  /**
   * Show card reveal.
   */
  open: () => void = () => {
    if (this.isOpen) return;
    this.isOpen = true;
    this.el.style.overflow = 'hidden';
    this.cardReveal.style.display = 'block';
    this.cardReveal.ariaExpanded = 'true';
    this.cardRevealClose.tabIndex = 0;
    setTimeout(() => {
      this.cardReveal.style.transition = `transform ${this.options.outDuration}ms ease`; //easeInOutQuad
      this.cardReveal.style.transform = 'translateY(-100%)';
    }, 1);
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen.call(this);
    }
    this._setupRevealCloseEventHandlers();
  };

  /**
   * Hide card reveal.
   */
  close: () => void = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.cardReveal.style.transition = `transform ${this.options.inDuration}ms ease`; //easeInOutQuad
    this.cardReveal.style.transform = 'translateY(0)';
    setTimeout(() => {
      this.cardReveal.style.display = 'none';
      this.cardReveal.ariaExpanded = 'false';
      this._activators.forEach((el: HTMLElement) => (el.tabIndex = 0));
      this.cardRevealClose.tabIndex = -1;
      this.el.style.overflow = this.initialOverflow;
    }, this.options.inDuration);
    if (typeof this.options.onClose === 'function') {
      this.options.onClose.call(this);
    }
    this._removeRevealCloseEventHandlers();
  };
}
