import { Utils } from '../../src/utils';
import { Component, BaseOptions, InitElements, MElement, I18nOptions } from '../../src/component';
import { DockedDisplayPlugin } from '../../src/dockedDisplayPlugin';
import { ModalDisplayPlugin } from '../../src/modalDisplayPlugin';

export type Views = 'hours' | 'minutes';

export interface TimepickerOptions extends BaseOptions {
  /**
   * Dial radius.
   * @default 135
   */
  dialRadius: number;
  /**
   * Outer radius.
   * @default 105
   */
  outerRadius: number;
  /**
   * Inner radius.
   * @default 70
   */
  innerRadius: number;
  /**
   * Tick radius.
   * @default 20
   */
  tickRadius: number;
  /**
   * Duration of the transition from/to the hours/minutes view.
   * @default 350
   */
  duration: number;
  /**
   * Specify a DOM element OR selector for a DOM element to render
   * the time picker in, by default it will be placed before the input.
   * @default null
   */
  container: HTMLElement | string | null;
  /**
   * Show the clear button in the Timepicker.
   * @default false
   */
  showClearBtn: boolean;
  /**
   *  Autosubmit timepicker selection to input field
   *  @default true
   */
  // @todo this is only working on analog clock, should apply to hour/minute input fields and am/pm selector as well
  autoSubmit: true;
  /**
   * Default time to set on the timepicker 'now' or '13:14'.
   * @default 'now';
   */
  defaultTime: string;
  /**
   * Millisecond offset from the defaultTime.
   * @default 0
   */
  fromNow: number;
  /**
   * Internationalization options.
   */
  i18n: Partial<I18nOptions>;
  /**
   * Use 12 hour AM/PM clock instead of 24 hour clock.
   * @default true
   */
  twelveHour: boolean;
  /**
   * Vibrate device when dragging clock hand.
   * @default true
   */
  vibrate: boolean;
  /**
   * Callback function when a time is selected.
   * @default null
   */
  onSelect: (hour: number, minute: number) => void;
  /**
   * Callback function for interaction with input field.
   * @default null
   */
  onInputInteraction: (() => void) | null;
  /**
   * Callback function for done.
   * @default null
   */
  onDone: (() => void) | null;
  /**
   * Callback function for cancel.
   * @default null
   */
  onCancel: (() => void) | null;
  /**
   * Display plugin
   */
  displayPlugin: string;
  /**
   * Configurable display plugin options
   */
  displayPluginOptions: object;
}

const _defaults: TimepickerOptions = {
  dialRadius: 135,
  outerRadius: 105,
  innerRadius: 70,
  tickRadius: 20,
  duration: 350,
  container: null,
  defaultTime: 'now', // default time, 'now' or '13:14' e.g.
  fromNow: 0, // Millisecond offset from the defaultTime
  showClearBtn: false,
  autoSubmit: true,
  // internationalization
  i18n: {
    cancel: 'Cancel',
    clear: 'Clear',
    done: 'Ok'
  },
  twelveHour: true, // change to 12 hour AM/PM clock from 24 hour
  vibrate: true, // vibrate the device when dragging clock hand
  // Callbacks
  onSelect: null,
  onInputInteraction: null,
  onDone: null,
  onCancel: null,
  displayPlugin: null,
  displayPluginOptions: null
};

type Point = {
  x: number;
  y: number;
};

export class Timepicker extends Component<TimepickerOptions> {
  declare el: HTMLInputElement;
  id: string;
  containerEl: HTMLElement;
  plate: HTMLElement;
  digitalClock: HTMLElement;
  inputHours: HTMLInputElement;
  inputMinutes: HTMLInputElement;
  x0: number;
  y0: number;
  moved: boolean;
  dx: number;
  dy: number;
  /**
   * Current view on the timepicker.
   * @default 'hours'
   */
  currentView: Views;
  hand: SVGElement;
  minutesView: HTMLElement;
  hours: number;
  minutes: number;
  /** The selected time. */
  time: string;
  /**
   * If the time is AM or PM on twelve-hour clock.
   * @default 'PM'
   */
  amOrPm: 'AM' | 'PM';
  static _template;
  /** Vibrate device when dragging clock hand. */
  vibrate: 'vibrate' | 'webkitVibrate' | null;
  _canvas: HTMLElement;
  hoursView: HTMLElement;
  spanAmPm: HTMLSpanElement;
  footer: HTMLElement;
  private _amBtn: HTMLElement;
  private _pmBtn: HTMLElement;
  bg: Element;
  bearing: Element;
  g: Element;
  toggleViewTimer: string | number | NodeJS.Timeout;
  vibrateTimer: NodeJS.Timeout | number;
  private displayPlugin: DockedDisplayPlugin | ModalDisplayPlugin;

