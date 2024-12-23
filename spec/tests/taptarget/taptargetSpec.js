/* eslint-disable no-undef */

describe('TapTarget', () => {
  const fixture = `<div class="tap-target-container">
  <a id="tap-target-link" class="waves-effect waves-light btn btn-floating toggle-tap-target"><i class="material-icons">menu</i></a>
  <div class="tap-target" data-target="tap-target-link">
      <div class="tap-target-content">
          <div class="tap-target-inner-wrapper">
              <h5>Feature Discovery</h5>
              <p>Some incredible text here</p>
          </div>
      </div>
  </div>
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('tap target plugin', () => {
    afterEach(() => {
      if (M.TapTarget._taptargets.length) {
        M.TapTarget.getInstance(document.querySelector('.tap-target')).destroy();
      }
    });

    it('should be able to initialize', (done) => {
      expect(M.TapTarget._taptargets.length).toEqual(0, 'no tap targets initialized');
      M.TapTarget.init(document.querySelectorAll('.tap-target'));
      expect(M.TapTarget._taptargets.length).toEqual(1, 'there should be 1 tap target initialization');
      done();
    });

    it('should be hidden on initialization', (done) => {
      const tapTargetElem = document.querySelector('.tap-target');
      M.TapTarget.init(tapTargetElem);
      setTimeout(() => {
        expect(tapTargetElem).not.toBeVisible('taptarget was not hidden on initialization');
        done();
      }, 10);
    });

    it('should open by click interaction on the data-target element', (done) => {
      const tapTargetElem = document.querySelector('.tap-target');
      M.TapTarget.init(tapTargetElem);
      click(document.querySelector('.toggle-tap-target'));
      setTimeout(() => {
        expect(tapTargetElem).toBeVisible('taptarget was not visible after click interaction');
        done();
      }, 10);
    });

    it('should close by click interaction on the data-target element', (done) => {
      const tapTargetElem = document.querySelector('.tap-target');
      const toggleTapTargetElem = document.querySelector('.toggle-tap-target');
      M.TapTarget.init(tapTargetElem);
      click(toggleTapTargetElem);
      setTimeout(() => {
        click(toggleTapTargetElem);
        setTimeout(() => {
          expect(tapTargetElem).not.toBeVisible('taptarget was not hidden after click interaction');
          done();
        }, 400);
      }, 400);
    });

    it('should have working callbacks', (done) => {
      const toggleTapTargetElem = document.querySelector('.toggle-tap-target');
      let opened = false;
      let closed = false;
      M.TapTarget.init(document.querySelector('.tap-target'), {
        onOpen: () => {
          opened = true;
        },
        onClose: () => {
          closed = true;
        },
      });
      click(toggleTapTargetElem);
      expect(opened).toEqual(true, 'opened variable should be true after method callback');
      setTimeout(() => {
        click(toggleTapTargetElem);
        expect(closed).toEqual(true, 'closed variable should be true after method callback');
      }, 400);
      done();
    });

    it('should destroy correctly', function(done) {
      const tapTargetElem = document.querySelector('.tap-target');
      expect(M.TapTarget._taptargets.length).toEqual(0, 'no tap targets initialized');
      M.TapTarget.init(tapTargetElem);
      expect(M.TapTarget._taptargets.length).toEqual(1, 'there should be 1 tap target initialization');
      M.TapTarget.getInstance(tapTargetElem).destroy();
      setTimeout(() => {
        expect(M.TapTarget._taptargets.length).toEqual(0, 'no tap targets initialized');
        done();
      }, 10);
    });
  });
});
