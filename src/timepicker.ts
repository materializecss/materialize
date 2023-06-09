import { Component } from "./component";
import { M } from "./global";
import { Modal } from "./modal";

let _defaults = {
  dialRadius: 135,
  outerRadius: 105,
  innerRadius: 70,
  tickRadius: 20,
  duration: 350,
  container: null,
  defaultTime: 'now', // default time, 'now' or '13:14' e.g.
  fromNow: 0, // Millisecond offset from the defaultTime
  showClearBtn: false,
  // internationalization
  i18n: {
    cancel: 'Cancel',
    clear: 'Clear',
    done: 'Ok'
  },
  autoClose: false, // auto close when minute is selected
  twelveHour: true, // change to 12 hour AM/PM clock from 24 hour
  vibrate: true, // vibrate the device when dragging clock hand
  // Callbacks
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null,
  onSelect: null
};

type Point = {
  x: number,
  y: number
};

export class Timepicker extends Component {
  el: HTMLInputElement;
  id: string;
  modal: Modal;
  modalEl: HTMLElement;
  plate: any;
  digitalClock: any;
  inputHours: HTMLInputElement;
  inputMinutes: HTMLInputElement;
  x0: number;
  y0: number;
  moved: boolean;
  dx: number;
  dy: number;
  currentView: string;
  hand: any;
  minutesView: HTMLElement;
  hours: any;
  minutes: any;
  time: string;
  amOrPm: any;
  static _template: any;
  isOpen: boolean;
  vibrate: string;
  _canvas: HTMLElement;
  hoursView: any;
  spanAmPm: HTMLSpanElement;
  footer: HTMLElement;
  private _amBtn: HTMLElement;
  private _pmBtn: HTMLElement;
  bg: Element;
  bearing: Element;
  g: Element;
  toggleViewTimer: string | number | NodeJS.Timeout;
  canvas: any;
  vibrateTimer: any;

  constructor(el, options) {
    super(Timepicker, el, options);
    (this.el as any).M_Timepicker = this;
    this.options = {...Timepicker.defaults, ...options};
    this.id = M.guid();
    this._insertHTMLIntoDOM();
    this._setupModal();
    this._setupVariables();
    this._setupEventHandlers();
    this._clockSetup();
    this._pickerSetup();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static _addLeadingZero(num) {
    return (num < 10 ? '0' : '') + num;
  }

  static _createSVGEl(name) {
    let svgNS = 'http://www.w3.org/2000/svg';
    return document.createElementNS(svgNS, name);
  }

  static _Pos(e): Point {
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    }
    // mouse event
    return { x: e.clientX, y: e.clientY };
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Timepicker;
  }

  destroy() {
    this._removeEventHandlers();
    this.modal.destroy();
    this.modalEl.remove();
    (this.el as any).M_Timepicker = undefined;
  }

