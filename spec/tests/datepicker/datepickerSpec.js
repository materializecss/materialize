/* eslint-disable no-undef */

describe('Datepicker Plugin', () => {
  const fixture = `<div class="row">
  <div class="input-field col s12">
    <input type="text" class="datepicker" id="datepickerInput">
  </div>
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Datepicker', () => {
    afterEach(() => {
      M.Datepicker.getInstance(document.querySelector('.datepicker')).destroy();
    });

    it('should open and close programmatically', (done) => {
      M.Datepicker.init(document.querySelectorAll('.datepicker'));
      const input = document.querySelector('#datepickerInput');
      const modal = document.querySelector('.datepicker-modal');
      expect(modal).toBeHidden('Should be hidden before datepicker input is focused.');
      M.Datepicker.getInstance(input).open();

      setTimeout(() => {
        expect(modal).toHaveClass(
          'open',
          'Datepicker modal should be shown after datepicker input is focused.'
        );
        M.Datepicker.getInstance(input).close();
        setTimeout(() => {
          expect(modal).toNotHaveClass(
            'open',
            'Datepicker modal should be hidden after datepicker input is focused.'
          );
          done();
        }, 400);
      }, 400);
    });

    it('can have a string format', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' });
      const datepicker = M.Datepicker.getInstance(input);
      datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear();
          const month = today.getMonth() + 1;
          const value = datepicker.toString();
          expect(value).toEqual(`${month < 10 ? `0${month}` : month}/01/${year}`);
          done();
        }, 400);
      }, 400);
    });

    it('can have a format function', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      const formatFn = `${today.getFullYear() - 100}-${today.getMonth() + 1}-99`;
      M.Datepicker.init(input, { format: formatFn });
      const datepicker = M.Datepicker.getInstance(input);
      datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear() - 100;
          const month = today.getMonth() + 1;
          expect(datepicker.toString()).toEqual(`${year}-${month < 10 ? `0${month}` : month}-99`);
          done();
        }, 400);
      }, 400);
    });

    it('can change the calendar modal selected date by input', (done) => {
      const input = document.querySelector('#datepickerInput');
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' });
      const today = new Date();
      let month = today.getMonth();
      const year = today.getFullYear() - 44;
      const day = 11;
      input.value = `${month < 10 ? `0${month}` : month}/${day}/${year}`;
      input.dispatchEvent(
        new KeyboardEvent('change', { bubbles: true, cancelable: true })
      );
      keydown(input, 13);
      setTimeout(() => {
        expect(document.querySelector('.datepicker-modal')).toHaveClass(
          'open',
          'modal should be shown after input is submitted.'
        );
        const selectMonthElem = document.querySelector('.datepicker-select.orig-select-month');
        const selectYearElem = document.querySelector('.datepicker-select.orig-select-year');
        const selectedDayElem = document.querySelector(`.datepicker-row td[data-day="${day}"]`);
        expect(selectMonthElem.querySelector('option[selected="selected"]').value === (month - 1).toString()).toEqual(true, `selected month should be ${month}, given value ${selectMonthElem.querySelector('option[selected="selected"]').value}`);
        expect(selectYearElem.querySelector('option[selected="selected"]').value === year.toString()).toEqual(true, `selected year should be ${year}, given value ${selectYearElem.querySelector('option[selected="selected"]').value}`);
        expect(selectedDayElem.classList.contains('is-selected')).toEqual(true, `selected day should be ${day}, given value ${selectedDayElem.classList}`);
        done();
      }, 10);
    });

    it('should have a date range input field if date range option is enabled', (done) => {
      const input = document.querySelector('#datepickerInput');
      M.Datepicker.init(input, { isDateRange: true });
      setTimeout(() => {
        expect(document.querySelector('.datepicker-end-date')).toExist('end date input should exist');
        done();
      }, 10);
    });
  });
});