  constructor(el: HTMLInputElement, options: Partial<TimepickerOptions>) {
    super(el, options, Timepicker);
    this.el['M_Timepicker'] = this;
    this.options = {
      ...Timepicker.defaults,
      ...options
    };
    this.id = Utils.guid();
    this._insertHTMLIntoDOM();
    this._setupVariables();
    this._setupEventHandlers();
    this._clockSetup();
    if (this.options.displayPlugin) {
      if (this.options.displayPlugin === 'docked')
        this.displayPlugin = DockedDisplayPlugin.init(
          this.el,
          this.containerEl,
          this.options.displayPluginOptions
        );
    }
    this._pickerSetup();
  }

  static get defaults(): TimepickerOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Timepicker.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLInputElement, options?: Partial<TimepickerOptions>): Timepicker;
  /**
   * Initializes instances of Timepicker.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: InitElements<HTMLInputElement | MElement>,
    options?: Partial<TimepickerOptions>
  ): Timepicker[];
  /**
   * Initializes instances of Timepicker.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLInputElement | InitElements<HTMLInputElement | MElement>,
    options: Partial<TimepickerOptions> = {}
  ): Timepicker | Timepicker[] {
    return super.init(els, options, Timepicker);
  }

  static _addLeadingZero(num: number) {
    return (num < 10 ? '0' : '') + num;
  }

  static _createSVGEl(name: string) {
    const svgNS = 'http://www.w3.org/2000/svg';
    return document.createElementNS(svgNS, name);
  }

  static _Pos(e: TouchEvent | MouseEvent): Point {
    if (e.type.startsWith('touch') && (e as TouchEvent).targetTouches.length >= 1) {
      return {
        x: (e as TouchEvent).targetTouches[0].clientX,
        y: (e as TouchEvent).targetTouches[0].clientY
      };
    }
    // mouse event
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }

  static getInstance(el: HTMLElement): Timepicker {
    return el['M_Timepicker'];
  }

  destroy() {
    this._removeEventHandlers();
    this.containerEl.remove();
    this.el['M_Timepicker'] = undefined;
  }

  _setupEventHandlers() {
    this.el.addEventListener('click', this._handleInputClick);
    // @todo allow input field to fill values from input field when container/modal opens
    this.el.addEventListener('keydown', this._handleInputKeydown);
    this.plate.addEventListener('mousedown', this._handleClockClickStart);
    this.plate.addEventListener('touchstart', this._handleClockClickStart);
    this.digitalClock.addEventListener('keyup', this._inputFromTextField);
    this.inputHours.addEventListener('focus', () => this.showView('hours'));
    this.inputHours.addEventListener('focusout', () => this.formatHours());
    this.inputMinutes.addEventListener('focus', () => this.showView('minutes'));
    this.inputMinutes.addEventListener('focusout', () => this.formatMinutes());
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleInputClick);
    this.el.removeEventListener('keydown', this._handleInputKeydown);
  }

  _handleInputClick = () => {
    this.inputHours.focus();
    if (typeof this.options.onInputInteraction === 'function')
      this.options.onInputInteraction.call(this);
    if (this.displayPlugin) this.displayPlugin.show();
  };

  _handleInputKeydown = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      e.preventDefault();
      this.inputHours.focus();
      if (typeof this.options.onInputInteraction === 'function')
        this.options.onInputInteraction.call(this);
      if (this.displayPlugin) this.displayPlugin.show();
    }
  };

  _handleTimeInputEnterKey = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      e.preventDefault();
      this._inputFromTextField();
    }
  };

  _handleClockClickStart = (e) => {
    e.preventDefault();
    const clockPlateBR = this.plate.getBoundingClientRect();
    const offset = { x: clockPlateBR.left, y: clockPlateBR.top };

    this.x0 = offset.x + this.options.dialRadius;
    this.y0 = offset.y + this.options.dialRadius;
    this.moved = false;
    const clickPos = Timepicker._Pos(e);
    this.dx = clickPos.x - this.x0;
    this.dy = clickPos.y - this.y0;

    // Set clock hands
    this.setHand(this.dx, this.dy, false);
    // Mousemove on document
    document.addEventListener('mousemove', this._handleDocumentClickMove);
    document.addEventListener('touchmove', this._handleDocumentClickMove);
    // Mouseup on document
    document.addEventListener('mouseup', this._handleDocumentClickEnd);
    document.addEventListener('touchend', this._handleDocumentClickEnd);
  };

  _handleDocumentClickMove = (e) => {
    e.preventDefault();
    const clickPos = Timepicker._Pos(e);
    const x = clickPos.x - this.x0;
    const y = clickPos.y - this.y0;
    this.moved = true;
    this.setHand(x, y, false);
  };

  _handleDocumentClickEnd = (e) => {
    e.preventDefault();
    document.removeEventListener('mouseup', this._handleDocumentClickEnd);
    document.removeEventListener('touchend', this._handleDocumentClickEnd);
    const clickPos = Timepicker._Pos(e);
    const x = clickPos.x - this.x0;
    const y = clickPos.y - this.y0;
    if (this.moved && x === this.dx && y === this.dy) {
      this.setHand(x, y);
    }

    if (this.currentView === 'hours') {
      this.inputMinutes.focus();
      this.showView('minutes', this.options.duration / 2);
    } else {
      // this.minutesView.classList.add('timepicker-dial-out');
      setTimeout(() => {
        if (this.options.autoSubmit) this.done();
      }, this.options.duration / 2);
    }

    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect.call(this, this.hours, this.minutes);
    }
    // Unbind mousemove event
    document.removeEventListener('mousemove', this._handleDocumentClickMove);
    document.removeEventListener('touchmove', this._handleDocumentClickMove);
  };

  _insertHTMLIntoDOM() {
    const template = document.createElement('template');
    template.innerHTML = Timepicker._template.trim();

    this.containerEl = <HTMLElement>template.content.firstChild;
    this.containerEl.id = 'container-' + this.id;

    // Append popover to input by default
    const optEl = this.options.container;
    const containerEl = optEl instanceof HTMLElement ? optEl : document.querySelector(optEl);

    if (this.options.container && !!containerEl) {
      containerEl.append(this.containerEl);
    } else {
      this.el.parentElement.appendChild(this.containerEl);
    }
  }

  _setupVariables() {
    this.currentView = 'hours';
    this.vibrate = navigator.vibrate
      ? 'vibrate'
      : navigator['webkitVibrate']
      ? 'webkitVibrate'
      : null;
    this._canvas = this.containerEl.querySelector('.timepicker-canvas');
    this.plate = this.containerEl.querySelector('.timepicker-plate');
    this.digitalClock = this.containerEl.querySelector('.timepicker-display-column');
    this.hoursView = this.containerEl.querySelector('.timepicker-hours');
    this.minutesView = this.containerEl.querySelector('.timepicker-minutes');
    this.inputHours = this.containerEl.querySelector('.timepicker-input-hours');
    this.inputMinutes = this.containerEl.querySelector('.timepicker-input-minutes');
    this.spanAmPm = this.containerEl.querySelector('.timepicker-span-am-pm');
    this.footer = this.containerEl.querySelector('.timepicker-footer');
    this.amOrPm = 'PM';
  }

  /*private _createButton(text: string, visibility: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('btn', 'waves-effect', 'text');
    button.style.visibility = visibility;
    button.type = 'button';
    button.tabIndex = -1;
    button.innerText = text;
    return button;
  }*/

  _pickerSetup() {
    // clearButton.classList.add('timepicker-clear');
    // clearButton.addEventListener('click', this.clear);
    // this.footer.appendChild(clearButton);
    if (this.options.showClearBtn) {
      Utils.createButton(
        this.footer,
        this.options.i18n.clear,
        ['timepicker-clear'],
        true,
        this.clear
      );
    }

    if (!this.options.autoSubmit) {
      /*const confirmationBtnsContainer = document.createElement('div');
    confirmationBtnsContainer.classList.add('confirmation-btns');
    this.footer.append(confirmationBtnsContainer);

    const cancelButton = this._createButton(this.options.i18n.cancel, '');
    cancelButton.classList.add('timepicker-close');
    cancelButton.addEventListener('click', this.close);
    confirmationBtnsContainer.appendChild(cancelButton);

    const doneButton = this._createButton(this.options.i18n.done, '');
    doneButton.classList.add('timepicker-close');
    //doneButton.addEventListener('click', this._finishSelection);
    confirmationBtnsContainer.appendChild(doneButton);*/
      Utils.createConfirmationContainer(
        this.footer,
        this.options.i18n.done,
        this.options.i18n.cancel,
        this.confirm,
        this.cancel
      );
    }

    this._updateTimeFromInput();
    this.showView('hours');
  }

  private _setupDisplayPlugin() {
    if (this.options.displayPlugin === 'docked') this.displayPlugin = DockedDisplayPlugin.init(this.el, this.containerEl, this.options.displayPluginOptions);
    if (this.options.displayPlugin === 'modal') {
      this.displayPlugin = ModalDisplayPlugin.init(this.el, this.containerEl, {
        ...this.options.displayPluginOptions,
        ...{ classList: ['timepicker-modal'] }
      });
      this.footer.remove();
      this.footer = this.displayPlugin.footer;
    }
  }

  _clockSetup() {
    if (this.options.twelveHour) {
      // AM Button
      this._amBtn = document.createElement('div');
      this._amBtn.classList.add('am-btn', 'btn');
      this._amBtn.innerText = 'AM';
      this._amBtn.tabIndex = 0;
      this._amBtn.addEventListener('click', this._handleAmPmClick);
      this._amBtn.addEventListener('keypress', this._handleAmPmKeypress);
      this.spanAmPm.appendChild(this._amBtn);
      // PM Button
      this._pmBtn = document.createElement('div');
      this._pmBtn.classList.add('pm-btn', 'btn');
      this._pmBtn.innerText = 'PM';
      this._pmBtn.tabIndex = 0;
      this._pmBtn.addEventListener('click', this._handleAmPmClick);
      this._pmBtn.addEventListener('keypress', this._handleAmPmKeypress);
      this.spanAmPm.appendChild(this._pmBtn);
    }
    this._buildHoursView();
    this._buildMinutesView();
    this._buildSVGClock();
  }

  _buildSVGClock() {
    // Draw clock hands and others
    const dialRadius = this.options.dialRadius;
    const tickRadius = this.options.tickRadius;
    const diameter = dialRadius * 2;
    const svg = Timepicker._createSVGEl('svg');
    svg.setAttribute('class', 'timepicker-svg');
    svg.setAttribute('width', diameter.toString());
    svg.setAttribute('height', diameter.toString());
    const g = Timepicker._createSVGEl('g');
    g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
    const bearing = Timepicker._createSVGEl('circle');
    bearing.setAttribute('class', 'timepicker-canvas-bearing');
    bearing.setAttribute('cx', '0');
    bearing.setAttribute('cy', '0');
    bearing.setAttribute('r', '4');
    const hand = Timepicker._createSVGEl('line');
    hand.setAttribute('x1', '0');
    hand.setAttribute('y1', '0');
    const bg = Timepicker._createSVGEl('circle');
    bg.setAttribute('class', 'timepicker-canvas-bg');
    bg.setAttribute('r', tickRadius.toString());
    g.appendChild(hand);
    g.appendChild(bg);
    g.appendChild(bearing);
    svg.appendChild(g);
    this._canvas.appendChild(svg);
    this.hand = hand;
    this.bg = bg;
    this.bearing = bearing;
    this.g = g;
  }

  _buildHoursView() {
    // const $tick = document.createElement('div');
    // $tick.classList.add('timepicker-tick');
    // Hours view
    if (this.options.twelveHour) {
      for (let i = 1; i < 13; i += 1) {
        // const tick = <HTMLElement>$tick.cloneNode(true);
        const radian = (i / 6) * Math.PI;
        const radius = this.options.outerRadius;
        this._buildHoursTick(i, radian, radius);
      }
    } else {
      for (let i = 0; i < 24; i += 1) {
        // const tick = <HTMLElement>$tick.cloneNode(true);
        const radian = (i / 6) * Math.PI;
        const inner = i > 0 && i < 13;
        const radius = inner ? this.options.innerRadius : this.options.outerRadius;
        this._buildHoursTick(i, radian, radius);
      }
    }
  }

  _buildHoursTick(i: number, radian: number, radius: number) {
    const tick = document.createElement('div');
    tick.classList.add('timepicker-tick');
    tick.style.left =
      this.options.dialRadius + Math.sin(radian) * radius - this.options.tickRadius + 'px';
    tick.style.top =
      this.options.dialRadius - Math.cos(radian) * radius - this.options.tickRadius + 'px';
    tick.innerHTML = i === 0 ? '00' : i.toString();
    this.hoursView.appendChild(tick);
  }

  _buildMinutesView() {
    const _tick = document.createElement('div');
    _tick.classList.add('timepicker-tick');
    // Minutes view
    for (let i = 0; i < 60; i += 5) {
      const tick = <HTMLElement>_tick.cloneNode(true);
      const radian = (i / 30) * Math.PI;
      tick.style.left =
        this.options.dialRadius +
        Math.sin(radian) * this.options.outerRadius -
        this.options.tickRadius +
        'px';
      tick.style.top =
        this.options.dialRadius -
        Math.cos(radian) * this.options.outerRadius -
        this.options.tickRadius +
        'px';
      tick.innerHTML = Timepicker._addLeadingZero(i);
      this.minutesView.appendChild(tick);
    }
  }

  _handleAmPmClick = (e: MouseEvent) => {
    this._handleAmPmInteraction(<HTMLElement>e.target);
  };

  _handleAmPmKeypress = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      this._handleAmPmInteraction(<HTMLElement>e.target);
    }
  };

  _handleAmPmInteraction = (e: HTMLElement) => {
    this.amOrPm = e.classList.contains('am-btn') ? 'AM' : 'PM';
    this._updateAmPmView();
  };

  _updateAmPmView() {
    if (this.options.twelveHour) {
      if (this.amOrPm === 'PM') {
        this._amBtn.classList.remove('filled');
        this._pmBtn.classList.add('filled');
      } else if (this.amOrPm === 'AM') {
        this._amBtn.classList.add('filled');
        this._pmBtn.classList.remove('filled');
      }
    }
  }

  _updateTimeFromInput() {
    // Get the time
    let value = ((this.el.value || this.options.defaultTime || '') + '').split(':');
    if (this.options.twelveHour && !(typeof value[1] === 'undefined')) {
      if (value[1].toUpperCase().indexOf('AM') > 0) {
        this.amOrPm = 'AM';
      } else {
        this.amOrPm = 'PM';
      }
      value[1] = value[1].replace('AM', '').replace('PM', '');
    }
    if (value[0] === 'now') {
      const now = new Date(+new Date() + this.options.fromNow);
      value = [now.getHours().toString(), now.getMinutes().toString()];
      if (this.options.twelveHour) {
        this.amOrPm = parseInt(value[0]) >= 12 && parseInt(value[0]) < 24 ? 'PM' : 'AM';
      }
    }
    this.hours = +value[0] || 0;
    this.minutes = +value[1] || 0;
    this.inputHours.value = Timepicker._addLeadingZero(this.hours);
    this.inputMinutes.value = Timepicker._addLeadingZero(this.minutes);

    this._updateAmPmView();
  }

  /**
   * Show hours or minutes view on timepicker.
   * @param view The name of the view you want to switch to, 'hours' or 'minutes'.
   * @param delay
   */
  showView = (view: Views, delay: number = null) => {
    if (view === 'minutes' && getComputedStyle(this.hoursView).visibility === 'visible') {
      // raiseCallback(this.options.beforeHourSelect);
    }
    const isHours = view === 'hours',
      nextView = isHours ? this.hoursView : this.minutesView,
      hideView = isHours ? this.minutesView : this.hoursView;
    this.currentView = view;

    /*if (isHours) {
      this.inputHours.classList.add('text-primary');
      this.inputMinutes.classList.remove('text-primary');
    } else {
      this.inputHours.classList.remove('text-primary');
      this.inputMinutes.classList.add('text-primary');
    }*/

    // Transition view
    hideView.classList.add('timepicker-dial-out');

    nextView.style.visibility = 'visible';
    nextView.classList.remove('timepicker-dial-out');

    // Reset clock hand
    this.resetClock(delay);
    // After transitions ended
    clearTimeout(this.toggleViewTimer);
    this.toggleViewTimer = setTimeout(() => {
      hideView.style.visibility = 'hidden';
    }, this.options.duration);
  };

  resetClock(delay) {
    const view = this.currentView,
      value = this[view],
      isHours = view === 'hours',
      unit = Math.PI / (isHours ? 6 : 30),
      radian = value * unit,
      radius =
        isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius,
      x = Math.sin(radian) * radius,
      y = -Math.cos(radian) * radius;

    if (delay) {
      this._canvas?.classList.add('timepicker-canvas-out');
      setTimeout(() => {
        this._canvas?.classList.remove('timepicker-canvas-out');
        this.setHand(x, y);
      }, delay);
    } else {
      this.setHand(x, y);
    }
  }

  _inputFromTextField = () => {
    const isHours = this.currentView === 'hours';
    if (isHours && this.inputHours.value !== '') {
      const value = parseInt(this.inputHours.value);
      if (value > 0 && value < (this.options.twelveHour ? 13 : 24)) {
        this.hours = value;
      } else {
        this.setHoursDefault();
      }
      this.drawClockFromTimeInput(this.hours, isHours);
    } else if (!isHours && this.inputMinutes.value !== '') {
      const value = parseInt(this.inputMinutes.value);
      if (value >= 0 && value < 60) {
        this.minutes = value;
      } else {
        this.minutes = new Date().getMinutes();
        this.inputMinutes.value = this.minutes.toString();
      }
      this.drawClockFromTimeInput(this.minutes, isHours);
    }
  };

  drawClockFromTimeInput(value, isHours) {
    const unit = Math.PI / (isHours ? 6 : 30);
    const radian = value * unit;
    let radius;
    if (this.options.twelveHour) {
      radius = this.options.outerRadius;
    } else {
      radius =
        isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius;
    }
    this.setClockAttributes(radian, radius);
  }

  setHand(x, y, roundBy5: boolean = false) {
    const isHours = this.currentView === 'hours',
      unit = Math.PI / (isHours || roundBy5 ? 6 : 30),
      z = Math.sqrt(x * x + y * y),
      inner = isHours && z < (this.options.outerRadius + this.options.innerRadius) / 2;
    let radian = Math.atan2(x, -y),
      radius = inner ? this.options.innerRadius : this.options.outerRadius;

    if (this.options.twelveHour) {
      radius = this.options.outerRadius;
    }

    // Radian should in range [0, 2PI]
    if (radian < 0) {
      radian = Math.PI * 2 + radian;
    }

    // Get the round value
    let value = Math.round(radian / unit);

    // Get the round radian
    radian = value * unit;

    // Correct the hours or minutes
    if (this.options.twelveHour) {
      if (isHours) {
        if (value === 0) value = 12;
      } else {
        if (roundBy5) value *= 5;
        if (value === 60) value = 0;
      }
    } else {
      if (isHours) {
        if (value === 12) {
          value = 0;
        }
        value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
      } else {
        if (roundBy5) {
          value *= 5;
        }
        if (value === 60) {
          value = 0;
        }
      }
    }

    // Once hours or minutes changed, vibrate the device
    if (this[this.currentView] !== value) {
      if (this.vibrate && this.options.vibrate) {
        // Do not vibrate too frequently
        if (!this.vibrateTimer) {
          navigator[this.vibrate](10);
          this.vibrateTimer = setTimeout(() => {
            this.vibrateTimer = null;
          }, 100);
        }
      }
    }

    this[this.currentView] = value;
    if (isHours) {
      this.inputHours.value = Timepicker._addLeadingZero(value);
    } else {
      this.inputMinutes.value = Timepicker._addLeadingZero(value);
    }

    // Set clock hand and others' position
    this.setClockAttributes(radian, radius);
  }

  setClockAttributes(radian: number, radius: number) {
    const cx1 = Math.sin(radian) * (radius - this.options.tickRadius),
      cy1 = -Math.cos(radian) * (radius - this.options.tickRadius),
      cx2 = Math.sin(radian) * radius,
      cy2 = -Math.cos(radian) * radius;
    this.hand.setAttribute('x2', cx1.toString());
    this.hand.setAttribute('y2', cy1.toString());
    this.bg.setAttribute('cx', cx2.toString());
    this.bg.setAttribute('cy', cy2.toString());
  }

  formatHours() {
    if (this.inputHours.value == '') this.setHoursDefault();
    this.inputHours.value = Timepicker._addLeadingZero(Number(this.inputHours.value));
  }

  formatMinutes() {
    if (this.inputMinutes.value == '') this.minutes = new Date().getMinutes();
    this.inputMinutes.value = Timepicker._addLeadingZero(Number(this.inputMinutes.value));
  }

  setHoursDefault() {
    this.hours = new Date().getHours();
    this.inputHours.value = (this.hours % (this.options.twelveHour ? 12 : 24)).toString();
  }

  done = (clearValue = null) => {
    // Set input value
    const last = this.el.value;
    let value = clearValue
      ? ''
      : Timepicker._addLeadingZero(this.hours) + ':' + Timepicker._addLeadingZero(this.minutes);
    this.time = value;
    if (!clearValue && this.options.twelveHour) {
      value = `${value} ${this.amOrPm}`;
    }
    this.el.value = value;
    // Trigger change event
    if (value !== last) {
      this.el.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true, composed: true })
      );
    }
  };

  confirm = () => {
    this.done();
    if (this.displayPlugin) this.displayPlugin.hide();
    if (typeof this.options.onDone === 'function') this.options.onDone.call(this);
  };

  cancel = () => {
    // not logical clearing the input field on cancel, since the end user might want to make use of the previously submitted value
    // this.clear();
    if (this.displayPlugin) this.displayPlugin.hide();
    if (typeof this.options.onCancel === 'function') this.options.onCancel.call(this);
  };

  clear = () => {
    // @todo should clear timepicker hour/minute input elems and reset analog clock, currently clears input el
    this.done(true);
  };

  // deprecated
  open() {
    console.warn(
      'Timepicker.close() is deprecated. Remove this method and wrap in modal yourself.'
    );
    return this;
  }

  close() {
    console.warn(
      'Timepicker.close() is deprecated. Remove this method and wrap in modal yourself.'
    );
    return this;
  }

  static {
    Timepicker._template = `<div class="timepicker-container">
          <div class="timepicker-digital-display">
            <div class="timepicker-text-container">
              <div class="timepicker-display-column timepicker-display-digital-clock">
                <div class="timepicker-input-hours-wrapper">
                  <input type="text" maxlength="2" class="timepicker-input-hours text-primary" />
                </div>
                <div class="timepicker-input-divider-wrapper">
                  <span class="timepicker-input-divider">:</span>
                </div>
                <div class="timepicker-input-minutes-wrapper">
                  <input type="text" maxlength="2" class="timepicker-input-minutes" />
                </div>
              </div>
              <div class="timepicker-display-column timepicker-display-am-pm">
                <div class="timepicker-span-am-pm"></div>
              </div>
            </div>
          </div>
          <div class="timepicker-analog-display">
            <div class="timepicker-plate">
              <div class="timepicker-canvas"></div>
              <div class="timepicker-dial timepicker-hours"></div>
              <div class="timepicker-dial timepicker-minutes timepicker-dial-out"></div>
            </div>
            <div class="timepicker-footer"></div>
          </div>
        </div>`;
  }
}
