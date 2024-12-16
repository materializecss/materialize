import { Modal } from './modal';
import { Utils } from './utils';
import { FormSelect } from './select';
import { BaseOptions, Component, I18nOptions, InitElements, MElement } from './component';

export interface DateI18nOptions extends I18nOptions {
  previousMonth: string;
  nextMonth: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysAbbrev: string[];
};

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
   * The initial condition if the datepicker is based on date range.
   * @default false
   */
  isDateRange: boolean;
  /**
   * The initial date to view when first opened.
   * @default null
   */
  defaultDate: Date | null;
  /**
   * The initial end date to view when first opened.
   * @default null
   */
  defaultEndDate: Date | null;
  /**
   * Make the `defaultDate` the initial selected value.
   * @default false
   */
  setDefaultDate: boolean;
  /**
   * Make the `defaultEndDate` the initial selected value.
   * @default false
   */
  setDefaultEndDate: boolean;
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

let _defaults: DatepickerOptions = {
  // Close when date is selected
  autoClose: false,
  // the default output format for the input field value
  format: 'mmm dd, yyyy',
  // Used to create date object from current input string
  parse: null,
  // The initial condition if the datepicker is based on date range
  isDateRange: false,
  // The initial date to view when first opened
  defaultDate: null,
  // The initial end date to view when first opened
  defaultEndDate: null,
  // Make the `defaultDate` the initial selected value
  setDefaultDate: false,
  // Make the `defaultEndDate` the initial selected value
  setDefaultEndDate: false,
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
  declare el: HTMLInputElement
  id: string;
  /** If the picker is open. */
  isOpen: boolean;
  multiple: boolean = false;
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
  endDateEl: HTMLInputElement;
  /** The selected Date. */
  date: Date;
  endDate: null|Date;
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
      this.options.i18n = {...Datepicker.defaults.i18n, ...options.i18n};
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

    let defDate = this.options.defaultDate;
    if (Datepicker._isDate(defDate)) {
      if (this.options.setDefaultDate) {
        this.setDate(defDate, true);
        this.setInputValue(this.el, defDate);
      }
      else {
        this.gotoDate(defDate);
      }
    }
    else {
      this.gotoDate(new Date());
    }
    if (this.options.isDateRange) {
      this.multiple = true;
      let defEndDate = this.options.defaultEndDate;
      if(Datepicker._isDate(defEndDate))
      {
        if (this.options.setDefaultEndDate) {
          this.setDate(defEndDate, true, true);
          this.setInputValue(this.endDateEl, defEndDate);
        }
      }
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
  static init(els: InitElements<HTMLInputElement | MElement>, options?: Partial<DatepickerOptions>): Datepicker[];
  /**
   * Initializes instances of Datepicker.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLInputElement | InitElements<HTMLInputElement | MElement>, options: Partial<DatepickerOptions> = {}): Datepicker | Datepicker[] {
    return super.init(els, options, Datepicker);
  }

  static _isDate(obj) {
    return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  }

  static _isWeekend(date) {
    let day = date.getDay();
    return day === 0 || day === 6;
  }

  /**
   * @deprecated since it does nothing as it's only updating the encapsulated variable (no return/global param change)
   */
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

  static _compareWithinRange(day: Date, date: Date, dateEnd: Date) {
    return day.getTime() > date.getTime() && day.getTime() < dateEnd.getTime();
  }

  static _comparePastDate(a: Date, b: Date) {
    return a.getTime() < b.getTime()
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
    let oldYearSelect = this.calendarEl.querySelector('.orig-select-year');
    if (oldYearSelect) {
      FormSelect.getInstance(oldYearSelect as HTMLElement).destroy();
    }
    let oldMonthSelect = this.calendarEl.querySelector('.orig-select-month');
    if (oldMonthSelect) {
      FormSelect.getInstance(oldMonthSelect as HTMLElement).destroy();
    }
  }

  _insertHTMLIntoDOM() {
    // HTML5 input date field support
    if(this.el.type == 'date') {
      this.el.classList.add('datepicker-date-input');
    }

    if (this.options.isDateRange) {
      this.endDateEl = <HTMLInputElement>this.el.cloneNode(true);
      this.endDateEl.classList.add('datepicker-end-date');
      this.endDateEl.addEventListener('click', this._handleInputClick);
      this.endDateEl.addEventListener('keypress', this._handleInputKeydown);
      this.endDateEl.addEventListener('change', this._handleInputChange);
      this.el.parentElement.appendChild(this.endDateEl);
    }

    if (this.options.showClearBtn) {
      this.clearBtn.style.visibility = '';
      this.clearBtn.innerText = this.options.i18n.clear;
    }
    this.doneBtn.innerText = this.options.i18n.done;
    this.cancelBtn.innerText = this.options.i18n.cancel;

    if (this.options.container) {
      const optEl = this.options.container;
      this.options.container =
        optEl instanceof HTMLElement ? optEl : document.querySelector(optEl) as HTMLElement;
      this.options.container.append(this.modalEl);
    }
    else {
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
   * Gets a string representation of the given date.
   */
  toString(date: Date = this.date, format: string | ((d: Date) => string) = null): string {
    format = format || this.options.format;
    if (typeof format === 'function') return format(date);
    if (!Datepicker._isDate(date)) return '';
    // String Format
    return this.formatDate(date, format);
  }

  /**
   * Returns the formatted date.
   */
  formatDate(date: Date, format: string) {
    const formatArray = format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
    return formatArray
      .map(label => this.formats[label] ? this.formats[label](date) : label)
      .join('');
  }

  /**
   * Sets date from input field.
   */
  setDateFromInput(el: HTMLInputElement) {
    const date = new Date(Date.parse(el.value));
    this.setDate(date, false, el == this.endDateEl);
  }

  /**
   * Set a date on the datepicker.
   * @param date Date to set on the datepicker.
   * @param preventOnSelect Undocumented as of 5 March 2018.
   * @param isEndDate
   */
  setDate(date: Date = null, preventOnSelect: boolean = false, isEndDate: boolean = false) {
    let selectedDate;
    if (!date) {
      selectedDate = null;
      this._renderDateDisplay(date);
      return this.draw();
    }
    if (typeof date === 'string') {
      date = new Date(Date.parse(date));
    }
    if (!Datepicker._isDate(date)) {
      return;
    }
    let min = this.options.minDate,
      max = this.options.maxDate;
    if (Datepicker._isDate(min) && date < min) {
      date = min;
    }
    else if (Datepicker._isDate(max) && date > max) {
      date = max;
    }
    selectedDate = new Date(date.getTime());
    if(!isEndDate) {
      this.date = selectedDate;
    } else if(isEndDate) {
      this.endDate = selectedDate;
    }
    Datepicker._setToStartOfDay(selectedDate);
    this.gotoDate(!isEndDate ? this.date : this.endDate);
    if (!preventOnSelect && typeof this.options.onSelect === 'function') {
      this.options.onSelect.call(this, selectedDate);
    }
  }

  /**
   * Sets the data-date attribute on the date input field
   */
  setDataDate(el, date) {
    el.setAttribute('data-date', this.toString(date))
  }

  /**
   * Sets dates on the input values.
   */
  setInputValues() {
    this.setInputValue(this.el, this.date);
    if (this.options.isDateRange) {
      this.setInputValue(this.endDateEl, this.endDate);
    }
  }

  /**
   * Sets given date as the input value on the given element.
   */
  setInputValue(el, date) {
    if(el.type == 'date') {
      this.setDataDate(el, date);
      el.value = this.formatDate(date, 'yyyy-mm-dd');
    } else {
      el.value = this.toString(date);
    }
    this.el.dispatchEvent(new CustomEvent('change', {bubbles:true, cancelable:true, composed:true, detail: {firedBy: this}}));
  }

  /**
   * Renders the date in the modal head section.
   */
  _renderDateDisplay(date: Date, endDate: Date = null) {
    const displayDate = Datepicker._isDate(date) ? date : new Date();
    // this.yearTextEl.innerHTML = displayDate.getFullYear().toString();
    // @todo should we include an option for date formatting by component options?
    if (!this.options.isDateRange) {
      this.dateTextEl.innerHTML = this.formatDate(displayDate, 'ddd, mmm d');
    } else {
      const displayEndDate = Datepicker._isDate(endDate) ? endDate : new Date();
      this.dateTextEl.innerHTML = `${this.formatDate(displayDate, 'mmm d')} - ${this.formatDate(displayEndDate, 'mmm d')}`;
    }
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
      let firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
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
    let opts = this.options,
      now = new Date(),
      days = Datepicker._getDaysInMonth(year, month),
      before = new Date(year, month, 1).getDay(),
      data = [],
      row = [];
    Datepicker._setToStartOfDay(now);
    if (opts.firstDay > 0) {
      before -= opts.firstDay;
      if (before < 0) {
        before += 7;
      }
    }
    let previousMonth = month === 0 ? 11 : month - 1,
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
      let day = new Date(year, month, 1 + (i - before)),
        isToday = Datepicker._compareDates(day, now),
        hasEvent = opts.events.indexOf(day.toDateString()) !== -1,
        isEmpty = i < before || i >= days + before,
        dayNumber = 1 + (i - before),
        monthNumber = month,
        yearNumber = year,
        isStartRange = opts.startRange && Datepicker._compareDates(opts.startRange, day),
        isEndRange = opts.endRange && Datepicker._compareDates(opts.endRange, day),
        isInRange =
          opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
        isDisabled =
          (opts.minDate && day < opts.minDate) ||
          (opts.maxDate && day > opts.maxDate) ||
          (opts.disableWeekends && Datepicker._isWeekend(day)) ||
          (opts.disableDayFn && opts.disableDayFn(day)),
        isDateRange = opts.isDateRange && Datepicker._isDate(this.endDate) && Datepicker._compareWithinRange(day, this.date, this.endDate);

      let isSelected = false;
      if (Datepicker._isDate(this.date)) {
        isSelected = Datepicker._compareDates(day, this.date);
      }

      if (!isSelected && Datepicker._isDate(this.endDate)) {
        isSelected = Datepicker._compareDates(day, this.endDate);
      }

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

      let dayConfig = {
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
        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
        isDateRange: isDateRange,
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
    let arr = [];
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
    if (opts.isDateRange) {
      arr.push('is-daterange');
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
    let i,
      arr = [];
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
    let i,
      j,
      arr,
      opts = this.options,
      isMinYear = year === opts.minYear,
      isMaxYear = year === opts.maxYear,
      html =
        '<div id="' +
        randId +
        '" class="datepicker-controls" role="heading" aria-live="assertive">',
      monthHtml,
      yearHtml,
      prev = true,
      next = true;

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

    monthHtml = '<select class="datepicker-select orig-select-month" tabindex="-1">'+arr.join('')+'</select>';

    if (Array.isArray(opts.yearRange)) {
      i = opts.yearRange[0];
      j = opts.yearRange[1] + 1;
    }
    else {
      i = year - opts.yearRange;
      j = 1 + year + opts.yearRange;
    }

    for (arr = []; i < j && i <= opts.maxYear; i++) {
      if (i >= opts.minYear) {
        arr.push(`<option value="${i}" ${i === year ? 'selected="selected"' : ''}>${i}</option>`);
      }
    }
    if (opts.yearRangeReverse) arr.reverse();

    yearHtml = `<select class="datepicker-select orig-select-year" tabindex="-1">${arr.join('')}</select>`;

    let leftArrow =
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

    let rightArrow =
      '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>';
    html += `<button class="month-next${
      next ? '' : ' is-disabled'
    } btn-flat" type="button">${rightArrow}</button>`;

    return (html += '</div>');
  }

  // refresh HTML
  draw(force: boolean = false) {
    if (!this.isOpen && !force) return;
    let opts = this.options,
      minYear = opts.minYear,
      maxYear = opts.maxYear,
      minMonth = opts.minMonth,
      maxMonth = opts.maxMonth,
      html = '',
      randId;

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

    randId =
      'datepicker-title-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 2);

    for (let c = 0; c < 1; c++) {
      if(!this.options.isDateRange) {
        this._renderDateDisplay(this.date);
      } else {
        this._renderDateDisplay(this.date, this.endDate);
      }
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
    let yearSelect = this.calendarEl.querySelector('.orig-select-year') as HTMLSelectElement;
    let monthSelect = this.calendarEl.querySelector('.orig-select-month') as HTMLSelectElement;
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
      d: (date: Date) => {
        return date.getDate();
      },
      dd: (date: Date) => {
        let d = date.getDate();
        return (d < 10 ? '0' : '') + d;
      },
      ddd: (date: Date) => {
        return this.options.i18n.weekdaysShort[date.getDay()];
      },
      dddd: (date: Date) => {
        return this.options.i18n.weekdays[date.getDay()];
      },
      m: (date: Date) => {
        return date.getMonth() + 1;
      },
      mm: (date: Date) => {
        let m = date.getMonth() + 1;
        return (m < 10 ? '0' : '') + m;
      },
      mmm: (date: Date) => {
        return this.options.i18n.monthsShort[date.getMonth()];
      },
      mmmm: (date: Date) => {
        return this.options.i18n.months[date.getMonth()];
      },
      yy: (date: Date) => {
        return ('' + date.getFullYear()).slice(2);
      },
      yyyy: (date: Date) => {
        return date.getFullYear();
      }
    };
  }

  _removeEventHandlers() {
    this.el.removeEventListener('click', this._handleInputClick);
    this.el.removeEventListener('keydown', this._handleInputKeydown);
    this.el.removeEventListener('change', this._handleInputChange);
    this.calendarEl.removeEventListener('click', this._handleCalendarClick);
    if (this.options.isDateRange) {
      this.endDateEl.removeEventListener('click', this._handleInputClick);
      this.endDateEl.removeEventListener('keypress', this._handleInputKeydown);
      this.endDateEl.removeEventListener('change', this._handleInputChange);
    }
  }

  _handleInputClick = (e) => {
    // Prevents default browser datepicker modal rendering
    if(e.type == 'date') {
      e.preventDefault()
    }
    this.setDateFromInput(e.target as HTMLInputElement);
    this.open();
    this.gotoDate(<HTMLElement>(e.target) === this.el ? this.date : this.endDate);
  }

  _handleInputKeydown = (e: KeyboardEvent) => {
    if (Utils.keys.ENTER.includes(e.key)) {
      e.preventDefault();
      this.setDateFromInput(e.target as HTMLInputElement);
      this.open();
    }
  }

  _handleCalendarClick = (e) => {
    if (!this.isOpen) return;
    const target = <HTMLElement>(e.target);
    if (!target.classList.contains('is-disabled')) {
      if (
        target.classList.contains('datepicker-day-button') &&
        !target.classList.contains('is-empty') &&
        !target.parentElement.classList.contains('is-disabled')
      ) {
        const selectedDate = new Date(
          e.target.getAttribute('data-year'),
          e.target.getAttribute('data-month'),
          e.target.getAttribute('data-day')
        );

        if (!this.multiple) {
          this._handleSingleDateCalendarClick(selectedDate);
        }

        if (this.options.isDateRange) {
          this._handleDateRangeCalendarClick(selectedDate);
        }

        if (this.options.autoClose) {
          this._finishSelection();
        }
      }
      else if (target.closest('.month-prev')) {
        this.prevMonth();
      }
      else if (target.closest('.month-next')) {
        this.nextMonth();
      }
    }
  }

  _handleSingleDateCalendarClick = (date: Date) => {
    this.setDate(date);
  }

  _handleDateRangeCalendarClick = (date: Date) => {
    if (this.endDate == null || !Datepicker._compareDates(date,  this.endDate)) {
      if (Datepicker._isDate(this.date) && Datepicker._comparePastDate(date, this.date)) {
        return;
      }

      this.setDate(date, false, Datepicker._isDate(this.date));
      return;
    }

    this._clearDates();
    this.draw();
  }

  _handleClearClick = () => {
    this._clearDates();
    this.setInputValues();
    this.close();
  }

  _clearDates = () => {
    this.date = null;
    this.endDate = null;
  }

  _handleMonthChange = (e) => {
    this.gotoMonth(e.target.value);
  }

  _handleYearChange = (e) => {
    this.gotoYear(e.target.value);
  }

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
    const el = (e.target as HTMLElement);
    // Prevent change event from being fired when triggered by the plugin
    if (e['detail']?.firedBy === this) return;
    // Prevent change event from being fired if an end date is set without a start date
    if(el == this.endDateEl && !this.date) return;
    if (this.options.parse) {
      date = this.options.parse((e.target as HTMLInputElement).value,
        typeof this.options.format === "function"
          ? this.options.format(new Date(this.el.value))
          : this.options.format);
    }
    else {
      date = new Date(Date.parse((e.target as HTMLInputElement).value));
    }
    if (Datepicker._isDate(date)) {
      this.setDate(date, false, el == this.endDateEl);
      if (e.type == 'date') {
        this.setDataDate(e, date);
        this.setInputValues();
      }
    }
  }

  renderDayName(opts, day, abbr: boolean = false) {
    day += opts.firstDay;
    while (day >= 7) {
      day -= 7;
    }
    return abbr ? opts.i18n.weekdaysAbbrev[day] : opts.i18n.weekdays[day];
  }

  // Set input value to the selected date and close Datepicker
  _finishSelection = () => {
    this.setInputValues();
    this.close();
  }

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
  }

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
  }

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
