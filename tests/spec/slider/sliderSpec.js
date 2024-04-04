describe('Slider Plugin', () => {
  beforeEach(async () => {
    await XloadFixtures(['slider/sliderFixture.html']);
  });
  afterEach(() => {
    XunloadFixtures();
  });

  describe('Slider', () => {
    let slider;

    beforeEach(() => {
      slider = M.Slider.init(document.querySelector('.slider'), {
        interval: 1000,
        pauseOnFocus: true,
        indicatorLabelFunc: (idx) => 'Slide ' + idx
      });
    });

    afterEach(() => {
      if (slider) slider.destroy();
      slider = null;
    });

    it('Slider should change after 1 second', (done) => {
      const O_INDEX = slider.activeIndex;
      setTimeout(() => {
        setTimeout(() => {
          expect(slider.activeIndex).not.toBe(O_INDEX);
          done();
        }, 1500);
      }, 1);
    });

    it('Slider should not change if paused', (done) => {
      const O_INDEX = slider.activeIndex;
      slider.pause();
      setTimeout(() => {
        setTimeout(() => {
          expect(slider.activeIndex).toBe(O_INDEX);
          done();
        }, 2000);
      }, 1);
    });

    it('Slider should not change if focused', (done) => {
      const O_INDEX = slider.activeIndex;
      slider.start();
      slider.el.querySelector('li').focus();

      setTimeout(() => {
        setTimeout(() => {
          expect(slider.eventPause).toBe(true);
          expect(slider.activeIndex).toBe(O_INDEX);
          done();
        }, 2000);
      }, 1);
    });

    it("Label of indicators must start with 'Slide '", () => {
      expect(
        Array.from(document.querySelectorAll('button')).map((btn) =>
          btn.getAttribute('aria-label').startsWith('Slide ')
        )
      ).toEqual([true, true, true, true]);
    });

    it('Slider should change current index and focus its respective item on indicator click', () => {
      const IDX = 2;
      document.querySelectorAll('button')[IDX].click();

      expect(slider.activeIndex).toBe(IDX);
      //expect(document.activeElement).toBe(document.querySelectorAll(".slides > li")[IDX]);
    });
  });
});
