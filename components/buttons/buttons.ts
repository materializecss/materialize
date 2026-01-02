import { Component, BaseOptions, InitElements, MElement, Openable } from '../../src/component';
import { Utils } from '../../src/utils';

interface FloatingActionButtonOptions extends BaseOptions {
  /**
   * Direction FAB menu opens.
   * @default "top"
   */
  direction: 'top' | 'right' | 'bottom' | 'left';
  /**
   * true: FAB menu appears on hover, false: FAB menu appears on click.
   * @default true
   */
  hoverEnabled: boolean;
  /**
   * Enable transit the FAB into a toolbar on click.
   * @default false
   */
  toolbarEnabled: boolean;
}

const _defaults: FloatingActionButtonOptions = {
  direction: 'top',
  hoverEnabled: true,
  toolbarEnabled: false
};

class FloatingActionButton extends Component<FloatingActionButtonOptions> implements Openable {
  #anchor: HTMLAnchorElement;
  #menu: HTMLElement | null;
  #floatingBtns: HTMLElement[];
  #floatingBtnsReverse: HTMLElement[];

  /**
   * Describes open/close state of FAB.
   */
  isOpen: boolean;
  offsetY: number;
  offsetX: number;
  btnBottom: number;
  btnLeft: number;
  btnWidth: number;

  constructor(el: HTMLElement, options: Partial<FloatingActionButtonOptions>) {
    super(el, options, FloatingActionButton);
    this.el['M_FloatingActionButton'] = this;

    this.options = {
      ...FloatingActionButton.defaults,
      ...options
    };

    this.isOpen = false;
    this.#anchor = this.el.querySelector('a');
    this.#menu = this.el.querySelector('ul');
    this.#floatingBtns = Array.from(this.el.querySelectorAll('ul .btn-floating'));
    this.#floatingBtnsReverse = this.#floatingBtns.reverse();
    this.offsetY = 0;
    this.offsetX = 0;

    this.el.classList.add(`direction-${this.options.direction}`);
    this.#anchor.tabIndex = 0;
    this.#menu.ariaExpanded = 'false';
    if (this.options.direction === 'top') this.offsetY = 40;
    else if (this.options.direction === 'right') this.offsetX = -40;
    else if (this.options.direction === 'bottom') this.offsetY = -40;
    else this.offsetX = 40;
    this.#setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance of FloatingActionButton.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(
    el: HTMLElement,
    options?: Partial<FloatingActionButtonOptions>
  ): FloatingActionButton;
  /**
   * Initializes instances of FloatingActionButton.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: InitElements<MElement>,
    options?: Partial<FloatingActionButtonOptions>
  ): FloatingActionButton[];
  /**
   * Initializes instances of FloatingActionButton.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<FloatingActionButtonOptions> = {}
  ): FloatingActionButton | FloatingActionButton[] {
    return super.init(els, options, FloatingActionButton);
  }

  static getInstance(el: HTMLElement): FloatingActionButton {
    return el['M_FloatingActionButton'];
  }

  destroy() {
    this.#removeEventHandlers();
    this.el['M_FloatingActionButton'] = undefined;
  }

  #setupEventHandlers() {
    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.addEventListener('mouseenter', this.open);
      this.el.addEventListener('mouseleave', this.close);
    } else {
      this.el.addEventListener('click', this.#handleFABClick);
    }
    this.el.addEventListener('keypress', this.#handleFABKeyPress);
  }

  #removeEventHandlers() {
    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.removeEventListener('mouseenter', this.open);
      this.el.removeEventListener('mouseleave', this.close);
    } else {
      this.el.removeEventListener('click', this.#handleFABClick);
    }
    this.el.removeEventListener('keypress', this.#handleFABKeyPress);
  }

  #handleFABClick = () => {
    this.#handleFABToggle();
  };

  #handleFABKeyPress = (e) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this.#handleFABToggle();
    }
  };

  #handleFABToggle = () => {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  #handleDocumentClick = (e: MouseEvent) => {
    const elem = e.target;
    if (elem !== this.#menu) this.close();
  };

  /**
   * Open FAB.
   */
  open = (): void => {
    if (this.isOpen) return;
    if (this.options.toolbarEnabled) this.#animateInToolbar();
    else this.#animateInFAB();
    this.isOpen = true;
  };

