/* eslint-disable no-undef */

describe('Select Plugin', () => {
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

  describe('Select', () => {
    let browserSelect, normalInput, normalDropdown, selectInstance;

    beforeEach(() => {
      M.FormSelect.init(document.querySelectorAll('select'), {
        dropdownOptions: { inDuration: 0, outDuration: 0 }
      });
      browserSelect = document.querySelector('select.normal');
      selectInstance = M.FormSelect.getInstance(browserSelect);
    });

    it('should open dropdown and select option', function (done) {
      normalInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      normalDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      expect(normalInput).toExist('Should dynamically generate select dropdown structure.');
      expect(normalDropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(normalInput).toBeVisible('Should be visible before dropdown is opened.');
      expect(normalDropdown).toBeHidden('Should be hidden before dropdown is opened.');
      click(normalInput);
      setTimeout(() => {
        expect(normalDropdown).toBeVisible('Should be visible after opening.');
        let firstOption = normalDropdown.querySelector('li:not(.disabled)');
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
    });

    it('should have pre-selected value', () => {
      normalInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      normalDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      let firstOption = browserSelect.querySelector('option[selected]');
      expect(normalInput.value).toEqual(
        firstOption.innerText,
        'Value should be equal to preselected option.'
      );
      expect(
        firstOption.getAttribute('aria-selected'),
        'First item should be selected to assistive technologies.'
      );
    });

    it('should not initialize if browser default', () => {
      browserDefault = document.querySelector('select.browser-default');
      expect(browserDefault.parentNode.classList.contains('select-wrapper')).toBeFalse(
        'Wrapper should not be made'
      );
    });

    it('should getSelectedValues correctly', function (done) {
      normalInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      normalDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      expect(M.FormSelect.getInstance(browserSelect).getSelectedValues()).toEqual(
        [browserSelect.value],
        'Should equal initial selected value'
      );
      click(normalInput);
      setTimeout(() => {
        let firstOption = normalDropdown.querySelector('li:not(.disabled)');
        click(firstOption);
        blur(normalInput);
        setTimeout(() => {
          expect(M.FormSelect.getInstance(browserSelect).getSelectedValues()).toEqual(
            [browserSelect.value],
            'Should equal value of first option'
          );
          done();
        }, 10);
      }, 10);
    });
  });

  describe('Multiple Select', () => {
    let browserSelect, multipleInput, multipleDropdown, selectInstance;

    beforeEach(() => {
      browserSelect = document.querySelector('select.multiple');
      selectInstance = M.FormSelect.getInstance(browserSelect);
    });

    it('Dropdown should allow multiple selections to assistive technologies', () => {
      expect(selectInstance.dropdownOptions.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should open dropdown and select multiple options', function (done) {
      multipleInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      multipleDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      expect(multipleInput).toExist('Should dynamically generate select dropdown structure.');
      expect(multipleDropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(multipleInput).toBeVisible('Should be visible before dropdown is opened.');
      expect(multipleDropdown).toBeHidden('Should be hidden before dropdown is opened.');
      click(multipleInput);
      setTimeout(() => {
        expect(multipleDropdown).toBeVisible('Should be visible after opening.');
        let firstOption = multipleDropdown.querySelector('li:not(.disabled)');
        click(firstOption);
        click(document.body);
        setTimeout(() => {
          firstOption = multipleDropdown.querySelector('li:not(.disabled)');
          let secondOption = multipleDropdown.querySelectorAll('li:not(.disabled)')[1];
          let thirdOption = multipleDropdown.querySelectorAll('li:not(.disabled)')[2];
          let selectedVals = Array.prototype.slice
            .call(browserSelect.querySelectorAll('option:checked'), 0)
            .map(function (v) {
              return v.value;
            });
          let selectedAria = Array.prototype.slice
            .call(multipleDropdown.querySelectorAll('li.selected'), 0)
            .map(function (v) {
              return v.getAttribute('aria-selected');
            });
          let unselectedAria = Array.prototype.slice
            .call(multipleDropdown.querySelectorAll('li:not(.selected)'), 0)
            .map(function (v) {
              return v.getAttribute('aria-selected');
            });
          expect(multipleDropdown).toBeHidden('Should be hidden after choosing item.');
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
          expect(multipleInput.value).toEqual(
            firstOption.innerText + ', ' + secondOption.innerText + ', ' + thirdOption.innerText,
            'Value should equal chosen multiple options.'
          );
          done();
        }, 10);
      }, 10);
    });

    it('should open dropdown and deselect multiple options', function (done) {
      multipleInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      multipleDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      expect(multipleInput).toExist('Should dynamically generate select dropdown structure.');
      expect(multipleDropdown).toExist('Should dynamically generate select dropdown structure.');
      expect(multipleInput).toBeVisible('Should be hidden before dropdown is opened.');
      expect(multipleDropdown).toBeHidden('Should be hidden before dropdown is opened.');
      click(multipleInput);
      setTimeout(() => {
        expect(multipleDropdown).toBeVisible('Should be visible after opening.');
        let disabledOption = multipleDropdown.querySelector('li.disabled');
        let secondOption = multipleDropdown.querySelectorAll('li:not(.disabled)')[1];
        let thirdOption = multipleDropdown.querySelectorAll('li:not(.disabled)')[2];
        click(secondOption);
        click(thirdOption);
        click(document.body);
        setTimeout(() => {
          expect(multipleDropdown).toBeHidden('Should be hidden after choosing item.');
          expect(browserSelect.value).toEqual(
            '',
            'Actual select element should be empty because none chosen.'
          );
          expect(multipleInput.value).toEqual(
            disabledOption.innerText,
            'Value should equal default because none chosen.'
          );
          done();
        }, 10);
      }, 10);
    });

    it('should have multiple pre-selected values', () => {
      multipleInput = selectInstance.wrapper.querySelector('input.select-dropdown');
      multipleDropdown = selectInstance.wrapper.querySelector('ul.select-dropdown');
      let secondOption = browserSelect.querySelector('option[selected]');
      let thirdOption = browserSelect.querySelectorAll('option[selected]')[1];
      expect(multipleInput.value).toEqual(
        secondOption.innerText + ', ' + thirdOption.innerText,
        'Value should be equal to preselected option.'
      );
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
      let optgroups = optDropdown.querySelectorAll('li.optgroup');
      let browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
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
      let optgroups = optDropdown.querySelectorAll('li.optgroup');
      let browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
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
        let secondOption = optDropdown.querySelectorAll('li:not(.disabled):not(.optgroup)')[1];
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
      let originalVal = optInput.value;
      let optgroups = optDropdown.querySelectorAll('li.optgroup');
      let browerSelectOptgroups = browserSelect.querySelectorAll('optgroup');
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
        let optgroup = optDropdown.querySelector('li.optgroup');
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
