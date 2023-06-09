import { Component } from "./component";
import anim from "animejs";

const _defaults = {
  accordion: true,
  onOpenStart: undefined,
  onOpenEnd: undefined,
  onCloseStart: undefined,
  onCloseEnd: undefined,
  inDuration: 300,
  outDuration: 300
};

export class Collapsible extends Component {
  private _headers: HTMLElement[];
  private _handleCollapsibleClickBound: any;
  private _handleCollapsibleKeydownBound: any;

  constructor(el, options) {
    super(Collapsible, el, options);
    (this.el as any).M_Collapsible = this;
    this.options = {...Collapsible.defaults, ...options};
    // Setup tab indices
    this._headers = Array.from(this.el.querySelectorAll('li > .collapsible-header'));
    this._headers.forEach(el => el.tabIndex = 0);
    this._setupEventHandlers();
    // Open first active
    const activeBodies: HTMLElement[] = Array.from(this.el.querySelectorAll('li.active > .collapsible-body'));
    if (this.options.accordion)
      if (activeBodies.length > 0)
        activeBodies[0].style.display = 'block'; // Accordion
    else
      activeBodies.forEach(el => el.style.display = 'block'); // Expandables
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Collapsible;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_Collapsible = undefined;
  }

  _setupEventHandlers() {
    this._handleCollapsibleClickBound = this._handleCollapsibleClick.bind(this);
    this._handleCollapsibleKeydownBound = this._handleCollapsibleKeydown.bind(this);
    this.el.addEventListener('click', this._handleCollapsibleClickBound);
    this._headers.forEach(header => header.addEventListener('keydown', this._handleCollapsibleKeydownBound));
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleCollapsibleClickBound);
    this._headers.forEach(header => header.removeEventListener('keydown', this._handleCollapsibleKeydownBound));
  }

  _handleCollapsibleClick(e) {
    const header = e.target.closest('.collapsible-header');
    if (e.target && header) {
      const collapsible = header.closest('.collapsible');
      if (collapsible !== this.el) return;

      const li = header.closest('li');
      const isActive = li.classList.contains('active');
      const index = [...li.parentNode.children].indexOf(li);

      if (isActive)
        this.close(index);
      else
        this.open(index);
    }
  }

  _handleCollapsibleKeydown(e) {
    if (e.keyCode === 13) {
      this._handleCollapsibleClickBound(e);
    }
  }

  _animateIn(index: number) {
    const li = this.el.children[index];
    if (!li) return;
    const body: HTMLElement = li.querySelector('.collapsible-body');
    anim.remove(body);
    body.style.display = 'block';
    body.style.overflow = 'hidden';
    body.style.height = '0';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
    const pTop = getComputedStyle(body).paddingTop; //  . css('padding-top');
    const pBottom = getComputedStyle(body).paddingBottom; //body.css('padding-bottom');
    const finalHeight = body.scrollHeight;
    body.style.paddingTop = '0';
    body.style.paddingBottom = '0';
    anim({
      targets: body,
      height: finalHeight,
      paddingTop: pTop,
      paddingBottom: pBottom,
      duration: this.options.inDuration,
      easing: 'easeInOutCubic',
      complete: (anim) => {
        body.style.overflow = '';
        body.style.height = '';
        body.style.paddingTop = '';
        body.style.paddingBottom = '';
        // onOpenEnd callback
        if (typeof this.options.onOpenEnd === 'function') {
          this.options.onOpenEnd.call(this, li);
        }
      }
    });
  }

  _animateOut(index: number) {
    const li = this.el.children[index];
    if (!li) return;
    const body: HTMLElement = li.querySelector('.collapsible-body');
    anim.remove(body);
    body.style.overflow = 'hidden';
    anim({
      targets: body,
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: this.options.outDuration,
      easing: 'easeInOutCubic',
      complete: () => {
        body.style.overflow = '';
        body.style.height = '';
        body.style.padding = '';
        body.style.display = '';
        // onCloseEnd callback
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this, li);
        }
      }
    });
  }

  open(index: number) {
    const listItems = Array.from(this.el.children).filter(c => c.tagName === 'LI');
    const li = listItems[index];
    if (li && !li.classList.contains('active')) {
      // onOpenStart callback
      if (typeof this.options.onOpenStart === 'function') {
        this.options.onOpenStart.call(this, li);
      }
      // Handle accordion behavior
      if (this.options.accordion) {
        const activeLis = listItems.filter(li => li.classList.contains('active'));
        activeLis.forEach(activeLi => {
          const index = listItems.indexOf(activeLi);
          this.close(index);
        });
      }
      // Animate in
      li.classList.add('active');
      this._animateIn(index);
    }
  }

  close(index: number) {
    const li = Array.from(this.el.children).filter(c => c.tagName === 'LI')[index];
    if (li && li.classList.contains('active')) {
      // onCloseStart callback
      if (typeof this.options.onCloseStart === 'function') {
        this.options.onCloseStart.call(this, li);
      }
      // Animate out
      li.classList.remove('active');
      this._animateOut(index);
    }
  }
}
