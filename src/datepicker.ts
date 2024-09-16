import { Modal } from './modal';
import { Utils } from './utils';
import { FormSelect } from './select';
import { BaseOptions, Component, InitElements, MElement, I18nOptions } from './component';

export interface DateI18nOptions extends I18nOptions {
  previousMonth: string;
  nextMonth: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysAbbrev: string[];
}

export interface DatepickerOptions extends BaseOptions {
  /**
   * Automatically close picker when date is selected.
   * @default false
   */
  autoClose: boolean;
  /**
   * The date output format for the input field value
   * or a function taking the date and outputting the
   * formatted date string.
   * @default 'mmm dd, yyyy'
   */
  format: string | ((d: Date) => string);
  /**
   * Used to create date object from current input string.
   * @default null
   */
  parse: ((value: string, format: string) => Date) | null;
  /**
   * The initial date to view when first opened.
   * @default null
   */
  defaultDate: Date | null;
  /**
   * Make the `defaultDate` the initial selected value.
   * @default false
   */
  setDefaultDate: boolean;
  /**
   * Prevent selection of any date on the weekend.
   * @default false
   */
  disableWeekends: boolean;
  /**
   * Custom function to disable certain days.
   * @default null
   */
  disableDayFn: ((day: Date) => boolean) | null;
  /**
   * First day of week (0: Sunday, 1: Monday etc).
   * @default 0
   */
  firstDay: number;
  /**
   * The earliest date that can be selected.
   * @default null
   */
  minDate: Date | null;
  /**
   * The latest date that can be selected.
   * @default null
   */
  maxDate: Date | null;
  /**
   * Number of years either side, or array of upper/lower range.
   * @default 10
   */
  yearRange: number | number[];
  /**
   * Sort year range in reverse order.
   * @default false
   */
  yearRangeReverse: boolean;
  /**
   * Changes Datepicker to RTL.
   * @default false
   */
  isRTL: boolean;
  /**
   * Show month after year in Datepicker title.
   * @default false
   */
  showMonthAfterYear: boolean;
  /**
   * Render days of the calendar grid that fall in the next
   * or previous month.
   * @default false
   */
  showDaysInNextAndPreviousMonths: boolean;
  /**
   * Specify a DOM element OR selector for a DOM element to render
   * the calendar in, by default it will be placed before the input.
   * @default null
   */
  container: HTMLElement | string | null;
  /**
   * Show the clear button in the datepicker.
   * @default false
   */
  showClearBtn: boolean;
  /**
   * Internationalization options.
   */
  i18n: Partial<DateI18nOptions>;
  /**
   * An array of string returned by `Date.toDateString()`,
   * indicating there are events in the specified days.
   * @default []
   */
  events: string[];
  /**
   * Callback function when date is selected,
   * first parameter is the newly selected date.
   * @default null
   */
  onSelect: ((selectedDate: Date) => void) | null;
  /**
   * Callback function when Datepicker is opened.
   * @default null
   */
  onOpen: (() => void) | null;
  /**
   * Callback function when Datepicker is closed.
   * @default null
   */
  onClose: (() => void) | null;
  /**
   * Callback function when Datepicker HTML is refreshed.
   * @default null
   */
  onDraw: (() => void) | null;

  /** Field used for internal calculations DO NOT CHANGE IT */
  minYear?: any;
  /** Field used for internal calculations DO NOT CHANGE IT */
  maxYear?: any;
  /** Field used for internal calculations DO NOT CHANGE IT */
  minMonth?: any;
  /** Field used for internal calculations DO NOT CHANGE IT */
  maxMonth?: any;
  /** Field used for internal calculations DO NOT CHANGE IT */
  startRange?: any;
  /** Field used for internal calculations DO NOT CHANGE IT */
  endRange?: any;
}

