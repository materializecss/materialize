/* eslint-disable no-undef */

describe('Slider Plugin:', () => {
  const fixture = `<div class="slider simple-slider">
  <ul class="slides">
    <li>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="First slide">
      <div class="caption center-align">
          <h3>This is our big Tagline!</h3>
          <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
      </div>
    </li>
    <li>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Second slide">
      <div class="caption left-align">
          <h3>Left Aligned Caption</h3>
          <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
      </div>
    </li>
    <li>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Third slide">
      <div class="caption right-align">
          <h3>Right Aligned Caption</h3>
          <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
      </div>
    </li>
    <li>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Fourth slide">
      <div class="caption center-align">
          <h3>This is our big Tagline!</h3>
          <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
       </div>
    </li>
  </ul>
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Slider:', () => {
    let slider;

    beforeEach(() => {
      slider = M.Slider.init(document.querySelector('.slider'), {
        interval: 100,
        duration: 0, // transition
        pauseOnFocus: true,
        indicatorLabelFunc: (idx) => 'Slide ' + idx
      });
    });

    afterEach(() => {
      if (slider) slider.destroy();
      slider = null;
    });

    it('should change after first interval', (done) => {
      const O_INDEX = slider.activeIndex;
      setTimeout(() => {
        expect(slider.activeIndex).not.toBe(O_INDEX);
        done();
      }, 150);
    });

    it('should not change if paused', (done) => {
      const O_INDEX = slider.activeIndex;
      slider.pause();
      setTimeout(() => {
        expect(slider.activeIndex).toBe(O_INDEX);
        done();
      }, 200);
    });

    it('should not change if focused', (done) => {
      const O_INDEX = slider.activeIndex;
      slider.start();
      slider.el.dispatchEvent(new Event('focusin'));
      //focus(slider.el);
      setTimeout(() => {
        expect(slider.eventPause).toBe(true);
        expect(slider.activeIndex).toBe(O_INDEX);
        done();
      }, 150);
    });

    it("start with 'Slide ' in indicators labels ", () => {
      expect(
        Array.from(document.querySelectorAll('button')).map((btn) =>
          btn.getAttribute('aria-label').startsWith('Slide ')
        )
      ).toEqual([true, true, true, true]);
    });

    it('should change index and focus its respective item on indicator click', () => {
      const IDX = 2;
      document.querySelectorAll('button')[IDX].click();
      expect(slider.activeIndex).toBe(IDX);
      //expect(document.activeElement).toBe(document.querySelectorAll(".slides > li")[IDX]);
    });
  });
});