  _setupEventHandlers() {
    this.el.addEventListener('click', this._handleInputClick);
    this.el.addEventListener('keydown', this._handleInputKeydown);
    this.plate.addEventListener('mousedown', this._handleClockClickStart);
    this.plate.addEventListener('touchstart', this._handleClockClickStart);
    this.digitalClock.addEventListener('keyup', this._inputFromTextField);
    this.inputHours.addEventListener('click', () => this.showView('hours'));
    this.inputMinutes.addEventListener('click', () => this.showView('minutes'));
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleInputClick);
    this.el.removeEventListener('keydown', this._handleInputKeydown);
  }

  _handleInputClick = () => {
    this.open();
  }

  _handleInputKeydown = (e) => {
    if (e.which === M.keys.ENTER) {
      e.preventDefault();
      this.open();
    }
  }

  _handleTimeInputEnterKey = (e) => {
    if (e.which === M.keys.ENTER) {
      e.preventDefault();
      this._inputFromTextField();
    }
  }

  _handleClockClickStart = (e) => {
    e.preventDefault();
    let clockPlateBR = this.plate.getBoundingClientRect();
    let offset = { x: clockPlateBR.left, y: clockPlateBR.top };

    this.x0 = offset.x + this.options.dialRadius;
    this.y0 = offset.y + this.options.dialRadius;
    this.moved = false;
    let clickPos = Timepicker._Pos(e);
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
  }

  _handleDocumentClickMove = (e) => {
    e.preventDefault();
    let clickPos = Timepicker._Pos(e);
    let x = clickPos.x - this.x0;
    let y = clickPos.y - this.y0;
    this.moved = true;
    this.setHand(x, y, false);
  }

  _handleDocumentClickEnd = (e) => {
    e.preventDefault();
    document.removeEventListener('mouseup', this._handleDocumentClickEnd);
    document.removeEventListener('touchend', this._handleDocumentClickEnd);
    let clickPos = Timepicker._Pos(e);
    let x = clickPos.x - this.x0;
    let y = clickPos.y - this.y0;
    if (this.moved && x === this.dx && y === this.dy) {
      this.setHand(x, y);
    }
    if (this.currentView === 'hours') {
      this.showView('minutes', this.options.duration / 2);
    }
    else if (this.options.autoClose) {
      this.minutesView.classList.add('timepicker-dial-out');
      setTimeout(() => {
        this.done();
      }, this.options.duration / 2);
    }
    if (typeof this.options.onSelect === 'function') {
      this.options.onSelect.call(this, this.hours, this.minutes);
    }
    // Unbind mousemove event
    document.removeEventListener('mousemove', this._handleDocumentClickMove);
    document.removeEventListener('touchmove', this._handleDocumentClickMove);
  }

  _insertHTMLIntoDOM() {
    const template = document.createElement('template');
    template.innerHTML = Timepicker._template.trim();
    this.modalEl = <HTMLElement>template.content.firstChild;
    this.modalEl.id = 'modal-' + this.id;

    // Append popover to input by default
    const optEl = this.options.container;
    const containerEl = optEl instanceof HTMLElement ? optEl : document.querySelector(optEl);

    if (this.options.container && !!containerEl) {
      containerEl.append(this.modalEl);
    }
    else {
      this.el.parentElement.appendChild(this.modalEl);
    }
  }

  _setupModal() {
    this.modal = M.Modal.init(this.modalEl, {
      onOpenStart: this.options.onOpenStart,
      onOpenEnd: this.options.onOpenEnd,
      onCloseStart: this.options.onCloseStart,
      onCloseEnd: () => {
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this);
        }
        this.isOpen = false;
      }
    });
  }

  _setupVariables() {
    this.currentView = 'hours';
    this.vibrate = navigator.vibrate
      ? 'vibrate'
      : (navigator as any).webkitVibrate
      ? 'webkitVibrate'
      : null;
    this._canvas = this.modalEl.querySelector('.timepicker-canvas');
    this.plate = this.modalEl.querySelector('.timepicker-plate');
    this.digitalClock = this.modalEl.querySelector('.timepicker-display-column');
    this.hoursView = this.modalEl.querySelector('.timepicker-hours');
    this.minutesView = this.modalEl.querySelector('.timepicker-minutes');
    this.inputHours = this.modalEl.querySelector('.timepicker-input-hours');
    this.inputMinutes = this.modalEl.querySelector('.timepicker-input-minutes');
    this.spanAmPm = this.modalEl.querySelector('.timepicker-span-am-pm');
    this.footer = this.modalEl.querySelector('.timepicker-footer');
    this.amOrPm = 'PM';
  }

  private _createButton(text: string, visibility: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('btn-flat', 'waves-effect');
    button.style.visibility = visibility;
    button.type = 'button';
    button.tabIndex = this.options.twelveHour ? 3 : 1;
    button.innerText = text;
    return button;
  }

  _pickerSetup() {
    const clearButton = this._createButton(this.options.i18n.clear, this.options.showClearBtn ? '' : 'hidden');
    clearButton.classList.add('timepicker-clear');
    clearButton.addEventListener('click', this.clear);
    this.footer.appendChild(clearButton);

    const confirmationBtnsContainer = document.createElement('div');
    confirmationBtnsContainer.classList.add('confirmation-btns');
    this.footer.append(confirmationBtnsContainer);

    const cancelButton = this._createButton(this.options.i18n.cancel, '');
    cancelButton.classList.add('timepicker-close');
    cancelButton.addEventListener('click', this.close);
    confirmationBtnsContainer.appendChild(cancelButton);

    const doneButton = this._createButton(this.options.i18n.done, '');
    doneButton.classList.add('timepicker-close');
    doneButton.addEventListener('click', this.done);
    confirmationBtnsContainer.appendChild(doneButton);
  }

  _clockSetup() {
    if (this.options.twelveHour) {
      // AM Button
      this._amBtn = document.createElement('div');
      this._amBtn.classList.add('am-btn');
      this._amBtn.innerText = 'AM';
      this._amBtn.addEventListener('click', this._handleAmPmClick);
      this.spanAmPm.appendChild(this._amBtn);
      // PM Button
      this._pmBtn = document.createElement('div');
      this._pmBtn.classList.add('pm-btn');
      this._pmBtn.innerText = 'PM';
      this._pmBtn.addEventListener('click', this._handleAmPmClick);
      this.spanAmPm.appendChild(this._pmBtn);
    }
    this._buildHoursView();
    this._buildMinutesView();
    this._buildSVGClock();
  }

  _buildSVGClock() {
    // Draw clock hands and others
    let dialRadius = this.options.dialRadius;
    let tickRadius = this.options.tickRadius;
    let diameter = dialRadius * 2;
    let svg = Timepicker._createSVGEl('svg');
    svg.setAttribute('class', 'timepicker-svg');
    svg.setAttribute('width', diameter.toString());
    svg.setAttribute('height', diameter.toString());
    let g = Timepicker._createSVGEl('g');
    g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
    let bearing = Timepicker._createSVGEl('circle');
    bearing.setAttribute('class', 'timepicker-canvas-bearing');
    bearing.setAttribute('cx', '0');
    bearing.setAttribute('cy', '0');
    bearing.setAttribute('r', '4');
    let hand = Timepicker._createSVGEl('line');
    hand.setAttribute('x1', '0');
    hand.setAttribute('y1', '0');
    let bg = Timepicker._createSVGEl('circle');
    bg.setAttribute('class', 'timepicker-canvas-bg');
    bg.setAttribute('r', tickRadius);
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
    const $tick = document.createElement('div');
    $tick.classList.add('timepicker-tick');
    // Hours view
    if (this.options.twelveHour) {
      for (let i = 1; i < 13; i += 1) {
        const tick = <HTMLElement>$tick.cloneNode(true);
        const radian = (i / 6) * Math.PI;
        const radius = this.options.outerRadius;
        tick.style.left = this.options.dialRadius + Math.sin(radian) * radius - this.options.tickRadius + 'px';
        tick.style.top = this.options.dialRadius - Math.cos(radian) * radius - this.options.tickRadius + 'px';
        tick.innerHTML = i === 0 ? '00' : i.toString();
        this.hoursView.appendChild(tick);
        // tick.on(mousedownEvent, mousedown);
      }
    }
    else {
      for (let i = 0; i < 24; i += 1) {
        const tick = <HTMLElement>$tick.cloneNode(true);
        const radian = (i / 6) * Math.PI;
        const inner = i > 0 && i < 13;
        const radius = inner ? this.options.innerRadius : this.options.outerRadius;
        tick.style.left = this.options.dialRadius + Math.sin(radian) * radius - this.options.tickRadius + 'px';
        tick.style.top = this.options.dialRadius - Math.cos(radian) * radius - this.options.tickRadius + 'px';
        tick.innerHTML = i === 0 ? '00' : i.toString();
        this.hoursView.appendChild(tick);
        // tick.on(mousedownEvent, mousedown);
      }
    }
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

  _handleAmPmClick = (e) => {
    const btnClicked = <HTMLElement>e.target;
    this.amOrPm = btnClicked.classList.contains('am-btn') ? 'AM' : 'PM';
    this._updateAmPmView();
  }

  _updateAmPmView() {
    if (this.options.twelveHour) {
      if (this.amOrPm === 'PM') {
        this._amBtn.classList.remove('text-primary');
        this._pmBtn.classList.add('text-primary');
      }
      else if (this.amOrPm === 'AM') {
        this._amBtn.classList.add('text-primary');
        this._pmBtn.classList.remove('text-primary');
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
      let now = new Date(+new Date() + this.options.fromNow);
      value = [now.getHours().toString(), now.getMinutes().toString()];
      if (this.options.twelveHour) {
        this.amOrPm = parseInt(value[0]) >= 12 && parseInt(value[0]) < 24 ? 'PM' : 'AM';
      }
    }
    this.hours = +value[0] || 0;
    this.minutes = +value[1] || 0;
    this.inputHours.value = this.hours;
    this.inputMinutes.value = Timepicker._addLeadingZero(this.minutes);

    this._updateAmPmView();
  }

  showView = (view, delay: number = null) => {
    if (view === 'minutes' && getComputedStyle(this.hoursView).visibility === 'visible') {
      // raiseCallback(this.options.beforeHourSelect);
    }
    let isHours = view === 'hours',
      nextView = isHours ? this.hoursView : this.minutesView,
      hideView = isHours ? this.minutesView : this.hoursView;
    this.currentView = view;

    if (isHours) {
      this.inputHours.classList.add('text-primary');
      this.inputMinutes.classList.remove('text-primary');
    }
    else {
      this.inputHours.classList.remove('text-primary');
      this.inputMinutes.classList.add('text-primary');
    }

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
  }

  resetClock(delay) {
    let view = this.currentView,
      value = this[view],
      isHours = view === 'hours',
      unit = Math.PI / (isHours ? 6 : 30),
      radian = value * unit,
      radius =
        isHours && value > 0 && value < 13 ? this.options.innerRadius : this.options.outerRadius,
      x = Math.sin(radian) * radius,
      y = -Math.cos(radian) * radius,
      self = this;

    if (delay) {
      this.canvas?.classList.add('timepicker-canvas-out');
      setTimeout(() => {
        self.canvas?.classList.remove('timepicker-canvas-out');
        self.setHand(x, y);
      }, delay);
    }
    else {
      this.setHand(x, y);
    }
  }

  _inputFromTextField = () => {
    const isHours = this.currentView === 'hours';
    if (isHours) {
      const value = parseInt(this.inputHours.value);
      if (value > 0 && value < 13) {
        this.drawClockFromTimeInput(value, isHours);
        this.showView('minutes', this.options.duration / 2);
        this.hours = value;
        this.inputMinutes.focus();
      }
      else {
        const hour = new Date().getHours();
        this.inputHours.value = (hour % 12).toString();
      }
    }
    else {
      const value = parseInt(this.inputMinutes.value);
      if (value >= 0 && value < 60) {
        this.inputMinutes.value = Timepicker._addLeadingZero(value);
        this.drawClockFromTimeInput(value, isHours);
        this.minutes = value;
        (<HTMLElement>this.modalEl.querySelector('.confirmation-btns :nth-child(2)')).focus();
      }
      else {
        const minutes = new Date().getMinutes();
        this.inputMinutes.value = Timepicker._addLeadingZero(minutes);
      }
    }
  }

  drawClockFromTimeInput(value, isHours) {
    const unit = Math.PI / (isHours ? 6 : 30);
    const radian = value * unit;
    let radius;
    if (this.options.twelveHour) {
      radius = this.options.outerRadius;
    }
    let cx1 = Math.sin(radian) * (radius - this.options.tickRadius),
      cy1 = -Math.cos(radian) * (radius - this.options.tickRadius),
      cx2 = Math.sin(radian) * radius,
      cy2 = -Math.cos(radian) * radius;
    this.hand.setAttribute('x2', cx1.toString());
    this.hand.setAttribute('y2', cy1.toString());
    this.bg.setAttribute('cx', cx2.toString());
    this.bg.setAttribute('cy', cy2.toString());
  }

  setHand(x, y, roundBy5: boolean = false) {
    let radian = Math.atan2(x, -y),
      isHours = this.currentView === 'hours',
      unit = Math.PI / (isHours || roundBy5 ? 6 : 30),
      z = Math.sqrt(x * x + y * y),
      inner = isHours && z < (this.options.outerRadius + this.options.innerRadius) / 2,
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
      this.inputHours.value = value.toString();
    }
    else {
      this.inputMinutes.value = Timepicker._addLeadingZero(value);
    }

    // Set clock hand and others' position
    let cx1 = Math.sin(radian) * (radius - this.options.tickRadius),
      cy1 = -Math.cos(radian) * (radius - this.options.tickRadius),
      cx2 = Math.sin(radian) * radius,
      cy2 = -Math.cos(radian) * radius;
    this.hand.setAttribute('x2', cx1.toString());
    this.hand.setAttribute('y2', cy1.toString());
    this.bg.setAttribute('cx', cx2.toString());
    this.bg.setAttribute('cy', cy2.toString());
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this._updateTimeFromInput();
    this.showView('hours');
    this.modal.open(undefined);
  }

  close = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modal.close();
  }

  done = (e = null, clearValue = null) => {
    // Set input value
    let last = this.el.value;
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
      this.el.dispatchEvent(new Event('change'));
    }
    this.close();
    this.el.focus();
  }

  clear = () => {
    this.done(null, true);
  }

  static {
    Timepicker._template = `
      <div class="modal timepicker-modal">
        <div class="modal-content timepicker-container">
          <div class="timepicker-digital-display">
            <div class="timepicker-text-container">
              <div class="timepicker-display-column">
                <input type="text" maxlength="2" autofocus class="timepicker-input-hours text-primary" />
                :
                <input type="text" maxlength="2" class="timepicker-input-minutes" />
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
        </div>
      </div`;
  }
}
