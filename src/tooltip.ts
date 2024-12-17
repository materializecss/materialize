import { Utils } from "./utils";
import { Bounding } from "./bounding";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipOptions extends BaseOptions {
  /**
   * Delay time before tooltip disappears.
   * @default 200
   */
  exitDelay: number;
  /**
   * Delay time before tooltip appears.
   * @default 0
   */
  enterDelay: number;
  /**
   * Element Id for the tooltip.
   * @default ""
   */
  tooltipId?: string;
  /**
   * Text string for the tooltip.
   * @default ""
   */
  text: string;
  /**
   * Set distance tooltip appears away from its activator
   * excluding transitionMovement.
   * @default 5
   */
  margin: number;
  /**
   * Enter transition duration.
   * @default 300
   */
  inDuration: number;
  /**
   * Opacity of the tooltip.
   * @default 1
   */
  opacity: number;
  /**
   * Exit transition duration.
   * @default 250
   */
  outDuration: number;
  /**
   * Set the direction of the tooltip.
   * @default 'bottom'
   */
  position: TooltipPosition;
  /**
   * Amount in px that the tooltip moves during its transition.
   * @default 10
   */
  transitionMovement: number;
}

const _defaults: TooltipOptions = {
  exitDelay: 200,
  enterDelay: 0,
  text: '',
  margin: 5,
  inDuration: 250,
  outDuration: 200,
  position: 'bottom' as TooltipPosition,
  transitionMovement: 10,
  opacity: 1
};

export class Tooltip extends Component<TooltipOptions> {
  /**
   * If tooltip is open.
   */
  isOpen: boolean;
  /**
   * If tooltip is hovered.
   */
  isHovered: boolean;
  /**
   * If tooltip is focused.
   */
  isFocused: boolean;
  tooltipEl: HTMLElement;
  private _exitDelayTimeout: string | number | NodeJS.Timeout;
  private _enterDelayTimeout: string | number | NodeJS.Timeout;
  xMovement: number;
  yMovement: number;

  constructor(el: HTMLElement, options: Partial<TooltipOptions>) {
    super(el, options, Tooltip);
    (this.el as any).M_Tooltip = this;

    this.options = {
      ...Tooltip.defaults,
      ...this._getAttributeOptions(),
      ...options
    };
    
    this.isOpen = false;
    this.isHovered = false;
    this.isFocused = false;
    this._appendTooltipEl();
    this._setupEventHandlers();
  }

