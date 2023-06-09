import { Component } from "./component";
import { M } from "./global";
import anim from "animejs";

const _defaults = {
  alignment: 'left',
  autoFocus: true,
  constrainWidth: true,
  container: null,
  coverTrigger: true,
  closeOnClick: true,
  hover: false,
  inDuration: 150,
  outDuration: 250,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null,
  onItemClick: null
};

export class Dropdown extends Component {
  el: HTMLElement;
  static _dropdowns: Dropdown[] = [];
  id: string;
  dropdownEl: HTMLElement;
  isOpen: boolean;
  isScrollable: boolean;
  isTouchMoving: boolean;
  focusedIndex: number;
  filterQuery: any[];
  private _resetFilterQueryBound: any;
  private _handleDocumentClickBound: any;
  private _handleDocumentTouchmoveBound: any;
  private _handleDropdownClickBound: any;
  private _handleDropdownKeydownBound: any;
  private _handleTriggerKeydownBound: any;
  private _handleMouseEnterBound: any;
  private _handleMouseLeaveBound: any;
  _handleClickBound: any;
  filterTimeout: NodeJS.Timeout;

  constructor(el, options) {
    super(Dropdown, el, options);
    (this.el as any).M_Dropdown = this;
    Dropdown._dropdowns.push(this);
    this.id = M.getIdFromTrigger(el);
    this.dropdownEl = document.getElementById(this.id);
    //this.$dropdownEl = $(this.dropdownEl);
    this.options = {...Dropdown.defaults, ...options};

    this.isOpen = false;
    this.isScrollable = false;
    this.isTouchMoving = false;
    this.focusedIndex = -1;
    this.filterQuery = [];

    // Move dropdown-content after dropdown-trigger
    this._moveDropdown();
    this._makeDropdownFocusable();
    this._resetFilterQueryBound = this._resetFilterQuery.bind(this);
    this._handleDocumentClickBound = this._handleDocumentClick.bind(this);
    this._handleDocumentTouchmoveBound = this._handleDocumentTouchmove.bind(this);
    this._handleDropdownClickBound = this._handleDropdownClick.bind(this);
    this._handleDropdownKeydownBound = this._handleDropdownKeydown.bind(this);
    this._handleTriggerKeydownBound = this._handleTriggerKeydown.bind(this);
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Dropdown;
  }

  destroy() {
    this._resetDropdownStyles();
    this._removeEventHandlers();
    Dropdown._dropdowns.splice(Dropdown._dropdowns.indexOf(this), 1);
    (this.el as any).M_Dropdown = undefined;
  }

  _setupEventHandlers() {
    // Trigger keydown handler
    this.el.addEventListener('keydown', this._handleTriggerKeydownBound);
    // Item click handler
    this.dropdownEl?.addEventListener('click', this._handleDropdownClickBound);
    // Hover event handlers
    if (this.options.hover) {
      this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
      this.el.addEventListener('mouseenter', this._handleMouseEnterBound);
      this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
      this.el.addEventListener('mouseleave', this._handleMouseLeaveBound);
      this.dropdownEl.addEventListener('mouseleave', this._handleMouseLeaveBound);
      // Click event handlers
    } else {
      this._handleClickBound = this._handleClick.bind(this);
      this.el.addEventListener('click', this._handleClickBound);
    }
  }

  _removeEventHandlers() {
    this.el.removeEventListener('keydown', this._handleTriggerKeydownBound);
    this.dropdownEl.removeEventListener('click', this._handleDropdownClickBound);
    if (this.options.hover) {
      this.el.removeEventListener('mouseenter', this._handleMouseEnterBound);
      this.el.removeEventListener('mouseleave', this._handleMouseLeaveBound);
      this.dropdownEl.removeEventListener('mouseleave', this._handleMouseLeaveBound);
    } else {
      this.el.removeEventListener('click', this._handleClickBound);
    }
  }

  _setupTemporaryEventHandlers() {
    // Use capture phase event handler to prevent click
    document.body.addEventListener('click', this._handleDocumentClickBound, true);
    document.body.addEventListener('touchmove', this._handleDocumentTouchmoveBound);
    this.dropdownEl.addEventListener('keydown', this._handleDropdownKeydownBound);
  }

  _removeTemporaryEventHandlers() {
    // Use capture phase event handler to prevent click
    document.body.removeEventListener('click', this._handleDocumentClickBound, true);
    document.body.removeEventListener('touchmove', this._handleDocumentTouchmoveBound);
    this.dropdownEl.removeEventListener('keydown', this._handleDropdownKeydownBound);
  }

