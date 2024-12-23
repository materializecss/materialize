describe('Autocomplete Plugin', () => {
  const fixture = `<div class="row">
  <div class="col s12">
    <div class="row">
      <div class="input-field col s12">
        <input type="text" id="normal-autocomplete" class="autocomplete">
        <label for="normal-autocomplete">Autocomplete</label>
      </div>
    </div>
  </div>
  <div class="col s12">
    <div class="row">
      <div class="input-field col s12">
        <input type="text" id="limited-autocomplete" class="autocomplete">
        <label for="limited-autocomplete">Autocomplete</label>
      </div>
    </div>
  </div>
</div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.Autocomplete.init(document.querySelectorAll('input.autocomplete'), {
      dropdownOptions: {
        inDuration: 0,
        outDuration: 0
      },
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
  });
  afterEach(() => XunloadFixtures());

  describe('Autocomplete', () => {
    function resetAutocomplete(autocompleteElement, data) {
      M.Autocomplete.getInstance(autocompleteElement).destroy();
      return M.Autocomplete.init(autocompleteElement, {
        data: data,
        minLength: 0,
        dropdownOptions: {
          inDuration: 0,
          outDuration: 0
        }
      });
    }

    function openDropdownAndSelectFirstOption(autocomplete, onFinish) {
      click(autocomplete);
      keyup(autocomplete, 9); // works
      setTimeout(() => {
        const firstOption = autocomplete.parentNode.querySelector('.autocomplete-content li');
        click(firstOption);
        setTimeout(() => onFinish(), 10);
      }, 10); // error caused by setTimeout in autocomplete component
    }

    it('should work with multiple initializations', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      M.Autocomplete.init(normal, { hi: null });
      M.Autocomplete.init(normal, { hi: null });
      M.Autocomplete.init(normal, { hi: null });
      M.Autocomplete.init(normal, {
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
      const autocompleteEl = normal.parentNode.querySelectorAll('.autocomplete-content');
      expect(autocompleteEl.length).toEqual(
        1,
        'Should dynamically generate autocomplete structure.'
      );
      done();
    });

    it('should limit results in search function', (done) => {
      const limited = document.querySelector('#limited-autocomplete');
      const data = [];
      for (let i = 100; i >= 0; i--) {
        const randString = 'a' + Math.random().toString(36).substring(2);
        data.push({ id: randString });
      }
      const limitedInstance = M.Autocomplete.getInstance(limited);
      const limit = 20;
      limitedInstance.options.onSearch = () => {
        const filteredItems = data.slice(0, limit);
        limitedInstance.setMenuItems(filteredItems);
      };
      focus(limited);
      limited.value = 'a';
      keyup(limited, 65);
      setTimeout(() => {
        const autocompleteEl = limitedInstance.container;
        expect(autocompleteEl.children.length).toEqual(
          20,
          'Results should be at max the set limit'
        );
        done();
      }, 10);
    });

    it('should open correctly from typing', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      const autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');
      focus(normal);
      normal.value = 'e';
      keyup(normal, 69);
      setTimeout(() => {
        expect(autocompleteEl.children.length).toEqual(
          2,
          'Results should show dropdown on text input'
        );
        done();
      }, 10);
    });

    it('should open correctly from keyboard focus', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      const autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');
      normal.value = 'e';
      keyup(normal, 9);
      focus(normal);
      setTimeout(() => {
        expect(autocompleteEl.children.length).toEqual(
          2,
          'Results should show dropdown on text input'
        );
        done();
      }, 10);
    });

    it('should select option on click', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      M.Autocomplete.init(normal, {
        data: [{ id: 'Value A' }],
        minLength: 0,
        dropdownOptions: {
          inDuration: 0,
          outDuration: 0
        }
      });
      openDropdownAndSelectFirstOption(normal, () => {
        expect(normal.value).toEqual('Value A', 'Value should equal chosen option.');
        done();
      });
    });

    it('should select proper options on both autocompletes', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      const limited = document.querySelector('#limited-autocomplete');
      M.Autocomplete.init(normal, {
        data: [{ id: 'Value A' }],
        minLength: 0,
        dropdownOptions: {
          inDuration: 0,
          outDuration: 0
        }
      });
      M.Autocomplete.init(limited, {
        data: [{ id: 'Value B' }],
        minLength: 0,
        dropdownOptions: {
          inDuration: 0,
          outDuration: 0
        }
      });
      openDropdownAndSelectFirstOption(normal, () => {
        openDropdownAndSelectFirstOption(limited, () => {
          expect(normal.value).toEqual('Value A', 'Value should equal chosen option.');
          expect(limited.value).toEqual('Value B', 'Value should equal chosen option.');
          done();
        });
      });
    });

    it('destroy method should properly dispose autocomplete component', () => {
      const normal = document.querySelector('#normal-autocomplete');
      const limited = document.querySelector('#limited-autocomplete');
      expect(normal.parentNode.querySelector('.autocomplete-content')).not.toBeNull();
      expect(limited.parentNode.querySelector('.autocomplete-content')).not.toBeNull();
      const normalInstance = M.Autocomplete.getInstance(normal);
      const limitedInstance = M.Autocomplete.getInstance(limited);
      normalInstance.destroy();
      limitedInstance.destroy();
      expect(normal.parentNode.querySelector('.autocomplete-content')).toBeNull();
      expect(limited.parentNode.querySelector('.autocomplete-content')).toBeNull();
    });

    it('selectOption method should chose only from showed dropdown', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      const autocompleteInstance = resetAutocomplete(normal, [
        { id: 'Value Q1' },
        { id: 'Value Q' },
        { id: 'Value R' }
      ]);
      const autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');

      focus(normal);
      normal.value = 'Q';
      keyup(normal, 81);

      setTimeout(() => {
        expect(autocompleteEl.children.length).toBe(2);
        const dropdownAutocompleteIds = Array.from(autocompleteEl.querySelectorAll('li')).map(
          (liElement) => liElement.getAttribute('data-id')
        );
        expect(dropdownAutocompleteIds).toEqual(['Value Q1', 'Value Q']);

        autocompleteInstance.selectOption('Value R');
        expect(normal.value)
          .withContext('Only options from dropdown can be selected through selectOption')
          .toBe('Q');
        autocompleteInstance.selectOption('Value Q');
        expect(normal.value)
          .withContext('Only options from dropdown can be selected through selectOption')
          .toBe('Value Q');
        done();
      }, 10);
    });

    it('setValues method should chose from any init data entry', (done) => {
      const normal = document.querySelector('#normal-autocomplete');
      const autocompleteInstance = resetAutocomplete(normal, [
        { id: 'Value Q1' },
        { id: 'Value Q' },
        { id: 'Value R' }
      ]);
      const autocompleteEl = normal.parentNode.querySelector('.autocomplete-content');

      focus(normal);
      normal.value = 'Q';
      keyup(normal, 81);

      setTimeout(function () {
        expect(autocompleteEl.children.length).toBe(2);
        const dropdownAutocompleteIds = Array.from(autocompleteEl.querySelectorAll('li')).map(
          (liElement) => liElement.getAttribute('data-id')
        );
        expect(dropdownAutocompleteIds).toEqual(['Value Q1', 'Value Q']);

        autocompleteInstance.setValues([{ id: 'Value R' }]);
        expect(normal.value)
          .withContext('Any option from init data can be selected through setValues')
          .toBe('Value R');
        autocompleteInstance.setValues([{ id: 'Value Q' }]);
        expect(normal.value)
          .withContext('Any option from init data can be selected through setValues')
          .toBe('Value Q');
        done();
      }, 10);
    });
  });
});