const _defaults: DatepickerOptions = {
  // Close when date is selected
  autoClose: false,
  // the default output format for the input field value
  format: 'mmm dd, yyyy',
  // Used to create date object from current input string
  parse: null,
  // The initial date to view when first opened
  defaultDate: null,
  // Make the `defaultDate` the initial selected value
  setDefaultDate: false,
  disableWeekends: false,
  disableDayFn: null,
  // First day of week (0: Sunday, 1: Monday etc)
  firstDay: 0,
  // The earliest date that can be selected
  minDate: null,
  // Thelatest date that can be selected
  maxDate: null,
  // Number of years either side, or array of upper/lower range
  yearRange: 10,
  // used internally (don't config outside)
  minYear: 0,
  maxYear: 9999,
  minMonth: undefined,
  maxMonth: undefined,
  startRange: null,
  endRange: null,
  isRTL: false,
  yearRangeReverse: false,
  // Render the month after year in the calendar title
  showMonthAfterYear: false,
  // Render days of the calendar grid that fall in the next or previous month
  showDaysInNextAndPreviousMonths: false,
  // Specify a DOM element to render the calendar in
  container: null,
  // Show clear button
  showClearBtn: false,
  // internationalization
  i18n: {
    cancel: 'Cancel',
    clear: 'Clear',
    done: 'Ok',
    previousMonth: '‹',
    nextMonth: '›',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekdaysAbbrev: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  },
  // events array
  events: [],
  // callback function
  onSelect: null,
  onOpen: null,
  onClose: null,
  onDraw: null
};

export class Datepicker extends Component<DatepickerOptions> {
  declare el: HTMLInputElement;
  id: string;
  /** If the picker is open. */
  isOpen: boolean;
  modal: Modal;
  calendarEl: HTMLElement;
  /** CLEAR button instance. */
  clearBtn: HTMLElement;
  /** DONE button instance */
  doneBtn: HTMLElement;
  cancelBtn: HTMLElement;
  modalEl: HTMLElement;
  yearTextEl: HTMLElement;
  dateTextEl: HTMLElement;
  /** The selected Date. */
  date: Date;
  formats: any;
  calendars: any;
  private _y: any;
  private _m: any;
  static _template: string;

  constructor(el: HTMLInputElement, options: Partial<DatepickerOptions>) {
    super(el, options, Datepicker);
    (this.el as any).M_Datepicker = this;

    this.options = {
      ...Datepicker.defaults,
      ...options
    };

    // make sure i18n defaults are not lost when only few i18n option properties are passed
    if (!!options && options.hasOwnProperty('i18n') && typeof options.i18n === 'object') {
      this.options.i18n = { ...Datepicker.defaults.i18n, ...options.i18n };
    }

    // Remove time component from minDate and maxDate options
    if (this.options.minDate) this.options.minDate.setHours(0, 0, 0, 0);
    if (this.options.maxDate) this.options.maxDate.setHours(0, 0, 0, 0);

    this.id = Utils.guid();

    this._setupVariables();
    this._insertHTMLIntoDOM();
    this._setupModal();
    this._setupEventHandlers();

    if (!this.options.defaultDate) {
      this.options.defaultDate = new Date(Date.parse(this.el.value));
    }

    const defDate = this.options.defaultDate;
    if (Datepicker._isDate(defDate)) {
      if (this.options.setDefaultDate) {
        this.setDate(defDate, true);
        this.setInputValue();
      } else {
        this.gotoDate(defDate);
      }
    } else {
      this.gotoDate(new Date());
    }
    this.isOpen = false;
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance of Datepicker.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLInputElement, options?: Partial<DatepickerOptions>): Datepicker;
  /**
   * Initializes instances of Datepicker.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: InitElements<HTMLInputElement | MElement>,
    options?: Partial<DatepickerOptions>
  ): Datepicker[];
  /**
   * Initializes instances of Datepicker.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLInputElement | InitElements<HTMLInputElement | MElement>,
    options: Partial<DatepickerOptions> = {}
  ): Datepicker | Datepicker[] {
    return super.init(els, options, Datepicker);
  }

  static _isDate(obj) {
    return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  }

  static _isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  static _setToStartOfDay(date) {
    if (Datepicker._isDate(date)) date.setHours(0, 0, 0, 0);
  }

  static _getDaysInMonth(year, month) {
    return [31, Datepicker._isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month
    ];
  }

  static _isLeapYear(year) {
    // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static _compareDates(a, b) {
    // weak date comparison (use setToStartOfDay(date) to ensure correct result)
    return a.getTime() === b.getTime();
  }

  static getInstance(el: HTMLElement): Datepicker {
    return (el as any).M_Datepicker;
  }

  destroy() {
    this._removeEventHandlers();
    this.modal.destroy();
    this.modalEl.remove();
    this.destroySelects();
    (this.el as any).M_Datepicker = undefined;
  }

  destroySelects() {
    const oldYearSelect = this.calendarEl.querySelector('.orig-select-year');
    if (oldYearSelect) {
      FormSelect.getInstance(oldYearSelect as HTMLElement).destroy();
    }
    const oldMonthSelect = this.calendarEl.querySelector('.orig-select-month');
    if (oldMonthSelect) {
      FormSelect.getInstance(oldMonthSelect as HTMLElement).destroy();
    }
  }

  _insertHTMLIntoDOM() {
    if (this.options.showClearBtn) {
      this.clearBtn.style.visibility = '';
      this.clearBtn.innerText = this.options.i18n.clear;
    }
    this.doneBtn.innerText = this.options.i18n.done;
    this.cancelBtn.innerText = this.options.i18n.cancel;

    if (this.options.container) {
      const optEl = this.options.container;
      this.options.container =
        optEl instanceof HTMLElement ? optEl : (document.querySelector(optEl) as HTMLElement);
      this.options.container.append(this.modalEl);
    } else {
      //this.modalEl.before(this.el);
      this.el.parentElement.appendChild(this.modalEl);
    }
  }

  _setupModal() {
    this.modalEl.id = 'modal-' + this.id;
    this.modal = Modal.init(this.modalEl, {
      onCloseEnd: () => {
        this.isOpen = false;
      }
    });
  }

  /**
   * Gets a string representation of the selected date.
   */
  toString(format: string | ((d: Date) => string) = null): string {
    format = format || this.options.format;
    if (typeof format === 'function') return format(this.date);
    if (!Datepicker._isDate(this.date)) return '';
    // String Format
    const formatArray = format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
    const formattedDate = formatArray
      .map((label) => (this.formats[label] ? this.formats[label]() : label))
      .join('');
    return formattedDate;
  }

