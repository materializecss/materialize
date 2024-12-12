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
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' }).open();
      const datepicker = M.Datepicker.getInstance(input);
      datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear();
          let month = today.getMonth() + 1;
          month = month < 10 ? `0${month}` : month;
          const value = datepicker.toString();
          expect(value).toEqual(`${month}/01/${year}`);
          done();
        }, 400);
      }, 400);
    });

    it('can have a format function', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      const formatFn = `${today.getFullYear() - 100}-${today.getMonth() + 1}-99`;
      M.Datepicker.init(input, { format: formatFn }).open();
      const datepicker = M.Datepicker.getInstance(input);
      datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear() - 100;
          const month = today.getMonth() + 1;
          expect(datepicker.toString()).toEqual(`${year}-${month}-99`);
          done();
        }, 400);
      }, 400);
    });
  });
});
