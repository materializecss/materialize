/* eslint-disable no-undef */

describe('Modal:', () => {
  let trigger1, modal1;

  const fixture = `<!-- Modal Trigger -->
<a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
<button class="btn btn-floating fixed-action-btn modal-trigger" data-target="modal1"><i class="material-icons">menu</i></button>

<!-- Modal Structure -->
<div id="modal1" class="modal">
  <div class="modal-content">
    <h4>Modal Header</h4>
    <p>A bunch of text</p>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
  </div>
</div>


<!-- Modal Trigger -->
<a class="waves-effect waves-light btn modal-trigger" href="#modal2">Modal</a>

<!-- Modal Structure -->
<div id="modal2" class="modal modal-fixed-footer">
  <div class="modal-content">
    <h4>Modal Header</h4>
    <p>A bunch of text</p>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-close waves-effect waves-green btn-flat ">Agree</a>
  </div>
</div>

<!-- Modal Trigger -->
<a class="waves-effect waves-light btn modal-trigger" href="#modal3">Modal</a>

<!-- Modal Structure -->
<div id="modal3" class="modal bottom-sheet">
  <div class="modal-content">
    <h4>Modal Header</h4>
    <p>A bunch of text</p>
  </div>
  <div class="modal-footer">
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
  </div>
</div>
`;
  beforeEach(() => {
    XloadHtml(fixture);
    trigger1 = document.querySelector('.btn[href="#modal1"]');
    triggerIcon1 = document.querySelector('.btn[data-target="modal1"] i');
    trigger2 = document.querySelector('.btn[href="#modal2"]');
    trigger3 = document.querySelector('.btn[href="#modal3"]');
    modal1 = document.querySelector('#modal1');
    modal2 = document.querySelector('#modal2');
    modal3 = document.querySelector('#modal3');
  });

  afterEach(() => XunloadFixtures());

  describe('Modals', () => {
    it('Should open and close correctly', (done) => {
      M.Modal.init(modal1, { inDuration: 0, outDuration: 0 });
      expect(modal1).toBeHidden('Modal should be hidden');
      click(trigger1);
      setTimeout(() => {
        expect(modal1).toBeVisible('Modal should be shown');
        expect(modal1).toHaveClass('open', 'Modal should have class open');
        // Check overlay is attached
        let overlay = M.Modal.getInstance(modal1)._overlay;
        let overlayInDOM = document.contains(overlay);
        expect(overlayInDOM).toEqual(true, 'Overlay should be attached on open');
        click(overlay);
        setTimeout(() => {
          expect(modal1).toNotHaveClass('open', 'Modal should have class open removed');
          let overlayInDOM = document.contains(overlay);
          expect(overlayInDOM).toEqual(false, 'Overlay should be removed on close');
          done();
        }, 10);
      }, 10);
    });

    it('Should open and close correctly with children elements in trigger', (done) => {
      M.Modal.init(modal1, { inDuration: 0, outDuration: 0 });
      expect(modal1).toBeHidden('Modal should be hidden');
      click(triggerIcon1);
      setTimeout(() => {
        expect(modal1).toBeVisible('Modal should be shown');
        expect(modal1).toHaveClass('open', 'Modal should have class open');
        // Check overlay is attached
        let overlay = M.Modal.getInstance(modal1)._overlay;
        let overlayInDOM = document.contains(overlay);
        expect(overlayInDOM).toEqual(true, 'Overlay should be attached on open');
        click(overlay);
        setTimeout(() => {
          expect(modal1).toNotHaveClass('open', 'Modal should have class open removed');
          let overlayInDOM = document.contains(overlay);
          expect(overlayInDOM).toEqual(false, 'Overlay should be removed on close');
          done();
        }, 10);
      }, 10);
    });

    it('Should have a dismissible option', function (done) {
      M.Modal.init(modal1, {
        dismissible: false,
        inDuration: 0,
        outDuration: 0
      });
      click(trigger1);
      setTimeout(() => {
        expect(modal1).toBeVisible('Modal should be shown');
        let overlay = M.Modal.getInstance(modal1)._overlay;
        let overlayInDOM = document.contains(overlay);
        expect(overlayInDOM).toEqual(true, 'Overlay should be attached on open');
        click(overlay);
        setTimeout(() => {
          expect(modal1).toBeVisible('Modal should be shown');
          let overlayInDOM = document.contains(overlay);
          expect(overlayInDOM).toEqual(true, 'modal should not be dismissable');
          done();
        }, 10);
      }, 10);
    });

    it('Should have callbacks', function (done) {
      let readyTest = false;
      let completeTest = false;
      M.Modal.init(modal1, {
        inDuration: 0,
        outDuration: 0,
        onOpenStart: () => {
          readyTest = true;
        },
        onCloseStart: () => {
          completeTest = true;
        }
      });
      expect(readyTest).toEqual(false, 'callback not yet fired');
      expect(completeTest).toEqual(false, 'callback not yet fired');
      click(trigger1);
      setTimeout(() => {
        expect(readyTest).toEqual(true, 'callback fired');
        expect(completeTest).toEqual(false, 'callback not yet fired');
        let overlay = M.Modal.getInstance(modal1)._overlay;
        click(overlay);
        setTimeout(() => {
          expect(readyTest).toEqual(true, 'callback fired');
          expect(completeTest).toEqual(true, 'callback fired');
          done();
        }, 10);
      }, 10);
    });
  });
});