  /**
   * Set a date on the datepicker.
   * @param date Date to set on the datepicker.
   * @param preventOnSelect Undocumented as of 5 March 2018.
   */
  setDate(date: Date | string = null, preventOnSelect: boolean = false) {
    if (!date) {
      this.date = null;
      this._renderDateDisplay();
      return this.draw();
    }
    if (typeof date === 'string') {
      date = new Date(Date.parse(date));
    }
    if (!Datepicker._isDate(date)) {
      return;
    }
    const min = this.options.minDate,
      max = this.options.maxDate;
    if (Datepicker._isDate(min) && date < min) {
      date = min;
    } else if (Datepicker._isDate(max) && date > max) {
      date = max;
    }
    this.date = new Date(date.getTime());
    this._renderDateDisplay();
    Datepicker._setToStartOfDay(this.date);
    this.gotoDate(this.date);
    if (!preventOnSelect && typeof this.options.onSelect === 'function') {
      this.options.onSelect.call(this, this.date);
    }
  }

  /**
   * Sets current date as the input value.
   */
  setInputValue() {
    this.el.value = this.toString();
    this.el.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { firedBy: this }
      })
    );
  }

  _renderDateDisplay() {
    const displayDate = Datepicker._isDate(this.date) ? this.date : new Date();
    const i18n = this.options.i18n;
    const day = i18n.weekdaysShort[displayDate.getDay()];
    const month = i18n.monthsShort[displayDate.getMonth()];
    const date = displayDate.getDate();
    this.yearTextEl.innerHTML = displayDate.getFullYear().toString();
    this.dateTextEl.innerHTML = `${day}, ${month} ${date}`;
  }

  /**
   * Change date view to a specific date on the datepicker.
   * @param date Date to show on the datepicker.
   */
  gotoDate(date: Date) {
    let newCalendar = true;
    if (!Datepicker._isDate(date)) {
      return;
    }
    if (this.calendars) {
      const firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
        lastVisibleDate = new Date(
          this.calendars[this.calendars.length - 1].year,
          this.calendars[this.calendars.length - 1].month,
          1
        ),
        visibleDate = date.getTime();
      // get the end of the month
      lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
      lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
      newCalendar =
        visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate;
    }
    if (newCalendar) {
      this.calendars = [
        {
          month: date.getMonth(),
          year: date.getFullYear()
        }
      ];
    }
    this.adjustCalendars();
  }

  adjustCalendars() {
    this.calendars[0] = this.adjustCalendar(this.calendars[0]);
    this.draw();
  }

  adjustCalendar(calendar) {
    if (calendar.month < 0) {
      calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
      calendar.month += 12;
    }
    if (calendar.month > 11) {
      calendar.year += Math.floor(Math.abs(calendar.month) / 12);
      calendar.month -= 12;
    }
    return calendar;
  }

  nextMonth() {
    this.calendars[0].month++;
    this.adjustCalendars();
  }

  prevMonth() {
    this.calendars[0].month--;
    this.adjustCalendars();
  }

  render(year, month, randId) {
    const opts = this.options;
    const now = new Date();
    const days = Datepicker._getDaysInMonth(year, month);
    let before = new Date(year, month, 1).getDay();
    const data = [];
    let row = [];
    Datepicker._setToStartOfDay(now);
    if (opts.firstDay > 0) {
      before -= opts.firstDay;
      if (before < 0) {
        before += 7;
      }
    }
    const previousMonth = month === 0 ? 11 : month - 1,
      nextMonth = month === 11 ? 0 : month + 1,
      yearOfPreviousMonth = month === 0 ? year - 1 : year,
      yearOfNextMonth = month === 11 ? year + 1 : year,
      daysInPreviousMonth = Datepicker._getDaysInMonth(yearOfPreviousMonth, previousMonth);
    let cells = days + before,
      after = cells;
    while (after > 7) {
      after -= 7;
    }
    cells += 7 - after;
    let isWeekSelected = false;
    for (let i = 0, r = 0; i < cells; i++) {
      const day = new Date(year, month, 1 + (i - before));
      const isSelected = Datepicker._isDate(this.date)
        ? Datepicker._compareDates(day, this.date)
        : false;
      const isToday = Datepicker._compareDates(day, now);
      const hasEvent = opts.events.indexOf(day.toDateString()) !== -1 ? true : false;
      const isEmpty = i < before || i >= days + before;
      let dayNumber = 1 + (i - before);
      let monthNumber = month;
      let yearNumber = year;
      const isStartRange = opts.startRange && Datepicker._compareDates(opts.startRange, day);
      const isEndRange = opts.endRange && Datepicker._compareDates(opts.endRange, day);
      let isDisabled;
      const isInRange =
        opts.startRange &&
        opts.endRange &&
        opts.startRange < day &&
        day <
          opts.endRange(
            (isDisabled =
              (opts.minDate && day < opts.minDate) ||
              (opts.maxDate && day > opts.maxDate) ||
              (opts.disableWeekends && Datepicker._isWeekend(day)) ||
              (opts.disableDayFn && opts.disableDayFn(day)))
          );

      if (isEmpty) {
        if (i < before) {
          dayNumber = daysInPreviousMonth + dayNumber;
          monthNumber = previousMonth;
          yearNumber = yearOfPreviousMonth;
        } else {
          dayNumber = dayNumber - days;
          monthNumber = nextMonth;
          yearNumber = yearOfNextMonth;
        }
      }

      const dayConfig = {
        day: dayNumber,
        month: monthNumber,
        year: yearNumber,
        hasEvent: hasEvent,
        isSelected: isSelected,
        isToday: isToday,
        isDisabled: isDisabled,
        isEmpty: isEmpty,
        isStartRange: isStartRange,
        isEndRange: isEndRange,
        isInRange: isInRange,
        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths
      };

      row.push(this.renderDay(dayConfig));

      if (++r === 7) {
        data.push(this.renderRow(row, opts.isRTL, isWeekSelected));
        row = [];
        r = 0;
        isWeekSelected = false;
      }
    }
    return this.renderTable(opts, data, randId);
  }

  renderDay(opts) {
    const arr = [];
    let ariaSelected = 'false';
    if (opts.isEmpty) {
      if (opts.showDaysInNextAndPreviousMonths) {
        arr.push('is-outside-current-month');
        arr.push('is-selection-disabled');
      } else {
        return '<td class="is-empty"></td>';
      }
    }
    if (opts.isDisabled) {
      arr.push('is-disabled');
    }

    if (opts.isToday) {
      arr.push('is-today');
    }
    if (opts.isSelected) {
      arr.push('is-selected');
      ariaSelected = 'true';
    }
    if (opts.hasEvent) {
      arr.push('has-event');
    }
    if (opts.isInRange) {
      arr.push('is-inrange');
    }
    if (opts.isStartRange) {
      arr.push('is-startrange');
    }
    if (opts.isEndRange) {
      arr.push('is-endrange');
    }
    return (
      `<td data-day="${opts.day}" class="${arr.join(' ')}" aria-selected="${ariaSelected}">` +
      `<button class="datepicker-day-button" type="button" data-year="${opts.year}" data-month="${opts.month}" data-day="${opts.day}">${opts.day}</button>` +
      '</td>'
    );
  }

  renderRow(days, isRTL, isRowSelected) {
    return (
      '<tr class="datepicker-row' +
      (isRowSelected ? ' is-selected' : '') +
      '">' +
      (isRTL ? days.reverse() : days).join('') +
      '</tr>'
    );
  }

  renderTable(opts, data, randId) {
    return (
      '<div class="datepicker-table-wrapper"><table cellpadding="0" cellspacing="0" class="datepicker-table" role="grid" aria-labelledby="' +
      randId +
      '">' +
      this.renderHead(opts) +
      this.renderBody(data) +
      '</table></div>'
    );
  }

  renderHead(opts) {
    let i;
    const arr = [];
    for (i = 0; i < 7; i++) {
      arr.push(
        `<th scope="col"><abbr title="${this.renderDayName(opts, i)}">${this.renderDayName(
          opts,
          i,
          true
        )}</abbr></th>`
      );
    }
    return '<thead><tr>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
  }

  renderBody(rows) {
    return '<tbody>' + rows.join('') + '</tbody>';
  }

  renderTitle(instance, c, year, month, refYear, randId) {
    let i;
    let j;
    let arr;
    const opts = this.options;
    const isMinYear = year === opts.minYear;
    const isMaxYear = year === opts.maxYear;
    let html =
      '<div id="' + randId + '" class="datepicker-controls" role="heading" aria-live="assertive">';
    let prev = true;
    let next = true;

    for (arr = [], i = 0; i < 12; i++) {
      arr.push(
        '<option value="' +
          (year === refYear ? i - c : 12 + i - c) +
          '"' +
          (i === month ? ' selected="selected"' : '') +
          ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth)
            ? 'disabled="disabled"'
            : '') +
          '>' +
          opts.i18n.months[i] +
          '</option>'
      );
    }

    const monthHtml =
      '<select class="datepicker-select orig-select-month" tabindex="-1">' +
      arr.join('') +
      '</select>';

    if (Array.isArray(opts.yearRange)) {
      i = opts.yearRange[0];
      j = opts.yearRange[1] + 1;
    } else {
      i = year - opts.yearRange;
      j = 1 + year + opts.yearRange;
    }

    for (arr = []; i < j && i <= opts.maxYear; i++) {
      if (i >= opts.minYear) {
        arr.push(`<option value="${i}" ${i === year ? 'selected="selected"' : ''}>${i}</option>`);
      }
    }
    if (opts.yearRangeReverse) arr.reverse();

    const yearHtml = `<select class="datepicker-select orig-select-year" tabindex="-1">${arr.join('')}</select>`;

    const leftArrow =
      '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg>';
    html += `<button class="month-prev${
      prev ? '' : ' is-disabled'
    } btn-flat" type="button">${leftArrow}</button>`;

    html += '<div class="selects-container">';
    if (opts.showMonthAfterYear) {
      html += yearHtml + monthHtml;
    } else {
      html += monthHtml + yearHtml;
    }
    html += '</div>';

    if (isMinYear && (month === 0 || opts.minMonth >= month)) {
      prev = false;
    }

    if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
      next = false;
    }

    const rightArrow =
      '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>';
    html += `<button class="month-next${
      next ? '' : ' is-disabled'
    } btn-flat" type="button">${rightArrow}</button>`;

    return (html += '</div>');
  }

  // refresh HTML
  draw(force: boolean = false) {
    if (!this.isOpen && !force) return;
    const opts = this.options;
    const minYear = opts.minYear;
    const maxYear = opts.maxYear;
    const minMonth = opts.minMonth;
    const maxMonth = opts.maxMonth;
    let html = '';

    if (this._y <= minYear) {
      this._y = minYear;
      if (!isNaN(minMonth) && this._m < minMonth) {
        this._m = minMonth;
      }
    }
    if (this._y >= maxYear) {
      this._y = maxYear;
      if (!isNaN(maxMonth) && this._m > maxMonth) {
        this._m = maxMonth;
      }
    }

    const randId =
      'datepicker-title-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 2);

    for (let c = 0; c < 1; c++) {
      this._renderDateDisplay();
      html +=
        this.renderTitle(
          this,
          c,
          this.calendars[c].year,
          this.calendars[c].month,
          this.calendars[0].year,
          randId
        ) + this.render(this.calendars[c].year, this.calendars[c].month, randId);
    }

    this.destroySelects();

    this.calendarEl.innerHTML = html;

    // Init Materialize Select
    const yearSelect = this.calendarEl.querySelector('.orig-select-year') as HTMLSelectElement;
    const monthSelect = this.calendarEl.querySelector('.orig-select-month') as HTMLSelectElement;
    FormSelect.init(yearSelect, {
      classes: 'select-year',
      dropdownOptions: { container: document.body, constrainWidth: false }
    });
    FormSelect.init(monthSelect, {
      classes: 'select-month',
      dropdownOptions: { container: document.body, constrainWidth: false }
    });

    // Add change handlers for select
    yearSelect.addEventListener('change', this._handleYearChange);
    monthSelect.addEventListener('change', this._handleMonthChange);

    if (typeof this.options.onDraw === 'function') {
      this.options.onDraw.call(this);
    }
  }

  _setupEventHandlers() {
    this.el.addEventListener('click', this._handleInputClick);
    this.el.addEventListener('keydown', this._handleInputKeydown);
    this.el.addEventListener('change', this._handleInputChange);
    this.calendarEl.addEventListener('click', this._handleCalendarClick);
    this.doneBtn.addEventListener('click', this._finishSelection);
    this.cancelBtn.addEventListener('click', this.close);

    if (this.options.showClearBtn) {
      this.clearBtn.addEventListener('click', this._handleClearClick);
    }
  }

  _setupVariables() {
    const template = document.createElement('template');
    template.innerHTML = Datepicker._template.trim();
    this.modalEl = <HTMLElement>template.content.firstChild;

    this.calendarEl = this.modalEl.querySelector('.datepicker-calendar');
    this.yearTextEl = this.modalEl.querySelector('.year-text');
    this.dateTextEl = this.modalEl.querySelector('.date-text');
    if (this.options.showClearBtn) {
      this.clearBtn = this.modalEl.querySelector('.datepicker-clear');
    }
    this.doneBtn = this.modalEl.querySelector('.datepicker-done');
    this.cancelBtn = this.modalEl.querySelector('.datepicker-cancel');

    this.formats = {
      d: () => {
        return this.date.getDate();
      },
      dd: () => {
        const d = this.date.getDate();
        return (d < 10 ? '0' : '') + d;
      },
      ddd: () => {
        return this.options.i18n.weekdaysShort[this.date.getDay()];
      },
      dddd: () => {
        return this.options.i18n.weekdays[this.date.getDay()];
      },
      m: () => {
        return this.date.getMonth() + 1;
      },
      mm: () => {
        const m = this.date.getMonth() + 1;
        return (m < 10 ? '0' : '') + m;
      },
      mmm: () => {
        return this.options.i18n.monthsShort[this.date.getMonth()];
      },
      mmmm: () => {
        return this.options.i18n.months[this.date.getMonth()];
      },
      yy: () => {
        return ('' + this.date.getFullYear()).slice(2);
      },
      yyyy: () => {
        return this.date.getFullYear();
      }
    };
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleInputClick);
    this.el.removeEventListener('keydown', this._handleInputKeydown);
    this.el.removeEventListener('change', this._handleInputChange);
    this.calendarEl.removeEventListener('click', this._handleCalendarClick);
  }

  _handleInputClick = () => {
    this.open();
  };

  _handleInputKeydown = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      e.preventDefault();
      this.open();
    }
  };

  _handleCalendarClick = (e) => {
    if (!this.isOpen) return;
    const target = <HTMLElement>e.target;
    if (!target.classList.contains('is-disabled')) {
      if (
        target.classList.contains('datepicker-day-button') &&
        !target.classList.contains('is-empty') &&
        !target.parentElement.classList.contains('is-disabled')
      ) {
        this.setDate(
          new Date(
            e.target.getAttribute('data-year'),
            e.target.getAttribute('data-month'),
            e.target.getAttribute('data-day')
          )
        );
        if (this.options.autoClose) {
          this._finishSelection();
        }
      } else if (target.closest('.month-prev')) {
        this.prevMonth();
      } else if (target.closest('.month-next')) {
        this.nextMonth();
      }
    }
  };

  _handleClearClick = () => {
    this.date = null;
    this.setInputValue();
    this.close();
  };

  _handleMonthChange = (e) => {
    this.gotoMonth(e.target.value);
  };

  _handleYearChange = (e) => {
    this.gotoYear(e.target.value);
  };

  // change view to a specific month (zero-index, e.g. 0: January)
  gotoMonth(month) {
    if (!isNaN(month)) {
      this.calendars[0].month = parseInt(month, 10);
      this.adjustCalendars();
    }
  }

  // change view to a specific full year (e.g. "2012")
  gotoYear(year) {
    if (!isNaN(year)) {
      this.calendars[0].year = parseInt(year, 10);
      this.adjustCalendars();
    }
  }

  _handleInputChange = (e: Event) => {
    let date;
    // Prevent change event from being fired when triggered by the plugin
    if (e['detail']?.firedBy === this) return;
    if (this.options.parse) {
      date = this.options.parse(
        this.el.value,
        typeof this.options.format === 'function'
          ? this.options.format(new Date(this.el.value))
          : this.options.format
      );
    } else {
      date = new Date(Date.parse(this.el.value));
    }
    if (Datepicker._isDate(date)) this.setDate(date);
  };

  renderDayName(opts, day, abbr: boolean = false) {
    day += opts.firstDay;
    while (day >= 7) {
      day -= 7;
    }
    return abbr ? opts.i18n.weekdaysAbbrev[day] : opts.i18n.weekdays[day];
  }

  // Set input value to the selected date and close Datepicker
  _finishSelection = () => {
    this.setInputValue();
    this.close();
  };

  /**
   * Open datepicker.
   */
  open = () => {
    if (this.isOpen) return;
    this.isOpen = true;
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen.call(this);
    }
    this.draw();
    this.modal.open(undefined);
    return this;
  };

  /**
   * Close datepicker.
   */
  close = () => {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (typeof this.options.onClose === 'function') {
      this.options.onClose.call(this);
    }
    this.modal.close();
    return this;
  };

  static {
    Datepicker._template = `
      <div class="modal datepicker-modal">
        <div class="modal-content datepicker-container">
          <div class="datepicker-date-display">
            <span class="year-text"></span>
            <span class="date-text"></span>
          </div>
          <div class="datepicker-calendar-container">
            <div class="datepicker-calendar"></div>
            <div class="datepicker-footer">
              <button class="btn-flat datepicker-clear waves-effect" style="visibility: hidden;" type="button"></button>
              <div class="confirmation-btns">
                <button class="btn-flat datepicker-cancel waves-effect" type="button"></button>
                <button class="btn-flat datepicker-done waves-effect" type="button"></button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}
