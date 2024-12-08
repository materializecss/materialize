/* eslint-disable no-undef */

describe('TapTarget', () => {
  const fixture = `<a id="tap-target-link" class="waves-effect waves-light btn btn-floating toggle-tap-target"><i class="material-icons">email</i></a>
<div class="tap-target" data-target="tap-target-link">
    <div class="tap-target-content">
        <div class="tap-target-inner-wrapper">
            <h5>Feature Discovery</h5>
            <p>Some incredible text here</p>
        </div>
    </div>
</div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.TapTarget.init(document.querySelector('.tap-target'));
  });
  afterEach(() => XunloadFixtures());

  toggleTapTarget = (callback) => {
    tapTarget = M.TapTarget.getInstance(document.querySelector('.tap-target'));
    callback();
    setTimeout(() => {
      const divStyle = getComputedStyle(tapTarget.el);
      expect(divStyle.getPropertyValue('visibility')).toEqual(
        tapTarget.isOpen ? 'visible' : 'hidden',
        'Tap Target not ' + (tapTarget.isOpen ? 'visible' : 'hidden') + ' after interaction with the triggering element'
      );
    }, 100);
  }

  describe('featurediscovery plugin', () => {

    it('should toggle by click and keyboard interaction on the button element', (done) => {
      toggleTapTarget(() => {
        click(document.querySelector('.toggle-tap-target'));
        done();
      });

      setTimeout(() => {
        toggleTapTarget(() => {
          click(document.querySelector('.toggle-tap-target'));
          done();
        });
      }, 200);

      setTimeout(() => {
        toggleTapTarget(() => {
          keydown(document.querySelector('.toggle-tap-target'), 13);
          done();
        });
      }, 300);

      setTimeout(() => {
        toggleTapTarget(() => {
          keydown(document.querySelector('.toggle-tap-target'), 13);
          done();
        });
      }, 400);
    });
  });
});
