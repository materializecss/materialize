import { Utils } from "./utils";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface CollapsibleOptions extends BaseOptions {
  /**
   * If accordion versus collapsible.
   * @default true
   */
  accordion: boolean;
  /**
   * Transition in duration in milliseconds.
   * @default 300
   */
  inDuration: number;
  /**
   * Transition out duration in milliseconds.
   * @default 300
   */
  outDuration: number;
  /**
   * Callback function called before collapsible is opened.
   * @default null
   */
  onOpenStart: (el: Element) => void;
  /**
   * Callback function called after collapsible is opened.
   * @default null
   */
  onOpenEnd: (el: Element) => void;
  /**
   * Callback function called before collapsible is closed.
   * @default null
   */
  onCloseStart: (el: Element) => void;
  /**
   * Callback function called after collapsible is closed.
   * @default null
   */
  onCloseEnd: (el: Element) => void;
}

const _defaults: CollapsibleOptions = {
  accordion: true,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,  
  onCloseEnd: null,
  inDuration: 300,
  outDuration: 300
};

export class Collapsible extends Component<CollapsibleOptions> {
  private _headers: HTMLElement[];

  constructor(el: HTMLElement, options: Partial<CollapsibleOptions>) {
    super(el, options, Collapsible);
    (this.el as any).M_Collapsible = this;

    this.options = {
      ...Collapsible.defaults,
      ...options
    };

    // Setup tab indices
    this._headers = Array.from(this.el.querySelectorAll('li > .collapsible-header'));
    this._headers.forEach(el => el.tabIndex = 0);
    this._setupEventHandlers();

    // Open active
    const activeBodies: HTMLElement[] = Array.from(this.el.querySelectorAll('li.active > .collapsible-body'));
    if (this.options.accordion) {
      if (activeBodies.length > 0) {
        // Accordion => open first active only
        this._setExpanded(activeBodies[0]);
      }
    } else {
      // Expandables => all active
      activeBodies.forEach(el => this._setExpanded(el));
    }
  }

  static get defaults(): CollapsibleOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Collapsible.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<CollapsibleOptions>): Collapsible;
  /**
   * Initializes instances of Collapsible.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<CollapsibleOptions>): Collapsible[];
  /**
   * Initializes instances of Collapsible.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<CollapsibleOptions> = {}): Collapsible | Collapsible[] {
    return super.init(els, options, Collapsible);
  }

  static getInstance(el: HTMLElement): Collapsible {
    return (el as any).M_Collapsible;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_Collapsible = undefined;
  }

  _setupEventHandlers() {
    this.el.addEventListener('click', this._handleCollapsibleClick);
    this._headers.forEach(header => header.addEventListener('keydown', this._handleCollapsibleKeydown));
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleCollapsibleClick);
    this._headers.forEach(header => header.removeEventListener('keydown', this._handleCollapsibleKeydown));
  }

  _handleCollapsibleClick = (e: MouseEvent | KeyboardEvent) => {
    const header = (e.target as HTMLElement).closest('.collapsible-header');
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

  _handleCollapsibleKeydown = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this._handleCollapsibleClick(e);
    }
  }

  private _setExpanded(li: HTMLElement): void {
    li.style.maxHeight = li.scrollHeight + "px";
  }

  _animateIn(index: number) {
    const li = <HTMLLIElement>this.el.children[index];
    if (!li) return;
    const body: HTMLElement = li.querySelector('.collapsible-body');
    const duration = this.options.inDuration; // easeInOutCubic
    body.style.transition = `max-height ${duration}ms ease-out`;
    this._setExpanded(body);
    setTimeout(() => {
      if (typeof this.options.onOpenEnd === 'function') {
        this.options.onOpenEnd.call(this, li);
      }
    }, duration);
  }

  _animateOut(index: number) {
    const li = this.el.children[index];
    if (!li) return;
    const body: HTMLElement = li.querySelector('.collapsible-body');
    const duration = this.options.outDuration; // easeInOutCubic
    body.style.transition = `max-height ${duration}ms ease-out`;
    body.style.maxHeight = "0";
    setTimeout(() => {
      if (typeof this.options.onCloseEnd === 'function') {
        this.options.onCloseEnd.call(this, li);
      }
    }, duration);
  }

  /**
   * Open collapsible section.
   * @param n Nth section to open.
   */
  open = (index: number) => {
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

  /**
   * Close collapsible section.
   * @param n Nth section to close.
   */
  close = (index: number) => {
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
