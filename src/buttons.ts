import { Component } from "./component";
import anim from "animejs";

let _defaults = {
  direction: 'top',
  hoverEnabled: true,
  toolbarEnabled: false
};

export class FloatingActionButton extends Component {
  el: HTMLElement;
  isOpen: boolean;
  private _anchor: HTMLAnchorElement;
  private _menu: HTMLElement|null;
  private _floatingBtns: HTMLElement[];
  private _floatingBtnsReverse: HTMLElement[];
  offsetY: number;
  offsetX: number;
  private _handleFABClickBound: any;
  private _handleOpenBound: any;
  private _handleCloseBound: any;
  private _handleDocumentClickBound: (this: HTMLElement, ev: MouseEvent) => any;
  btnBottom: number;
  btnLeft: number;
  btnWidth: number;

  constructor(el, options) {
    super(FloatingActionButton, el, options);

    (this.el as any).M_FloatingActionButton = this;

    this.options = {...FloatingActionButton.defaults, ...options};
    this.isOpen = false;
    this._anchor = this.el.querySelector('a');
    this._menu = this.el.querySelector('ul');
    this._floatingBtns = Array.from(this.el.querySelectorAll('ul .btn-floating'));
    this._floatingBtnsReverse = this._floatingBtns.reverse();
    this.offsetY = 0;
    this.offsetX = 0;

    this.el.classList.add(`direction-${this.options.direction}`);
    if (this.options.direction === 'top')
      this.offsetY = 40;
    else if (this.options.direction === 'right')
      this.offsetX = -40;
    else if (this.options.direction === 'bottom')
      this.offsetY = -40;
    else
      this.offsetX = 40;
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
    return domElem.M_FloatingActionButton;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_FloatingActionButton = undefined;
  }

  _setupEventHandlers() {
    this._handleFABClickBound = this._handleFABClick.bind(this);
    this._handleOpenBound = this.open.bind(this);
    this._handleCloseBound = this.close.bind(this);

    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.addEventListener('mouseenter', this._handleOpenBound);
      this.el.addEventListener('mouseleave', this._handleCloseBound);
    } else {
      this.el.addEventListener('click', this._handleFABClickBound);
    }
  }

  _removeEventHandlers() {
    if (this.options.hoverEnabled && !this.options.toolbarEnabled) {
      this.el.removeEventListener('mouseenter', this._handleOpenBound);
      this.el.removeEventListener('mouseleave', this._handleCloseBound);
    } else {
      this.el.removeEventListener('click', this._handleFABClickBound);
    }
  }

  _handleFABClick() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  _handleDocumentClick(e) {
    const elem = <HTMLElement>e.target;
    if (elem !== this._menu) this.close;
    /*
    if (!elem.closest(this.$menu)) {
      this.close();
    }*/
  }

  open() {
    if (this.isOpen) return;
    if (this.options.toolbarEnabled)
      this._animateInToolbar();
    else
      this._animateInFAB();
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    if (this.options.toolbarEnabled) {
      window.removeEventListener('scroll', this._handleCloseBound, true);
      document.body.removeEventListener('click', this._handleDocumentClickBound, true);
      this._animateOutToolbar();
    }
    else {
      this._animateOutFAB();
    }
    this.isOpen = false;
  }

  _animateInFAB() {
    this.el.classList.add('active');
    let time = 0;
    this._floatingBtnsReverse.forEach((el) => {
      anim({
        targets: el,
        opacity: 1,
        scale: [0.4, 1],
        translateY: [this.offsetY, 0],
        translateX: [this.offsetX, 0],
        duration: 275,
        delay: time,
        easing: 'easeInOutQuad'
      });
      time += 40;
    });
  }

  _animateOutFAB() {
    this._floatingBtnsReverse.forEach((el) => {
      anim.remove(el);
      anim({
        targets: el,
        opacity: 0,
        scale: 0.4,
        translateY: this.offsetY,
        translateX: this.offsetX,
        duration: 175,
        easing: 'easeOutQuad',
        complete: () => {
          this.el.classList.remove('active');
        }
      });
    });
  }

  _animateInToolbar() {
    let scaleFactor;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let btnRect = this.el.getBoundingClientRect();

    const backdrop =  document.createElement('div');
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

    (<HTMLElement>backdrop).style.backgroundColor = fabColor;

    setTimeout(() => {
      this.el.style.transform = '';
      this.el.style.transition  = 'transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s';

      this._anchor.style.overflow = 'visible';
      this._anchor.style.transform = '';
      this._anchor.style.transition = 'transform .2s';

      setTimeout(() => {
        this.el.style.overflow = 'hidden';
        this.el.style.backgroundColor = fabColor;

        backdrop.style.transform = 'scale(' + scaleFactor + ')';
        backdrop.style.transition = 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)';

        this._menu.querySelectorAll('li > a').forEach((a: HTMLAnchorElement) => a.style.opacity = '1');

        // Scroll to close.
        this._handleDocumentClickBound = this._handleDocumentClick.bind(this);
        window.addEventListener('scroll', this._handleCloseBound, true);
        document.body.addEventListener('click', this._handleDocumentClickBound, true);
      }, 100);
    }, 0);
  }




  _animateOutToolbar() {
    return;
    /*
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let backdrop = this.$el.find('.fab-backdrop');
    let fabColor = this.$anchor.css('background-color');

    this.offsetX = this.btnLeft - windowWidth / 2 + this.btnWidth / 2;
    this.offsetY = windowHeight - this.btnBottom;

    // Hide backdrop
    this.$el.removeClass('active');
    this.$el.css({
      'background-color': 'transparent',
      transition: 'none'
    });
    // this.$anchor.css({
    //   transition: 'none'
    // });
    backdrop.css({
      transform: 'scale(0)',
      'background-color': fabColor
    });

    // this.$menu
    //   .children('li')
    //   .children('a')
    //   .css({
    //     opacity: ''
    //   });

    setTimeout(() => {
      backdrop.remove();

      // Set initial state.
      this.$el.css({
        'text-align': '',
        width: '',
        bottom: '',
        left: '',
        overflow: '',
        'background-color': '',
        transform: 'translate3d(' + -this.offsetX + 'px,0,0)'
      });
      // this.$anchor.css({
      //   overflow: '',
      //   transform: 'translate3d(0,' + this.offsetY + 'px,0)'
      // });

      setTimeout(() => {
        this.$el.css({
          transform: 'translate3d(0,0,0)',
          transition: 'transform .2s'
        });
        // this.$anchor.css({
        //   transform: 'translate3d(0,0,0)',
        //   transition: 'transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)'
        // });
      }, 20);
    }, 200);
    */
  }
}
