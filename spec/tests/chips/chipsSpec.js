describe('Chips', () => {
  const fixture = `<div class="chips"><input></div>
<div class="chips chips-initial"><input></div>
<div class="chips chips-placeholder"><input></div>
<div class="chips chips-autocomplete"><input></div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.Chips.init(document.querySelector('.chips'));
    M.Chips.init(document.querySelector('.chips-initial'), {
      data: [
        { id: 12, text: 'Apple' },
        { id: 13, text: 'Microsoft' },
        {
          id: 42,
          text: 'Google',
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
        }
      ]
    });
    M.Chips.init(document.querySelector('.chips-placeholder'), {
      placeholder: 'Enter a tag',
      secondaryPlaceholder: '+Tag'
    });
    M.Chips.init(document.querySelector('.chips-autocomplete'), {
      autocompleteOptions: {
        data: [
          { id: 12, text: 'Apple' },
          { id: 13, text: 'Microsoft' },
          { id: 42, text: 'Google' }
        ]
      }
    });
  });
  afterEach(() => XunloadFixtures());

  describe('chips plugin', () => {
    let chips, input;

    it('should work with multiple initializations', () => {
      chips = document.querySelector('.chips');
      M.Chips.init(chips);
      M.Chips.init(chips);
      M.Chips.init(chips);
      M.Chips.init(chips);
      input = chips.querySelectorAll('input');
      expect(input.length).toEqual(1, 'Should dynamically generate chips structure.');
    });

    it('should be able to add chip', (done) => {
      chips = document.querySelector('.chips');
      input = chips.querySelector('input');
      input.value = 'one';
      keydown(input, 13);
      setTimeout(() => {
        let numChips = chips.querySelectorAll('.chip').length;
        let oneChip = chips.querySelector('.chip');
        expect(numChips).toEqual(1, 'one chip should have been added');
        for (let i = oneChip.children.length - 1; i >= 0; i--) {
          oneChip.children[i].remove();
        }
        expect(oneChip.innerText).toEqual('one', 'the chip should have value "one"');
        done();
      }, 100); // 400
    });

    it('should be able to delete chip', (done) => {
      chips = document.querySelector('.chips.chips-initial');
      input = chips.querySelector('input');
      let numChips = chips.querySelectorAll('.chip').length;
      expect(numChips).toEqual(3, '3 initial chips should have been added');
      click(chips.querySelector('.chip .close'));
      setTimeout(() => {
        numChips = chips.querySelectorAll('.chip').length;
        expect(numChips).toEqual(2, 'one chip should have been deleted');
        done();
      }, 100); // 400
    });

    it('should have working callbacks', (done) => {
      chips = document.querySelector('.chips');
      let chipWasAdded = false;
      let chipAddedElem = null;
      let chipSelect = false;
      let chipSelected = null;
      let chipDelete = false;
      let chipDeleted = null;

      M.Chips.init(chips, {
        data: [{ id: 'One' }, { id: 'Two' }, { id: 'Three' }],
        onChipAdd: (chipsEl, chipEl) => {
          chipAddedElem = chipEl;
          chipWasAdded = true;
        },
        onChipSelect: (chipsEl, chipEl) => {
          chipSelected = chipEl;
          chipSelect = true;
        },
        onChipDelete: (chipsEl, chipEl) => {
          chipDeleted = chipEl;
          chipDelete = true;
        }
      });

      input = chips.querySelector('input');
      input.value = 'Four';
      expect(chipWasAdded).toEqual(false, 'callback not yet fired');
      expect(chipSelect).toEqual(false, 'callback not yet fired');
      expect(chipDelete).toEqual(false, 'callback not yet fired');
      keydown(input, 13);

      setTimeout(() => {
        expect(chipWasAdded).toEqual(true, 'add callback fired');
        expect(chipAddedElem.childNodes[0].nodeValue).toEqual(
          'Four',
          'add callback provides correct chip element'
        );
        click(chips.querySelectorAll('.chip')[1]);
        setTimeout(() => {
          expect(chipSelect).toEqual(true, 'select callback fired');
          expect(chipSelected.childNodes[0].nodeValue).toEqual(
            'Two',
            'select callback provides correct chip element'
          );
          click(chips.querySelectorAll('.close')[2]);
          setTimeout(() => {
            expect(chipDelete).toEqual(true, 'delete callback fired');
            expect(chipDeleted.childNodes[0].nodeValue).toEqual(
              'Three',
              'add callback provides correct chip element'
            );
            done();
          }, 100);
        }, 100);
      }, 100);
    });
  });

  // describe("Chips autocomplete", () => {
  // });
});
