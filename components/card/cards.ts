import { Utils } from '../../src/utils';
import { Component, BaseOptions, InitElements, MElement, Openable } from '../../src/component';

interface CardsOptions extends BaseOptions {
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

class Cards extends Component<CardsOptions> implements Openable {
  readonly #cardReveal: HTMLElement | null;
  readonly #initialOverflow: string;
  #activators: HTMLElement[] | null;
  #cardRevealClose: HTMLElement | null;
  isOpen: boolean = false;

  constructor(el: HTMLElement, options: Partial<CardsOptions>) {
    super(el, options, Cards);
    this.el['M_Cards'] = this;
    this.options = {
      ...Cards.defaults,
      ...options
    };
    this.#activators = [];
    this.#cardReveal = this.el.querySelector('.card-reveal');
    if (this.#cardReveal) {
      this.#initialOverflow = getComputedStyle(this.el).overflow;
      this.#activators = Array.from(this.el.querySelectorAll('.activator'));
      this.#activators.forEach((el: HTMLElement) => {
        if (el) el.tabIndex = 0;
      });
      this.#cardRevealClose = this.#cardReveal?.querySelector('.card-title');
      if (this.#cardRevealClose) this.#cardRevealClose.tabIndex = -1;
      this.#cardReveal.ariaExpanded = 'false';
      this.#setupEventHandlers();
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
    this.#removeEventHandlers();
    this.#activators = [];
  }

  #setupEventHandlers = () => {
    this.#activators.forEach((el: HTMLElement) => {
      el.addEventListener('click', this.#handleClickInteraction);
      el.addEventListener('keypress', this.#handleKeypressEvent);
    });
  };

  #removeEventHandlers = () => {
    this.#activators.forEach((el: HTMLElement) => {
      el.removeEventListener('click', this.#handleClickInteraction);
      el.removeEventListener('keypress', this.#handleKeypressEvent);
    });
  };

  #handleClickInteraction = () => {
    this.#handleRevealEvent();
  };

  #handleKeypressEvent: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this.#handleRevealEvent();
    }
  };

  #handleRevealEvent = () => {
    this.#activators.forEach((el: HTMLElement) => (el.tabIndex = -1)); // Reveal Card
    this.open();
  };

  #setupRevealCloseEventHandlers = () => {
    this.#cardRevealClose.addEventListener('click', this.close);
    this.#cardRevealClose.addEventListener('keypress', this.#handleKeypressCloseEvent);
  };

  #removeRevealCloseEventHandlers = () => {
    this.#cardRevealClose.addEventListener('click', this.close);
    this.#cardRevealClose.addEventListener('keypress', this.#handleKeypressCloseEvent);
  };

  #handleKeypressCloseEvent: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
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
    this.#cardReveal.style.display = 'block';
    this.#cardReveal.ariaExpanded = 'true';
    this.#cardRevealClose.tabIndex = 0;
    setTimeout(() => {
      this.#cardReveal.style.transition = `transform ${this.options.outDuration}ms ease`; //easeInOutQuad
      this.#cardReveal.style.transform = 'translateY(-100%)';
    }, 1);
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen.call(this);
    }
    this.#setupRevealCloseEventHandlers();
  };

  /**
   * Hide card reveal.
   */
  close: () => void = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.#cardReveal.style.transition = `transform ${this.options.inDuration}ms ease`; //easeInOutQuad
    this.#cardReveal.style.transform = 'translateY(0)';
    setTimeout(() => {
      this.#cardReveal.style.display = 'none';
      this.#cardReveal.ariaExpanded = 'false';
      this.#activators.forEach((el: HTMLElement) => (el.tabIndex = 0));
      this.#cardRevealClose.tabIndex = -1;
      this.el.style.overflow = this.#initialOverflow;
    }, this.options.inDuration);
    if (typeof this.options.onClose === 'function') {
      this.options.onClose.call(this);
    }
    this.#removeRevealCloseEventHandlers();
  };

  static Init() {
    if (typeof document !== 'undefined')
      // Handle initialization of static cards.
      document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.card');
        cards.forEach((el) => {
          if (el && el['M_Card'] == undefined) this.init(el as HTMLElement);
        });
      });
  }
}

export { Cards, CardsOptions };
