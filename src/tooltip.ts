import anim from "animejs";

import { M } from "./global";
import { Bounding } from "./bounding";
import { Component } from "./component";

const _defaults = {
  exitDelay: 200,
  enterDelay: 0,
  //html: null,
  text: '',
  //unsafeHTML: null,
  margin: 5,
  inDuration: 250,
  outDuration: 200,
  position: 'bottom',
  transitionMovement: 10
};

export class Tooltip extends Component {
  isOpen: boolean;
  isHovered: boolean;
  isFocused: boolean;
  tooltipEl: HTMLElement;
  private _handleMouseEnterBound: any;
  private _handleMouseLeaveBound: any;
  private _handleFocusBound: any;
  private _handleBlurBound: any;
  private _exitDelayTimeout: string | number | NodeJS.Timeout;
  private _enterDelayTimeout: string | number | NodeJS.Timeout;
  xMovement: number;
  yMovement: number;

  constructor(el, options) {
    super(Tooltip, el, options);
    (this.el as any).M_Tooltip = this;
    this.options = {...Tooltip.defaults, ...options};
    this.isOpen = false;
    this.isHovered = false;
    this.isFocused = false;
    this._appendTooltipEl();
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
    return domElem.M_Tooltip;
  }

  destroy() {
    this.tooltipEl.remove();
    this._removeEventHandlers();
    (this.el as any).M_Tooltip = undefined;
  }

  _appendTooltipEl() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.classList.add('material-tooltip');

