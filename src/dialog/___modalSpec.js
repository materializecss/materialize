describe('Modal:', () => {
  const fixture = `<a class="btn tonal trigger waves-effect waves-light" href="#" onclick="modal1.showModal(); return false;">Modal</a>
<button class="btn btn-floating fixed-action-btn" onclick="modal1.showModal()"><i class="material-icons">menu</i></button>

<dialog id="modal1" class="modal">
  <div class="modal-header">
    <h4>Modal Header</h4>
  </div>
  <div class="modal-content">
    <p>A bunch of text</p>
  </div>
  <div class="modal-footer">
    <a href="#" onclick="modal1.close(); return false;" class="waves-effect waves-green btn-flat">Agree</a>
  </div>
</dialog>
`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Modals', () => {
    it('Should open and close correctly', (done) => {
      const modal1 = document.querySelector('.modal');
      const trigger = document.querySelector('.trigger');
      expect(modal1).toBeHidden('Modal should be hidden');
      click(trigger);
      setTimeout(() => {
        expect(modal1).toBeVisible('Modal should be shown');
        done();
      }, 10);
    });

    it('Should open and close correctly with children elements in trigger', (done) => {
      const modal1 = document.querySelector('.modal');
      const triggerIcon1 = document.querySelector('button i');
      expect(modal1).toBeHidden('Modal should be hidden');
      click(triggerIcon1);
      setTimeout(() => {
        expect(modal1).toBeVisible('Modal should be shown');
        done();
      }, 10);
    });

    it('Should have callbacks', (done) => {
      let hasBeenClosed = false;
      const modal = document.querySelector('.modal');
      const trigger1 = document.querySelector('.trigger');

      modal.addEventListener('close', () => {
        hasBeenClosed = true;
      });
      click(trigger1);
      expect(hasBeenClosed).toEqual(false, 'callback not yet fired');
      click(document.querySelector('.modal-footer a'));
      setTimeout(() => {
        expect(hasBeenClosed).toEqual(true, 'callback fired');
        done();
      }, 200);
    });
  });
});
