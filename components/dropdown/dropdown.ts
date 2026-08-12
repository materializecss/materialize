import { Utils } from '../../src/utils';
import { Component, BaseOptions, InitElements, MElement, Openable } from '../../src/component';

export interface DropdownOptions extends BaseOptions {
  /**
   * Defines the edge the menu is aligned to.
   * @default 'left'
   */
  alignment: 'left' | 'right';
  /**
   * If true, automatically focus dropdown el for keyboard.
   * @default true
   */
  autoFocus: boolean;
  /**
   * If true, constrainWidth to the size of the dropdown activator.
   * @default true
   */
  constrainWidth: boolean;
  /**
   * If false, the dropdown will show below the trigger.
   * @default true
   */
  coverTrigger: boolean;
  /**
   * If true, close dropdown on item click.
   * @default true
   */
  closeOnClick: boolean;
  /**
   * If true, the dropdown will open on hover.
   * @default false
   */
  hover: boolean;
  /**
   * Function called when dropdown starts entering.
   * @default null
   */
  onOpenStart: (el: HTMLElement) => void;
  /**
   * Function called when dropdown finishes entering.
   * @default null
   */
  onOpenEnd: (el: HTMLElement) => void;
  /**
   * Function called when dropdown starts exiting.
   * @default null
   */
  onCloseStart: (el: HTMLElement) => void;
  /**
   * Function called when dropdown finishes exiting.
   * @default null
   */
  onCloseEnd: (el: HTMLElement) => void;
  /**
   * Function called when item is clicked.
   * @default null
   */
  onItemClick: (el: HTMLLIElement) => void;
}

const _defaults: DropdownOptions = {
  alignment: 'left',
  autoFocus: true,
  constrainWidth: true,
  coverTrigger: true,
  closeOnClick: true,
  hover: false,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null,
  onItemClick: null
};

export class Dropdown extends Component<DropdownOptions> implements Openable {
  static _dropdowns: Dropdown[] = [];
  /** ID of the dropdown element. */
  id: string;
  /** The DOM element of the dropdown. */
  dropdownEl: HTMLElement;
  /** If the dropdown is open. */
  isOpen: boolean;
  /** The index of the item focused. */
  focusedIndex: number;
  filterQuery: string[];
  filterTimeout: NodeJS.Timeout | number;

  constructor(el: HTMLElement, options: Partial<DropdownOptions>) {
    super(el, options, Dropdown);
    this.el['M_Dropdown'] = this;

    Dropdown._dropdowns.push(this);
    this.id = Utils.getIdFromTrigger(el);
    this.dropdownEl = document.getElementById(this.id);

    this.options = {
      ...Dropdown.defaults,
      ...options
    };

    this.isOpen = false;
    this.focusedIndex = -1;
    this.filterQuery = [];

    this._setupPopoverAndAnchor();
    this._makeDropdownFocusable();
    this._setupEventHandlers();
  }

  static get defaults(): DropdownOptions {
    return _defaults;
  }