    const tooltipContentEl = document.createElement('div');
    tooltipContentEl.classList.add('tooltip-content');
    this._setTooltipContent(tooltipContentEl);
    this.tooltipEl.appendChild(tooltipContentEl);
    document.body.appendChild(this.tooltipEl);
  }

  _setTooltipContent(tooltipContentEl: HTMLElement) {
    tooltipContentEl.innerText = this.options.text;
  }

  _updateTooltipContent() {
    this._setTooltipContent(this.tooltipEl.querySelector('.tooltip-content'));
  }

  _setupEventHandlers() {
    this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
    this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
    this._handleFocusBound = this._handleFocus.bind(this);
    this._handleBlurBound = this._handleBlur.bind(this);
    this.el.addEventListener('mouseenter', this._handleMouseEnterBound);
    this.el.addEventListener('mouseleave', this._handleMouseLeaveBound);
    this.el.addEventListener('focus', this._handleFocusBound, true);
    this.el.addEventListener('blur', this._handleBlurBound, true);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('mouseenter', this._handleMouseEnterBound);
    this.el.removeEventListener('mouseleave', this._handleMouseLeaveBound);
    this.el.removeEventListener('focus', this._handleFocusBound, true);
    this.el.removeEventListener('blur', this._handleBlurBound, true);
  }

  open(isManual) {
    if (this.isOpen) return;
    isManual = isManual === undefined ? true : undefined; // Default value true
    this.isOpen = true;
    // Update tooltip content with HTML attribute options
    this.options = {...this.options, ...this._getAttributeOptions()};
    this._updateTooltipContent();
    this._setEnterDelayTimeout(isManual);
  }

  close() {
    if (!this.isOpen) return;
    this.isHovered = false;
    this.isFocused = false;
    this.isOpen = false;
    this._setExitDelayTimeout();
  }

  _setExitDelayTimeout() {
    clearTimeout(this._exitDelayTimeout);
    this._exitDelayTimeout = setTimeout(() => {
      if (this.isHovered || this.isFocused) return;
      this._animateOut();
    }, this.options.exitDelay);
  }

  _setEnterDelayTimeout(isManual) {
    clearTimeout(this._enterDelayTimeout);
    this._enterDelayTimeout = setTimeout(() => {
      if (!this.isHovered && !this.isFocused && !isManual) return;
      this._animateIn();
    }, this.options.enterDelay);
  }

  _positionTooltip() {
    const tooltip: HTMLElement = this.tooltipEl;
    const origin = (this.el as HTMLElement),
      originHeight = origin.offsetHeight,
      originWidth = origin.offsetWidth,
      tooltipHeight = tooltip.offsetHeight,
      tooltipWidth = tooltip.offsetWidth,
      margin = this.options.margin;

    (this.xMovement = 0), (this.yMovement = 0);

    let targetTop = origin.getBoundingClientRect().top + M.getDocumentScrollTop();
    let targetLeft = origin.getBoundingClientRect().left + M.getDocumentScrollLeft();
    if (this.options.position === 'top') {
      targetTop += -tooltipHeight - margin;
      targetLeft += originWidth / 2 - tooltipWidth / 2;
      this.yMovement = -this.options.transitionMovement;
    } else if (this.options.position === 'right') {
      targetTop += originHeight / 2 - tooltipHeight / 2;
      targetLeft += originWidth + margin;
      this.xMovement = this.options.transitionMovement;
    } else if (this.options.position === 'left') {
      targetTop += originHeight / 2 - tooltipHeight / 2;
      targetLeft += -tooltipWidth - margin;
      this.xMovement = -this.options.transitionMovement;
    } else {
      targetTop += originHeight + margin;
      targetLeft += originWidth / 2 - tooltipWidth / 2;
      this.yMovement = this.options.transitionMovement;
    }

    const newCoordinates = this._repositionWithinScreen(
      targetLeft,
      targetTop,
      tooltipWidth,
      tooltipHeight
    );

    tooltip.style.top = newCoordinates.y+'px';
    tooltip.style.left = newCoordinates.x+'px';
  }

  _repositionWithinScreen(x, y, width, height) {
    const scrollLeft = M.getDocumentScrollLeft();
    const scrollTop = M.getDocumentScrollTop();
    let newX = x - scrollLeft;
    let newY = y - scrollTop;

    const bounding: Bounding = {
      left: newX,
      top: newY,
      width: width,
      height: height
    };
    const offset = this.options.margin + this.options.transitionMovement;
    const edges = M.checkWithinContainer(document.body, bounding, offset);

    if (edges.left) {
      newX = offset;
    } else if (edges.right) {
      newX -= newX + width - window.innerWidth;
    }
    if (edges.top) {
      newY = offset;
    } else if (edges.bottom) {
      newY -= newY + height - window.innerHeight;
    }
    return {
      x: newX + scrollLeft,
      y: newY + scrollTop
    };
  }

  _animateIn() {
    this._positionTooltip();
    this.tooltipEl.style.visibility = 'visible';
    anim.remove(this.tooltipEl);
    anim({
      targets: this.tooltipEl,
      opacity: this.options.opacity || 1,
      translateX: this.xMovement,
      translateY: this.yMovement,
      duration: this.options.inDuration,
      easing: 'easeOutCubic'
    });
  }

  _animateOut() {
    anim.remove(this.tooltipEl);
    anim({
      targets: this.tooltipEl,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      duration: this.options.outDuration,
      easing: 'easeOutCubic'
    });
  }

  _handleMouseEnter() {
    this.isHovered = true;
    this.isFocused = false; // Allows close of tooltip when opened by focus.
    this.open(false);
  }

  _handleMouseLeave() {
    this.isHovered = false;
    this.isFocused = false; // Allows close of tooltip when opened by focus.
    this.close();
  }

  _handleFocus() {
    if (M.tabPressed) {
      this.isFocused = true;
      this.open(false);
    }
  }

  _handleBlur() {
    this.isFocused = false;
    this.close();
  }

  _getAttributeOptions() {
    const attributeOptions = {};
    const tooltipTextOption = this.el.getAttribute('data-tooltip');
    const positionOption = this.el.getAttribute('data-position');
    if (tooltipTextOption) {
      (attributeOptions as any).text = tooltipTextOption;
    }
    if (positionOption) {
      (attributeOptions as any).position = positionOption;
    }
    return attributeOptions;
  }
}
