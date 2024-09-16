import { Component, BaseOptions, InitElements, MElement, Openable } from './component';

export interface FloatingActionButtonOptions extends BaseOptions {
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

let _defaults: FloatingActionButtonOptions = {
  direction: 'top',
  hoverEnabled: true,
  toolbarEnabled: false
};

export class FloatingActionButton
  extends Component<FloatingActionButtonOptions>
  implements Openable
{
  /**
   * Describes open/close state of FAB.
   */
  isOpen: boolean;

  private _anchor: HTMLAnchorElement;
  private _menu: HTMLElement | null;
  private _floatingBtns: HTMLElement[];
  private _floatingBtnsReverse: HTMLElement[];

  offsetY: number;
  offsetX: number;
  btnBottom: number;
  btnLeft: number;
  btnWidth: number;

  constructor(el: HTMLElement, options: Partial<FloatingActionButtonOptions>) {
    super(el, options, FloatingActionButton);
    (this.el as any).M_FloatingActionButton = this;

    this.options = {
      ...FloatingActionButton.defaults,
      ...options
    };

    this.isOpen = false;
    this._anchor = this.el.querySelector('a');
    this._menu = this.el.querySelector('ul');
    this._floatingBtns = Array.from(this.el.querySelectorAll('ul .btn-floating'));
    this._floatingBtnsReverse = this._floatingBtns.reverse();
    this.offsetY = 0;
    this.offsetX = 0;

    this.el.classList.add(`direction-${this.options.direction}`);
    if (this.options.direction === 'top') this.offsetY = 40;
    else if (this.options.direction === 'right') this.offsetX = -40;
    else if (this.options.direction === 'bottom') this.offsetY = -40;
    else this.offsetX = 40;
    this._setupEventHandlers();
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
    return (el as any).M_FloatingActionButton;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_FloatingActionButton = undefined;
  }

  _setupEventHandlers() {
    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.addEventListener('mouseenter', this.open);
      this.el.addEventListener('mouseleave', this.close);
    } else {
      this.el.addEventListener('click', this._handleFABClick);
    }
  }

  _removeEventHandlers() {
    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.removeEventListener('mouseenter', this.open);
      this.el.removeEventListener('mouseleave', this.close);
    } else {
      this.el.removeEventListener('click', this._handleFABClick);
    }
  }

  _handleFABClick = () => {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  _handleDocumentClick = (e: MouseEvent) => {
    const elem = e.target;
    if (elem !== this._menu) this.close;
  };

  /**
   * Open FAB.
   */
  open = (): void => {
    if (this.isOpen) return;
    if (this.options.toolbarEnabled) this._animateInToolbar();
    else this._animateInFAB();
    this.isOpen = true;
  };

  /**
   * Close FAB.
   */
  close = (): void => {
    if (!this.isOpen) return;
    if (this.options.toolbarEnabled) {
      window.removeEventListener('scroll', this.close, true);
      document.body.removeEventListener('click', this._handleDocumentClick, true);
    } else {
      this._animateOutFAB();
    }
    this.isOpen = false;
  };

  _animateInFAB() {
    this.el.classList.add('active');
    const delayIncrement = 40;
    const duration = 275;

    this._floatingBtnsReverse.forEach((el, index) => {
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
        }, 1);
      }, delay);
    });
  }

  _animateOutFAB() {
    const duration = 175;
    setTimeout(() => this.el.classList.remove('active'), duration);
    this._floatingBtnsReverse.forEach((el) => {
      el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
      // to
      el.style.opacity = '0';
      el.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(0.4)`;
    });
  }

  _animateInToolbar() {
    let scaleFactor;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let btnRect = this.el.getBoundingClientRect();

    const backdrop = document.createElement('div');
    backdrop.classList.add('fab-backdrop'); //  $('<div class="fab-backdrop"></div>');

    const fabColor = getComputedStyle(this._anchor).backgroundColor; // css('background-color');

    this._anchor.append(backdrop);

    this.offsetX = btnRect.left - windowWidth / 2 + btnRect.width / 2;
    this.offsetY = windowHeight - btnRect.bottom;
    scaleFactor = windowWidth / backdrop[0].clientWidth;
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

    this._anchor.style.transform = `translateY(${this.offsetY}px`;
    this._anchor.style.transition = 'none';

    backdrop.style.backgroundColor = fabColor;

    setTimeout(() => {
      this.el.style.transform = '';
      this.el.style.transition =
        'transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s';

      this._anchor.style.overflow = 'visible';
      this._anchor.style.transform = '';
      this._anchor.style.transition = 'transform .2s';

      setTimeout(() => {
        this.el.style.overflow = 'hidden';
        this.el.style.backgroundColor = fabColor;

        backdrop.style.transform = 'scale(' + scaleFactor + ')';
        backdrop.style.transition = 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)';

        this._menu
          .querySelectorAll('li > a')
          .forEach((a: HTMLAnchorElement) => (a.style.opacity = '1'));

        // Scroll to close.
        window.addEventListener('scroll', this.close, true);
        document.body.addEventListener('click', this._handleDocumentClick, true);
      }, 100);
    }, 0);
  }
}