  _handleClick(e) {
    e.preventDefault();
    this.open();
  }

  _handleMouseEnter() {
    this.open();
  }

  _handleMouseLeave(e) {
    const toEl = e.toElement || e.relatedTarget;
    const leaveToDropdownContent = !!toEl.closest('.dropdown-content');
    let leaveToActiveDropdownTrigger = false;
    const closestTrigger = toEl.closest('.dropdown-trigger');
    if (
      closestTrigger &&
      !!(<any>closestTrigger).M_Dropdown &&
      (<any>closestTrigger).M_Dropdown.isOpen
    ) {
      leaveToActiveDropdownTrigger = true;
    }
    // Close hover dropdown if mouse did not leave to either active dropdown-trigger or dropdown-content
    if (!leaveToActiveDropdownTrigger && !leaveToDropdownContent) {
      this.close();
    }
  }

  _handleDocumentClick(e) {
    const target = <HTMLElement>e.target;
    if (
      this.options.closeOnClick &&
      target.closest('.dropdown-content') &&
      !this.isTouchMoving
    ) {
      // isTouchMoving to check if scrolling on mobile.
      //setTimeout(() => {
      this.close();
      //}, 0);
    }
    else if (
      target.closest('.dropdown-trigger') ||
      !target.closest('.dropdown-content')
    ) {
      //setTimeout(() => {
      this.close();
      //}, 0);
    }
    this.isTouchMoving = false;
  }

