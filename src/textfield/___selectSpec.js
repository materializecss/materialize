describe('Select Plugin:', () => {
  const fixture = `<div class="row">
  <div class="input-field col s12">
    <select class="normal">
      <option value="" disabled>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3" selected>Option 3</option>
    </select>
    <label>Materialize Select</label>
  </div>
</div>

<div class="row">
  <div class="input-field col s12">
    <select multiple class="multiple">
      <option value="" disabled>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2" selected>Option 2</option>
      <option value="3" selected>Option 3</option>
    </select>
    <label>Materialize Select</label>
  </div>
</div>

<div class="row">
  <div class="input-field col s12">
    <select class="optgroup">
      <optgroup label="team 1">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </optgroup>
      <optgroup label="team 2">
        <option value="3">Option 3</option>
        <option value="4">Option 4</option>
      </optgroup>
      <option>After optgroup</option>
    </select>
    <label>Materialize Select</label>
  </div>
</div>

<div class="row">
  <div class="input-field col s12">
    <select class="browser-default">
      <option value="" disabled selected>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <label>Materialize Select</label>
  </div>
</div>
`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.FormSelect.init(document.querySelectorAll('select'), {
      dropdownOptions: { inDuration: 0, outDuration: 0 }
    });
  });
  afterEach(() => XunloadFixtures());

  describe('Select:', () => {
    beforeEach(() => {
      const fixture1 = `<div class="row">
        <div class="input-field col s12">
          <select class="normal">
            <option value="" disabled>Choose your option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3" selected>Option 3</option>
          </select>
          <label>Materialize Select</label>
        </div>
        <div class="input-field col s12">
          <select class="browser-default">
            <option value="" disabled selected>Choose your option</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
          <label>Materialize Select</label>
        </div>
      </div>`;
      XloadHtml(fixture1);
    });
    afterEach(() => XunloadFixtures());

    it('should open dropdown and select option', (done) => {
      const browserSelect = document.querySelector('select.normal');
      const selectInstance = M.FormSelect.getInstance(browserSelect);
      const normalInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      const normalDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');

      setTimeout(() => {
        expect(normalInput).toExist('Should dynamically generate select dropdown structure.');
        expect(normalDropdown).toExist('Should dynamically generate select dropdown structure.');
        expect(normalInput).toBeVisible('Should be visible before dropdown is opened.');
        expect(normalDropdown).toBeHidden('Should be hidden before dropdown is opened.');

        click(normalInput);
        setTimeout(() => {
          expect(normalDropdown).toBeVisible('Should be visible after opening.');
          const firstOption = normalDropdown.querySelector('li:not(.disabled)');
          click(firstOption);
          blur(normalInput);
          setTimeout(() => {
            expect(normalDropdown).toBeHidden('Should be hidden after choosing item.');
            expect(normalInput.value).toEqual(
              firstOption.innerText,
              'Value should equal chosen option.'
            );
            expect(firstOption.getAttribute('aria-selected')).toBe(
              'true',
              'Item be selected to assistive technologies.'
            );
            done();
          }, 10);
        }, 10);
      }, 10);
    });

    it('should have pre-selected value', (done) => {
      const elem = document.querySelector('select.normal');
      const instance = M.FormSelect.getInstance(elem);
      const input = instance.wrapper.querySelector('input.select-dropdown');
      const firstOption = elem.querySelector('option[selected]');

      setTimeout(() => {
        expect(input.value).toEqual(
          firstOption.innerText,
          'Value should be equal to preselected option.'
        );
        expect(
          firstOption.getAttribute('aria-selected'),
          'First item should be selected to assistive technologies.'
        );
        done();
      }, 10);
    });

    it('should not initialize if browser default', () => {
      const browserDefault = document.querySelector('select.browser-default');
      expect(browserDefault.parentNode.classList.contains('select-wrapper')).toBeFalse(
        'Wrapper should not be made'
      );
    });

    it('should getSelectedValues correctly', (done) => {
      const elem = document.querySelector('select.normal');
      const instance = M.FormSelect.getInstance(elem);
      const normalInput = instance.wrapper.querySelector('input.select-dropdown');
      const normalDropdown = instance.wrapper.querySelector('ul.select-dropdown');

      expect(instance.getSelectedValues()).toEqual(
        [elem.value],
        'Should equal initial selected value'
      );

      click(normalInput);
      setTimeout(() => {
        const firstOption = normalDropdown.querySelector('li:not(.disabled)');
        click(firstOption);
        blur(normalInput);

        setTimeout(() => {
          expect(instance.getSelectedValues()).toEqual(
            [elem.value],
            'Should equal value of first option'
          );
          done();
        }, 10);
      }, 10);
    });
  });

  describe('Multiselect:', () => {
    it('Dropdown should allow multiple selections to assistive technologies', () => {
      const elem = document.querySelector('select.multiple');
      const instance = M.FormSelect.getInstance(elem);
      expect(instance.dropdownOptions.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should open dropdown and select multiple options', (done) => {
      const elem = document.querySelector('select.multiple');
      const instance = M.FormSelect.getInstance(elem);
      const input = instance.wrapper.querySelector('input.select-dropdown');
      const dropdown = instance.wrapper.querySelector('ul.select-dropdown');

      expect(input).toExist('Should dynamically generate select dropdown structure.');
      expect(dropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(input).toBeVisible('Should be visible before dropdown is opened.');
      expect(dropdown).toBeHidden('Should be hidden before dropdown is opened.');

      click(input);

      setTimeout(() => {
        expect(dropdown).toBeVisible('Should be visible after opening.');

        let firstOption = dropdown.querySelector('li:not(.disabled)');
        click(firstOption);
        click(document.body);

        setTimeout(() => {
          firstOption = dropdown.querySelector('li:not(.disabled)');
          const secondOption = dropdown.querySelectorAll('li:not(.disabled)')[1];
          const thirdOption = dropdown.querySelectorAll('li:not(.disabled)')[2];

          const selectedVals = Array.prototype.slice
            .call(elem.querySelectorAll('option:checked'), 0)
            .map((v) => v.value);

          const selectedAria = Array.prototype.slice
            .call(dropdown.querySelectorAll('li.selected'), 0)
            .map((v) => v.getAttribute('aria-selected'));

          const unselectedAria = Array.prototype.slice
            .call(dropdown.querySelectorAll('li:not(.selected)'), 0)
            .map((v) => v.getAttribute('aria-selected'));

          expect(dropdown).toBeHidden('Should be hidden after choosing item.');
          expect(selectedVals).toEqual(
            ['1', '2', '3'],
            'Actual select should have correct selected values.'
          );
          expect(selectedAria).toEqual(
            ['true', 'true', 'true'],
            'Selected values should be checked to assistive technologies.'
          );
          expect(unselectedAria).toEqual(
            ['false'],
            'Unselected values should be checked to assistive technologies.'
          );
          expect(input.value).toEqual(
            firstOption.innerText + ', ' + secondOption.innerText + ', ' + thirdOption.innerText,
            'Value should equal chosen multiple options.'
          );
          done();
        }, 10);
      }, 10);
    });

    it('should open dropdown and deselect multiple options', (done) => {
      const elem = document.querySelector('select.multiple');
      const instance = M.FormSelect.getInstance(elem);
      const input = instance.wrapper.querySelector('input.select-dropdown');
      const dropdown = instance.wrapper.querySelector('ul.select-dropdown');

      expect(input).toExist('Should dynamically generate select dropdown structure.');
      expect(dropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(input).toBeVisible('Should be hidden before dropdown is opened.');
      expect(dropdown).toBeHidden('Should be hidden before dropdown is opened.');

      click(input);
      setTimeout(() => {
        expect(dropdown).toBeVisible('Should be visible after opening.');
        const disabledOption = dropdown.querySelector('li.disabled');
        const secondOption = dropdown.querySelectorAll('li:not(.disabled)')[1];
        const thirdOption = dropdown.querySelectorAll('li:not(.disabled)')[2];
        click(secondOption);
        click(thirdOption);
        click(document.body);

        setTimeout(() => {
          expect(dropdown).toBeHidden('Should be hidden after choosing item.');
          expect(elem.value).toEqual(
            '',
            'Actual select element should be empty because none chosen.'
          );
          expect(input.value).toEqual(
            disabledOption.innerText,
            'Value should equal default because none chosen.'
          );
          done();
        }, 10);
      }, 10);
    });

    it('should have multiple pre-selected values', (done) => {
      const elem = document.querySelector('select.multiple');
      const instance = M.FormSelect.getInstance(elem);
      const input = instance.wrapper.querySelector('input.select-dropdown');
      const text = Array.from(elem.querySelectorAll('option[selected]'))
        .map((o) => o.textContent)
        .join(', ');
      setTimeout(() => {
        expect(input.value).toEqual(text, 'Value should equal preselected options.');
        done();
      }, 10);
    });
  });

  describe('Optgroup Select', () => {
    let browserSelect, optInput, optDropdown, optionInOptgroup, optionAfterOptGroup, selectInstance;

    beforeEach(() => {
      browserSelect = document.querySelector('select.optgroup');
      selectInstance = M.FormSelect.getInstance(browserSelect);
    });

    it('Option groups should behave as such for assistive technologies', () => {
      optInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      optDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      const optgroups = optDropdown.querySelectorAll('li.optgroup');
      const browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
      for (let i = 0; i < optgroups.length; i++) {
        expect(optgroups[i].getAttribute('role')).toBe('group', 'Should behave as group.');
      }
      for (let i = 0; i < browerSelectOptgroups.length; i++) {
        expect(browerSelectOptgroups[i].children.length).toBe(
          optgroups[i].getAttribute('aria-owns').split(' ').length,
          'Browser option groups and custom groups must have the same ammount of children for assistive technologies'
        );
      }
    });

    it('should open dropdown and select options', (done) => {
      optInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      optDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      const optgroups = optDropdown.querySelectorAll('li.optgroup');
      const browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
      for (let i = 0; i < browerSelectOptgroups.length; i++) {
        expect(browerSelectOptgroups[i].label).toEqual(
          optgroups[i].innerText,
          'should generate optgroup structure.'
        );
      }
      expect(optInput).toExist('Should dynamically generate select dropdown structure.');
      expect(optDropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(optInput).toBeVisible('Should be hidden before dropdown is opened.');
      expect(optDropdown).toBeHidden('Should be hidden before dropdown is opened.');
      click(optInput);
      setTimeout(() => {
        expect(optDropdown).toBeVisible('Should be visible after opening.');
        const secondOption = optDropdown.querySelectorAll('li:not(.disabled):not(.optgroup)')[1];
        click(secondOption);
        blur(optInput);
        setTimeout(() => {
          expect(optDropdown).toBeHidden('Should be hidden after choosing item.');
          expect(optInput.value).toEqual(
            secondOption.innerText,
            'Value should be equal to selected option.'
          );
          done();
        }, 10);
      }, 10);
    });

    it('should have options inside optgroup indented', () => {
      optionInOptgroup = selectInstance.wrapper.querySelector('li.optgroup + li');
      optionAfterOptGroup = selectInstance.wrapper.querySelector('ul li:last-child');
      expect(optionInOptgroup).toHaveClass('optgroup-option', 'Should have optgroup-option class');
      expect(optionAfterOptGroup).toNotHaveClass(
        'optgroup-option',
        'Should not have optgroup-option class'
      );
    });

    it('should not do anything when optgroup li clicked', function (done) {
      optInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      optDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      const originalVal = optInput.value;
      const optgroups = optDropdown.querySelectorAll('li.optgroup');
      const browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
      for (let i = 0; i < browerSelectOptgroups.length; i++) {
        expect(browerSelectOptgroups[i].label).toEqual(
          optgroups[i].innerText,
          'should generate optgroup structure.'
        );
      }
      expect(optInput).toExist('Should dynamically generate select dropdown structure.');
      expect(optDropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(optInput).toBeVisible('Should be hidden before dropdown is opened.');
      expect(optDropdown).toBeHidden('Should be hidden before dropdown is opened.');
      click(optInput);
      setTimeout(() => {
        expect(optDropdown).toBeVisible('Should be visible after opening.');
        const optgroup = optDropdown.querySelector('li.optgroup');
        click(optgroup);
        blur(optInput);
        setTimeout(() => {
          expect(optDropdown).toBeVisible('Should not be hidden after choosing invalid item.');
          expect(optInput.value).toEqual(originalVal, 'Value should be equal to original option.');
          done();
        }, 10);
      }, 10);
    });
  });
});