  /**
   * Close FAB.
   */
  close = (): void => {
    if (!this.isOpen) return;
    if (this.options.toolbarEnabled) {
      window.removeEventListener('scroll', this.close, true);
      document.body.removeEventListener('click', this.#handleDocumentClick, true);
    } else {
      this.#animateOutFAB();
    }
    this.isOpen = false;
  };

  #animateInFAB() {
    this.el.classList.add('active');
    this.#menu.ariaExpanded = 'true';
    const delayIncrement = 40;
    const duration = 275;

    this.#floatingBtnsReverse.forEach((el, index) => {
      const delay = delayIncrement * index;
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(0.4)`;
      setTimeout(() => {
        // from:
        el.style.opacity = '0.4';
        // easeInOutQuad
        setTimeout(() => {
          // to:
          el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
          el.style.opacity = '1';
          el.style.transform = 'translate(0, 0) scale(1)';
          el.tabIndex = 0;
        }, 1);
      }, delay);
    });
  }

  #animateOutFAB() {
    const duration = 175;
    setTimeout(() => {
      this.el.classList.remove('active');
      this.#menu.ariaExpanded = 'false';
    }, duration);
    this.#floatingBtnsReverse.forEach((el) => {
      el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      // to
      el.style.opacity = '0';
      el.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(0.4)`;
      el.tabIndex = -1;
    });
  }

  #animateInToolbar() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnRect = this.el.getBoundingClientRect();

    const backdrop = document.createElement('div'),
      scaleFactor = windowWidth / backdrop[0].clientWidth,
      fabColor = getComputedStyle(this.#anchor).backgroundColor; // css('background-color');
    backdrop.classList.add('fab-backdrop'); //  $('<div class="fab-backdrop"></div>');
    backdrop.style.backgroundColor = fabColor;
    this.#anchor.append(backdrop);

    this.offsetX = btnRect.left - windowWidth / 2 + btnRect.width / 2;
    this.offsetY = windowHeight - btnRect.bottom;
    this.btnBottom = btnRect.bottom;
    this.btnLeft = btnRect.left;
    this.btnWidth = btnRect.width;

    // Set initial state
    this.el.classList.add('active');
    this.el.style.textAlign = 'center';
    this.el.style.width = '100%';
    this.el.style.bottom = '0';
    this.el.style.left = '0';
    this.el.style.transform = 'translateX(' + this.offsetX + 'px)';
    this.el.style.transition = 'none';
    this.#menu.ariaExpanded = 'true';

    this.#anchor.style.transform = `translateY(${this.offsetY}px`;
    this.#anchor.style.transition = 'none';

    setTimeout(() => {
      this.el.style.transform = '';
      this.el.style.transition =
        'transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s';

      this.#anchor.style.overflow = 'visible';
      this.#anchor.style.transform = '';
      this.#anchor.style.transition = 'transform .2s';

      setTimeout(() => {
        this.el.style.overflow = 'hidden';
        this.el.style.backgroundColor = fabColor;

        backdrop.style.transform = 'scale(' + scaleFactor + ')';
        backdrop.style.transition = 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)';

        this.#menu.querySelectorAll('li > a').forEach((a: HTMLAnchorElement) => {
          a.style.opacity = '1';
          a.tabIndex = 0;
        });

        // Scroll to close.
        window.addEventListener('scroll', this.close, true);
        document.body.addEventListener('click', this.#handleDocumentClick, true);
      }, 100);
    }, 0);
  }
}

export { FloatingActionButton, FloatingActionButtonOptions };