  _handleTriggerKeydown(e) {
    // ARROW DOWN OR ENTER WHEN SELECT IS CLOSED - open Dropdown
    if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ENTER) && !this.isOpen) {
      e.preventDefault();
      this.open();
    }
  }

  _handleDocumentTouchmove(e) {
    const target = <HTMLElement>e.target;
    if (target.closest('.dropdown-content')) {
      this.isTouchMoving = true;
    }
  }

  _handleDropdownClick(e) {
    // onItemClick callback
    if (typeof this.options.onItemClick === 'function') {
      const itemEl = <HTMLElement>e.target.closest('li');
      this.options.onItemClick.call(this, itemEl);
    }
  }

  _handleDropdownKeydown(e) {
    if (e.which === M.keys.TAB) {
      e.preventDefault();
      this.close();
    }
    // Navigate down dropdown list
    else if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) && this.isOpen) {
      e.preventDefault();
      const direction = e.which === M.keys.ARROW_DOWN ? 1 : -1;
      let newFocusedIndex = this.focusedIndex;
      let hasFoundNewIndex = false;
      do {
        newFocusedIndex = newFocusedIndex + direction;
        if (
          !!this.dropdownEl.children[newFocusedIndex] &&
          (<any>this.dropdownEl.children[newFocusedIndex]).tabIndex !== -1
        ) {
          hasFoundNewIndex = true;
          break;
        }
      } while (newFocusedIndex < this.dropdownEl.children.length && newFocusedIndex >= 0);

      if (hasFoundNewIndex) {
        // Remove active class from old element
        if (this.focusedIndex >= 0)
          this.dropdownEl.children[this.focusedIndex].classList.remove('active');
        this.focusedIndex = newFocusedIndex;
        this._focusFocusedItem();
      }
    }
    // ENTER selects choice on focused item
    else if (e.which === M.keys.ENTER && this.isOpen) {
      // Search for <a> and <button>
      const focusedElement = this.dropdownEl.children[this.focusedIndex];
      const activatableElement = <HTMLElement>focusedElement.querySelector('a, button');
      // Click a or button tag if exists, otherwise click li tag
      if (!!activatableElement) {
        activatableElement.click();
      }
      else if (!!focusedElement) {
        if (focusedElement instanceof HTMLElement) {
          focusedElement.click();
        }
      }
    }
    // Close dropdown on ESC
    else if (e.which === M.keys.ESC && this.isOpen) {
      e.preventDefault();
      this.close();
    }

    // CASE WHEN USER TYPE LETTERS
    const letter = String.fromCharCode(e.which).toLowerCase();
    const nonLetters = [9, 13, 27, 38, 40];
    if (letter && nonLetters.indexOf(e.which) === -1) {
      this.filterQuery.push(letter);
      const string = this.filterQuery.join('');
      const newOptionEl = Array.from(this.dropdownEl.querySelectorAll('li'))
        .find((el) => el.innerText.toLowerCase().indexOf(string) === 0);
      if (newOptionEl) {
        this.focusedIndex = [...newOptionEl.parentNode.children].indexOf(newOptionEl);
        this._focusFocusedItem();
      }
    }
    this.filterTimeout = setTimeout(this._resetFilterQueryBound, 1000);
  }

  _resetFilterQuery() {
    this.filterQuery = [];
  }

  _resetDropdownStyles() {
    this.dropdownEl.style.display = '';
    this.dropdownEl.style.width = '';
    this.dropdownEl.style.height = '';
    this.dropdownEl.style.left = '';
    this.dropdownEl.style.top = '';
    this.dropdownEl.style.transformOrigin = '';
    this.dropdownEl.style.transform = '';
    this.dropdownEl.style.opacity = '';
  }

  // Move dropdown after container or trigger
  _moveDropdown(containerEl = null) {
    if (!!this.options.container) {
      this.options.container.append(this.dropdownEl);
    }
    else if (containerEl) {
      if (!containerEl.contains(this.dropdownEl)) {
        containerEl.append(this.dropdownEl);
      }
    }
    else {
      this.el.after(this.dropdownEl);
    }
  }

  _makeDropdownFocusable() {
    if (!this.dropdownEl) return;
    // Needed for arrow key navigation
    this.dropdownEl.tabIndex = 0;
    // Only set tabindex if it hasn't been set by user
    Array.from(this.dropdownEl.children).forEach((el)=> {
      if (!el.getAttribute('tabindex'))
        el.setAttribute('tabindex', '0');
    });
  }

  _focusFocusedItem() {
    if (
      this.focusedIndex >= 0 &&
      this.focusedIndex < this.dropdownEl.children.length &&
      this.options.autoFocus
    ) {
      (this.dropdownEl.children[this.focusedIndex] as HTMLElement).focus({
        preventScroll: true
      });
      this.dropdownEl.children[this.focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }

  _getDropdownPosition(closestOverflowParent) {
    const offsetParentBRect = this.el.offsetParent.getBoundingClientRect();
    const triggerBRect = this.el.getBoundingClientRect();
    const dropdownBRect = this.dropdownEl.getBoundingClientRect();

    let idealHeight = dropdownBRect.height;
    let idealWidth = dropdownBRect.width;
    let idealXPos = triggerBRect.left - dropdownBRect.left;
    let idealYPos = triggerBRect.top - dropdownBRect.top;

    const dropdownBounds = {
      left: idealXPos,
      top: idealYPos,
      height: idealHeight,
      width: idealWidth
    };

    const alignments = M.checkPossibleAlignments(
      this.el,
      closestOverflowParent,
      dropdownBounds,
      this.options.coverTrigger ? 0 : triggerBRect.height
    );

    let verticalAlignment = 'top';
    let horizontalAlignment = this.options.alignment;
    idealYPos += this.options.coverTrigger ? 0 : triggerBRect.height;

    // Reset isScrollable
    this.isScrollable = false;

    if (!alignments.top) {
      if (alignments.bottom) {
        verticalAlignment = 'bottom';

        if (!this.options.coverTrigger) {
          idealYPos -= triggerBRect.height;
        }
      } else {
        this.isScrollable = true;

        // Determine which side has most space and cutoff at correct height
        idealHeight -= 20; // Add padding when cutoff
        if (alignments.spaceOnTop > alignments.spaceOnBottom) {
          verticalAlignment = 'bottom';
          idealHeight += alignments.spaceOnTop;
          idealYPos -= this.options.coverTrigger
            ? alignments.spaceOnTop - 20
            : alignments.spaceOnTop - 20 + triggerBRect.height;
        } else {
          idealHeight += alignments.spaceOnBottom;
        }
      }
    }

    // If preferred horizontal alignment is possible
    if (!alignments[horizontalAlignment]) {
      const oppositeAlignment = horizontalAlignment === 'left' ? 'right' : 'left';
      if (alignments[oppositeAlignment]) {
        horizontalAlignment = oppositeAlignment;
      } else {
        // Determine which side has most space and cutoff at correct height
        if (alignments.spaceOnLeft > alignments.spaceOnRight) {
          horizontalAlignment = 'right';
          idealWidth += alignments.spaceOnLeft;
          idealXPos -= alignments.spaceOnLeft;
        } else {
          horizontalAlignment = 'left';
          idealWidth += alignments.spaceOnRight;
        }
      }
    }

    if (verticalAlignment === 'bottom') {
      idealYPos =
        idealYPos - dropdownBRect.height + (this.options.coverTrigger ? triggerBRect.height : 0);
    }
    if (horizontalAlignment === 'right') {
      idealXPos = idealXPos - dropdownBRect.width + triggerBRect.width;
    }
    return {
      x: idealXPos,
      y: idealYPos,
      verticalAlignment: verticalAlignment,
      horizontalAlignment: horizontalAlignment,
      height: idealHeight,
      width: idealWidth
    };
  }

  _animateIn() {
    anim.remove(this.dropdownEl);
    anim({
      targets: this.dropdownEl,
      opacity: {
        value: [0, 1],
        easing: 'easeOutQuad'
      },
      scaleX: [0.3, 1],
      scaleY: [0.3, 1],
      duration: this.options.inDuration,
      easing: 'easeOutQuint',
      complete: (anim) => {
        if (this.options.autoFocus) this.dropdownEl.focus();
        // onOpenEnd callback
        if (typeof this.options.onOpenEnd === 'function') {
          this.options.onOpenEnd.call(this, this.el);
        }
      }
    });
  }

  _animateOut() {
    anim.remove(this.dropdownEl);
    anim({
      targets: this.dropdownEl,
      opacity: {
        value: 0,
        easing: 'easeOutQuint'
      },
      scaleX: 0.3,
      scaleY: 0.3,
      duration: this.options.outDuration,
      easing: 'easeOutQuint',
      complete: (anim) => {
        this._resetDropdownStyles();
        // onCloseEnd callback
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this, this.el);
        }
      }
    });
  }

  private _getClosestAncestor(el: Element, condition: Function): Element {
    let ancestor = el.parentNode;
    while (ancestor !== null && ancestor !== document) {
      if (condition(ancestor)) {
        return <Element>ancestor;
      }
      ancestor = ancestor.parentNode;
    }
    return null;
  };

  _placeDropdown() {
    // Container here will be closest ancestor with overflow: hidden
    let closestOverflowParent: HTMLElement = <HTMLElement>this._getClosestAncestor(this.dropdownEl, (ancestor: HTMLElement) => {
      return !['HTML','BODY'].includes(ancestor.tagName) && getComputedStyle(ancestor).overflow !== 'visible';
    });
    // Fallback
    if (!closestOverflowParent) {
      closestOverflowParent = <HTMLElement>(!!this.dropdownEl.offsetParent
        ? this.dropdownEl.offsetParent
        : this.dropdownEl.parentNode);
    }

    if (getComputedStyle(closestOverflowParent).position === 'static')
      closestOverflowParent.style.position = 'relative';

    this._moveDropdown(closestOverflowParent);

    // Set width before calculating positionInfo
    const idealWidth = this.options.constrainWidth
      ? this.el.getBoundingClientRect().width
      : this.dropdownEl.getBoundingClientRect().width;
    this.dropdownEl.style.width = idealWidth + 'px';

    const positionInfo = this._getDropdownPosition(closestOverflowParent);
    this.dropdownEl.style.left = positionInfo.x + 'px';
    this.dropdownEl.style.top = positionInfo.y + 'px';
    this.dropdownEl.style.height = positionInfo.height + 'px';
    this.dropdownEl.style.width = positionInfo.width + 'px';
    this.dropdownEl.style.transformOrigin = `${
      positionInfo.horizontalAlignment === 'left' ? '0' : '100%'
    } ${positionInfo.verticalAlignment === 'top' ? '0' : '100%'}`;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    // onOpenStart callback
    if (typeof this.options.onOpenStart === 'function') {
      this.options.onOpenStart.call(this, this.el);
    }
    // Reset styles
    this._resetDropdownStyles();
    this.dropdownEl.style.display = 'block';
    this._placeDropdown();
    this._animateIn();
    this._setupTemporaryEventHandlers();
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.focusedIndex = -1;
    // onCloseStart callback
    if (typeof this.options.onCloseStart === 'function') {
      this.options.onCloseStart.call(this, this.el);
    }
    this._animateOut();
    this._removeTemporaryEventHandlers();
    if (this.options.autoFocus) {
      this.el.focus();
    }
  }

  recalculateDimensions() {
    if (this.isOpen) {
      this.dropdownEl.style.width = '';
      this.dropdownEl.style.height = '';
      this.dropdownEl.style.left = '';
      this.dropdownEl.style.top = '';
      this.dropdownEl.style.transformOrigin = '';
      this._placeDropdown();
    }
  }

  static {
    Dropdown._dropdowns = [];
  }
}
