/* eslint-disable no-undef */

describe('Carousel', () => {
  const fixture = `<div class="carousel carousel-slider" id="slider-no-wrap">
  <div class="carousel-item">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
  </div>
  <div class="carousel-item">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
  </div>
  <div class="carousel-item">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
  </div>
  <div class="carousel-item">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
  </div>
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('carousel plugin', () => {
    it('No wrap next and prev should not overflow', (done) => {
      const noWrap = M.Carousel.init(document.querySelector('#slider-no-wrap'), {
        duration: 10,
        noWrap: true
      });
      noWrap.prev();
      expect(noWrap.center).toEqual(0, 'Prev should do nothing');

      noWrap.set(3);
      setTimeout(() => {
        expect(noWrap.center).toEqual(3);

        noWrap.next();
        setTimeout(() => {
          expect(noWrap.center).toEqual(3, 'Next should do nothing');
          done();
        }, 30);
      }, 50);
    });
  });
});
