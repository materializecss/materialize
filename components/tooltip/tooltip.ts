import { Component, BaseOptions, InitElements, MElement } from '../../src/component';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipOptions extends BaseOptions {
  /** Delay before tooltip disappears (ms) */
  exitDelay: number;
  /** Delay before tooltip appears (ms) */
  enterDelay: number;
  /** Custom element ID for existing content */
  tooltipId?: string;
  /** Text content for the tooltip */
  text: string;
  /** Position relative to the anchor */
  position: TooltipPosition;
}

const _defaults: TooltipOptions = {
  exitDelay: 200,
  enterDelay: 0,
  text: '',
  position: 'bottom'
};

export class Tooltip extends Component<TooltipOptions> {
  isOpen: boolean = false;
  isHovered: boolean = false;
  isFocused: boolean = false;

  tooltipEl: HTMLElement;
  private _enterTimeout: number | NodeJS.Timeout;
  private _exitTimeout: number | NodeJS.Timeout;

  constructor(el: HTMLElement, options: Partial<TooltipOptions>) {
    super(el, options, Tooltip);
    this.el['M_Tooltip'] = this;

    this.options = {
      ...Tooltip.defaults,
      ...this._getAttributeOptions(),
      ...options
    };

    this._setupPopoverElement();
    this._setupEventHandlers();
  }

  static get defaults(): TooltipOptions {
    return _defaults;
  }

  static init(el: HTMLElement, options?: Partial<TooltipOptions>): Tooltip;
  static init(els: InitElements<MElement>, options?: Partial<TooltipOptions>): Tooltip[];
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<TooltipOptions> = {}
  ): Tooltip | Tooltip[] {
    return super.init(els, options, Tooltip);
  }

  static getInstance(el: HTMLElement): Tooltip {
    return el['M_Tooltip'];
  }

  destroy() {
    this.tooltipEl.remove();
    this._removeEventHandlers();
    delete this.el['M_Tooltip'];
  }

  private _setupPopoverElement() {
    if (this.options.tooltipId) {
      this.tooltipEl = document.getElementById(this.options.tooltipId);
    } else {
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'material-tooltip';
      this.tooltipEl.textContent = this.options.text;
      document.body.appendChild(this.tooltipEl);
    }

    // Set native popover attributes
    this.tooltipEl.popover = 'manual';

    // Assign unique anchor name linking the element and popover
    const anchorName = `--tooltip-anchor-${Math.random().toString(36).substring(2, 9)}`;
    (this.el.style as any).anchorName = anchorName;
    (this.tooltipEl.style as any).positionAnchor = anchorName;

    // Set default position class/data-attribute for CSS positioning
    this.tooltipEl.dataset.position = this.options.position;
  }

  private _setupEventHandlers() {
    this.el.addEventListener('mouseenter', this._handleMouseEnter);
    this.el.addEventListener('mouseleave', this._handleMouseLeave);
    this.el.addEventListener('focus', this._handleFocus);
    this.el.addEventListener('blur', this._handleBlur);
  }

  private _removeEventHandlers() {
    this.el.removeEventListener('mouseenter', this._handleMouseEnter);
    this.el.removeEventListener('mouseleave', this._handleMouseLeave);
    this.el.removeEventListener('focus', this._handleFocus);
    this.el.removeEventListener('blur', this._handleBlur);
  }

  open = (isManual = true) => {
    if (this.isOpen) return;

    clearTimeout(this._exitTimeout);
    this.options = { ...this.options, ...this._getAttributeOptions() };
    this._updateContent();

    this._enterTimeout = setTimeout(() => {
      if (!isManual && !this.isHovered && !this.isFocused) return;

      this.tooltipEl.showPopover();
      this.isOpen = true;
    }, this.options.enterDelay);
  };

  close = () => {
    if (!this.isOpen) return;

    clearTimeout(this._enterTimeout);
    this.isHovered = false;
    this.isFocused = false;

    this._exitTimeout = setTimeout(() => {
      if (this.isHovered || this.isFocused) return;

      this.tooltipEl.hidePopover();
      this.isOpen = false;
    }, this.options.exitDelay);
  };

  private _updateContent() {
    if (!this.options.tooltipId) {
      this.tooltipEl.textContent = this.options.text;
    }
    this.tooltipEl.dataset.position = this.options.position;
  }

  private _handleMouseEnter = () => {
    this.isHovered = true;
    this.open(false);
  };

  private _handleMouseLeave = () => {
    this.isHovered = false;
    this.close();
  };

  private _handleFocus = () => {
    this.isFocused = true;
    this.open(false);
  };

  private _handleBlur = () => {
    this.isFocused = false;
    this.close();
  };

  private _getAttributeOptions(): Partial<TooltipOptions> {
    const attributeOptions: Partial<TooltipOptions> = {};
    const text = this.el.getAttribute('data-tooltip');
    const position = this.el.getAttribute('data-position') as TooltipPosition;
    const tooltipId = this.el.getAttribute('data-tooltip-id');

    if (text) attributeOptions.text = text;
    if (position) attributeOptions.position = position;
    if (tooltipId) attributeOptions.tooltipId = tooltipId;

    return attributeOptions;
  }
}