  static init(el: HTMLElement, options?: Partial<DropdownOptions>): Dropdown;
  static init(els: InitElements<MElement>, options?: Partial<DropdownOptions>): Dropdown[];
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<DropdownOptions> = {}
  ): Dropdown | Dropdown[] {
    return super.init(els, options, Dropdown);
  }

  static getInstance(el: HTMLElement): Dropdown {
    return el['M_Dropdown'];
  }

  destroy() {
    this._removeEventHandlers();
    if (this.dropdownEl?.hasAttribute('popover')) {
      this.dropdownEl.removeAttribute('popover');
    }
    Dropdown._dropdowns.splice(Dropdown._dropdowns.indexOf(this), 1);
    this.el['M_Dropdown'] = undefined;
  }

  /**
   * Applies CSS Anchor Positioning and Popover attributes to the elements
   */
  private _setupPopoverAndAnchor() {
    if (!this.dropdownEl) return;

    // Set Popover API attributes
    this.dropdownEl.popover = 'auto';

    // Generate unique anchor name if necessary
    const anchorName = `--dropdown-anchor-${this.id || Math.random().toString(36).substring(2, 9)}`;

    // Set CSS Anchor variables directly on elements
    this.el.style.setProperty('anchor-name', anchorName);
    this.dropdownEl.style.setProperty('position-anchor', anchorName);

    // Apply native anchor positioning via inline styles or class rules
    this.dropdownEl.style.position = 'fixed';
    this.dropdownEl.style.margin = '0';

    // Width constraint
    if (this.options.constrainWidth) {
      this.dropdownEl.style.width = 'anchor-size(width)';
    }

    // Vertical placement (Cover Trigger vs Below Trigger)
    const topPosition = this.options.coverTrigger ? 'anchor(top)' : 'anchor(bottom)';
    this.dropdownEl.style.top = `position-area(${topPosition})`;

    // Horizontal alignment
    if (this.options.alignment === 'right') {
      this.dropdownEl.style.left = 'anchor(right)';
      this.dropdownEl.style.transform = 'translateX(-100%)';
    } else {
      this.dropdownEl.style.left = 'anchor(left)';
    }
  }

  _setupEventHandlers() {
    this.el.addEventListener('keydown', this._handleTriggerKeydown);
    this.dropdownEl?.addEventListener('click', this._handleDropdownClick);

    // Listen to native Popover Toggle events to manage lifecycle and state synchronization
    this.dropdownEl?.addEventListener('beforetoggle', this._handlePopoverToggle);

    if (this.options.hover) {
      this.el.addEventListener('mouseenter', this._handleMouseEnter);
      this.el.addEventListener('mouseleave', this._handleMouseLeave);
      this.dropdownEl.addEventListener('mouseleave', this._handleMouseLeave);
    } else {
      this.el.addEventListener('click', this._handleClick);
    }
  }

  _removeEventHandlers() {
    this.el.removeEventListener('keydown', this._handleTriggerKeydown);
    this.dropdownEl?.removeEventListener('click', this._handleDropdownClick);
    this.dropdownEl?.removeEventListener('beforetoggle', this._handlePopoverToggle);

    if (this.options.hover) {
      this.el.removeEventListener('mouseenter', this._handleMouseEnter);
      this.el.removeEventListener('mouseleave', this._handleMouseLeave);
      this.dropdownEl.removeEventListener('mouseleave', this._handleMouseLeave);
    } else {
      this.el.removeEventListener('click', this._handleClick);
    }
  }

  private _handlePopoverToggle = (e: ToggleEvent) => {
    if (e.newState === 'open') {
      this.isOpen = true;
      this.el.setAttribute('aria-expanded', 'true');
      this.dropdownEl.addEventListener('keydown', this._handleDropdownKeydown);

      if (typeof this.options.onOpenEnd === 'function') {
        this.options.onOpenEnd.call(this, this.el);
      }
      if (this.options.autoFocus) {
        this._focusFocusedItem();
      }
    } else {
      this.isOpen = false;
      this.focusedIndex = -1;
      this.el.setAttribute('aria-expanded', 'false');
      this.dropdownEl.removeEventListener('keydown', this._handleDropdownKeydown);

      if (typeof this.options.onCloseEnd === 'function') {
        this.options.onCloseEnd.call(this, this.el);
      }
      if (this.options.autoFocus) {
        this.el.focus();
      }
    }
  };

  _handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  _handleMouseEnter = () => {
    this.open();
  };

  _handleMouseLeave = (e: MouseEvent) => {
    const toEl = e.relatedTarget as HTMLElement;
    if (!toEl) return;

    const leaveToDropdownContent = !!toEl.closest('.dropdown-content');
    const closestTrigger = toEl.closest('.dropdown-trigger');
    const leaveToActiveDropdownTrigger =
      closestTrigger && !!closestTrigger['M_Dropdown'] && closestTrigger['M_Dropdown'].isOpen;

    if (!leaveToActiveDropdownTrigger && !leaveToDropdownContent) {
      this.close();
    }
  };

  _handleTriggerKeydown = (e: KeyboardEvent) => {
    const arrowDownOrEnter =
      Utils.keys.ARROW_DOWN.includes(e.key) || Utils.keys.ENTER.includes(e.key);
    if (arrowDownOrEnter && !this.isOpen) {
      e.preventDefault();
      this.open();
    }
  };

  _handleDropdownClick = (e: MouseEvent) => {
    const itemEl = (<HTMLElement>e.target).closest('li');
    if (typeof this.options.onItemClick === 'function' && itemEl) {
      this.options.onItemClick.call(this, itemEl);
    }

    if (this.options.closeOnClick) {
      this.close();
    }
  };

  _handleDropdownKeydown = (e: KeyboardEvent) => {
    const arrowUpOrDown =
      Utils.keys.ARROW_DOWN.includes(e.key) || Utils.keys.ARROW_UP.includes(e.key);

    if (Utils.keys.TAB.includes(e.key)) {
      this.close();
    } else if (arrowUpOrDown && this.isOpen) {
      e.preventDefault();
      const direction = Utils.keys.ARROW_DOWN.includes(e.key) ? 1 : -1;
      let newFocusedIndex = this.focusedIndex;
      let hasFoundNewIndex = false;

      do {
        newFocusedIndex += direction;
        if (
          !!this.dropdownEl.children[newFocusedIndex] &&
          (<HTMLLIElement>this.dropdownEl.children[newFocusedIndex]).tabIndex !== -1
        ) {
          hasFoundNewIndex = true;
          break;
        }
      } while (newFocusedIndex < this.dropdownEl.children.length && newFocusedIndex >= 0);

      if (hasFoundNewIndex) {
        if (this.focusedIndex >= 0) {
          this.dropdownEl.children[this.focusedIndex].classList.remove('active');
        }
        this.focusedIndex = newFocusedIndex;
        this._focusFocusedItem();
      }
    } else if (Utils.keys.ENTER.includes(e.key) && this.isOpen) {
      const focusedElement = this.dropdownEl.children[this.focusedIndex];
      const activatableElement = <HTMLElement>focusedElement?.querySelector('a, button');
      if (activatableElement) {
        activatableElement.click();
      } else if (focusedElement instanceof HTMLElement) {
        focusedElement.click();
      }
    } else if (Utils.keys.ESC.includes(e.key) && this.isOpen) {
      e.preventDefault();
      this.close();
    }

    // Type-to-filter logic
    const keyText = e.key.toLowerCase();
    const isLetter = /[a-zA-Z0-9-_]/.test(keyText);
    const specialKeys = [
      ...Utils.keys.ARROW_DOWN,
      ...Utils.keys.ARROW_UP,
      ...Utils.keys.ENTER,
      ...Utils.keys.ESC,
      ...Utils.keys.TAB
    ];

    if (isLetter && !specialKeys.includes(e.key)) {
      this.filterQuery.push(keyText);
      const string = this.filterQuery.join('');
      const newOptionEl = Array.from(this.dropdownEl.querySelectorAll('li')).find(
        (el) => el.innerText.toLowerCase().indexOf(string) === 0
      );
      if (newOptionEl) {
        this.focusedIndex = [...newOptionEl.parentNode.children].indexOf(newOptionEl);
        this._focusFocusedItem();
      }
    }
    this.filterTimeout = setTimeout(this._resetFilterQuery, 1000);
  };

  _resetFilterQuery = () => {
    this.filterQuery = [];
  };

  _makeDropdownFocusable() {
    if (!this.dropdownEl) return;
    this.dropdownEl.tabIndex = -1;
    Array.from(this.dropdownEl.children).forEach((el) => {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
    });
  }

  _focusFocusedItem() {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.dropdownEl.children.length) {
      const target = this.dropdownEl.children[this.focusedIndex] as HTMLElement;
      target.classList.add('active');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (this.dropdownEl.children.length > 0 && this.options.autoFocus) {
      // Focus first item if no item is active yet
      (this.dropdownEl.children[0] as HTMLElement).focus();
    }
  }

  /**
   * Open dropdown using the native Popover API.
   */
  open = () => {
    if (this.isOpen) return;
    if (typeof this.options.onOpenStart === 'function') {
      this.options.onOpenStart.call(this, this.el);
    }
    this.dropdownEl.showPopover();
  };

  /**
   * Close dropdown using the native Popover API.
   */
  close = () => {
    if (!this.isOpen) return;
    if (typeof this.options.onCloseStart === 'function') {
      this.options.onCloseStart.call(this, this.el);
    }
    this.dropdownEl.hidePopover();
  };

  /**
   * Kept for backwards-compatibility. Native anchor positioning automatically
   * recalculates positions when the DOM or window resizes.
   */
  recalculateDimensions = () => {
    // No-op required; browser layout engine handles anchor positioning.
  };
}
