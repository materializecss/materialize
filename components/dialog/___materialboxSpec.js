describe('Materialbox:', () => {
  const fixture = `<div id="transformTest" style="transform: translate3d(1px,1px,1px)">
  <img
    class="materialboxed"
    width="650"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Materialbox opens correctly with transformed ancestor', () => {
    it('Opens a correctly placed overlay when clicked', (done) => {
      const transformMaterialbox = document.querySelector('#transformTest');
      M.Materialbox.init(document.querySelector('.materialboxed'), {
        inDuration: 0,
        outDuration: 0
      });
      // Mouse click
      click(transformMaterialbox.querySelector('.materialboxed'));
      setTimeout(() => {
        // Check overlay is attached
        const overlay = transformMaterialbox.querySelector('#materialbox-overlay');
        const overlayRect = overlay.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        expect(overlay).toExist('because it is generated on init');
        expect(overlay).toBeVisible('because materialbox was clicked');
        expect(overlayRect.top).toEqual(0);
        expect(overlayRect.left).toEqual(0);
        expect(overlayRect.width).toEqual(windowWidth);
        expect(overlayRect.height).toEqual(windowHeight);
        done();
      }, 10);
    });
  });
});