  static get defaults(): TooltipOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Tooltip.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<TooltipOptions>): Tooltip;
  /**
   * Initializes instances of Tooltip.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<TooltipOptions>): Tooltip[];
  /**
   * Initializes instances of Tooltip.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<TooltipOptions> = {}): Tooltip | Tooltip[] {
    return super.init(els, options, Tooltip);
  }

  static getInstance(el: HTMLElement): Tooltip {
    return (el as any).M_Tooltip;
  }

  destroy() {
    this.tooltipEl.remove();
    this._removeEventHandlers();
    (this.el as any).M_Tooltip = undefined;
  }

  _appendTooltipEl() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.classList.add('material-tooltip');

    const tooltipContentEl = this.options.tooltipId 
      ? document.getElementById(this.options.tooltipId)
      : document.createElement('div');
    this.tooltipEl.append( tooltipContentEl);
    tooltipContentEl.style.display = ""; 
    
    tooltipContentEl.classList.add('tooltip-content');
    this._setTooltipContent(tooltipContentEl);
    this.tooltipEl.appendChild(tooltipContentEl);
    document.body.appendChild(this.tooltipEl);
  }

  _setTooltipContent(tooltipContentEl: HTMLElement) {
    if (this.options.tooltipId) 
      return;
    tooltipContentEl.innerText = this.options.text;        
  }

  _updateTooltipContent() {
    this._setTooltipContent(this.tooltipEl.querySelector('.tooltip-content'));
  }

  _setupEventHandlers() {
    this.el.addEventListener('mouseenter', this._handleMouseEnter);
    this.el.addEventListener('mouseleave', this._handleMouseLeave);
    this.el.addEventListener('focus', this._handleFocus, true);
    this.el.addEventListener('blur', this._handleBlur, true);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('mouseenter', this._handleMouseEnter);
    this.el.removeEventListener('mouseleave', this._handleMouseLeave);
    this.el.removeEventListener('focus', this._handleFocus, true);
    this.el.removeEventListener('blur', this._handleBlur, true);
  }

  /**
   * Show tooltip.
   */
  open = (isManual: boolean) => {
    if (this.isOpen) return;
    isManual = isManual === undefined ? true : undefined; // Default value true
    this.isOpen = true;
    // Update tooltip content with HTML attribute options
    this.options = {...this.options, ...this._getAttributeOptions()};
    this._updateTooltipContent();
    this._setEnterDelayTimeout(isManual);
  }
  
  /**
   * Hide tooltip.
   */
  close = () => {
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

    let targetTop = origin.getBoundingClientRect().top + Utils.getDocumentScrollTop();
    let targetLeft = origin.getBoundingClientRect().left + Utils.getDocumentScrollLeft();
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

  _repositionWithinScreen(x: number, y: number, width: number, height: number) {
    const scrollLeft = Utils.getDocumentScrollLeft();
    const scrollTop = Utils.getDocumentScrollTop();
    let newX = x - scrollLeft;
    let newY = y - scrollTop;

    const bounding: Bounding = {
      left: newX,
      top: newY,
      width: width,
      height: height
    };
    const offset = this.options.margin + this.options.transitionMovement;
    const edges = Utils.checkWithinContainer(document.body, bounding, offset);

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
    const duration = this.options.inDuration;
    // easeOutCubic
    this.tooltipEl.style.transition = `
      transform ${duration}ms ease-out,
      opacity ${duration}ms ease-out`;
    setTimeout(() => {
      this.tooltipEl.style.transform = `translateX(${this.xMovement}px) translateY(${this.yMovement}px)`;
      this.tooltipEl.style.opacity = (this.options.opacity || 1).toString();
    }, 1);
  }

  _animateOut() {
    const duration = this.options.outDuration;
    // easeOutCubic
    this.tooltipEl.style.transition = `
      transform ${duration}ms ease-out,
      opacity ${duration}ms ease-out`;
    setTimeout(() => {
      this.tooltipEl.style.transform = `translateX(0px) translateY(0px)`;
      this.tooltipEl.style.opacity = '0';
    }, 1);
    /*
    anim.remove(this.tooltipEl);
    anim({
      targets: this.tooltipEl,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      duration: this.options.outDuration,
      easing: 'easeOutCubic'
    });
    */
  }

  _handleMouseEnter = () => {
    this.isHovered = true;
    this.isFocused = false; // Allows close of tooltip when opened by focus.
    this.open(false);
  }

  _handleMouseLeave = () => {
    this.isHovered = false;
    this.isFocused = false; // Allows close of tooltip when opened by focus.
    this.close();
  }

  _handleFocus = () => {
    if (Utils.tabPressed) {
      this.isFocused = true;
      this.open(false);
    }
  }

  _handleBlur = () => {
    this.isFocused = false;
    this.close();
  }

  _getAttributeOptions(): Partial<TooltipOptions> {    
    const attributeOptions: Partial<TooltipOptions> = { };
    const tooltipTextOption = this.el.getAttribute('data-tooltip');
    const tooltipId = this.el.getAttribute('data-tooltip-id');
    const positionOption = this.el.getAttribute('data-position');
    if (tooltipTextOption) {
      attributeOptions.text = tooltipTextOption;
    }
    if (positionOption) {
      attributeOptions.position = positionOption as TooltipPosition;
    }
    if (tooltipId) {
      attributeOptions.tooltipId = tooltipId;
    }

    return attributeOptions;
  }
}
