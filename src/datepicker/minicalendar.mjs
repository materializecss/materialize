import { Component } from '../atomic/component.mjs';
import { Temporal } from '@js-temporal/polyfill';

class MiniCalendar extends Component {
  multiple = false;

  /**
   * @param {{ selectedDate?: Temporal.PlainDate }} options
   */
  constructor(options = {}) {
    super(options);
    // Default to today's date if non provided
    this.currentDate = options.selectedDate || Temporal.Now.plainDateISO();
  }

  toHTML() {
    const year = this.currentDate.year;
    const month = this.currentDate.month;

    // First and last dates of the target month
    const firstOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    const lastOfMonth = firstOfMonth.add({ months: 1 }).subtract({ days: 1 });

    // Temporal dayOfWeek: 1 (Mon) to 7 (Sun)
    // Map to 0 (Sun) - 6 (Sat) for standard grid alignment
    const startDayIndex = firstOfMonth.dayOfWeek % 7;

    const daysInMonth = lastOfMonth.day;
    const prevMonthLastDate = firstOfMonth.subtract({ days: 1 });

    const monthName = firstOfMonth.toLocaleString('default', { month: 'long' });

    let daysHTML = '';

    // 1. Fill leading days from the previous month
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthLastDate.day - i;
      daysHTML += `<div class="calendar-day day-padding">${prevDay}</div>`;
    }

    // 2. Fill current month days
    const today = Temporal.Now.plainDateISO();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.year === year && today.month === month && today.day === day;
      const isSelected = this.currentDate.day === day;

      const classes = ['calendar-day', isToday ? 'today' : '', isSelected ? 'selected' : '']
        .filter(Boolean)
        .join(' ');

      daysHTML += `<div class="${classes}" data-day="${day}">${day}</div>`;
    }

    // 3. Fill trailing days to complete a 6-row grid (42 total slots)
    const totalSlots = startDayIndex + daysInMonth;
    const remainingSlots = (42 - totalSlots) % 7; // Or 35/42 depending on strict rows
    for (let day = 1; day <= remainingSlots; day++) {
      daysHTML += `<div class="calendar-day day-padding">${day}</div>`;
    }

    const html = `
      <div class="mini-calendar">
        <header class="calendar-header">
          <button class="prev-month" aria-label="Previous month">&lsaquo;</button>
          <span class="current-month">${monthName} ${year}</span>
          <button class="next-month" aria-label="Next month">&rsaquo;</button>
        </header>
        <div class="calendar-weekdays">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class="calendar-days">
          ${daysHTML}
        </div>
      </div>
    `;

    this.setChildren(html);
    return super.toHTML();
  }
}

export { MiniCalendar };
