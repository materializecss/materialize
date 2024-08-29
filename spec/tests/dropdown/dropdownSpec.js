/* eslint-disable no-undef */

describe('Dropdown Plugin:', () => {
  const fixture = `<div class="row">
    <div class="input-field col s12">
      <a id="dropdownActivator" class='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>

      <ul id='dropdown1' class='dropdown-content'>
        <li><a href="#!">one</a></li>
        <li><a href="#!">two</a></li>
        <li class="divider"></li>
        <li><a href="#!">three</a></li>
      </ul>

      <a id="dropdownBubble" class='dropdown-trigger btn' href='#' data-target='dropdown2'>
        <i class="material-icons left">arrow_drop_down</i>
        <span>Event Bubble!</span>
      </a>

      <ul id='dropdown2' class='dropdown-content'>
        <li><a href="#!">one</a></li>
        <li><a href="#!">two</a></li>
        <li class="divider"></li>
        <li><a href="#!">three</a></li>
      </ul>

      <a id="dropdownDestroyTrigger" class='dropdown-trigger btn' href='#' data-target='dropdownDestroy'>
        <i class="material-icons left">arrow_drop_down</i>
        <span>Drop Me!</span>
      </a>

      <ul id='dropdownDestroy' class='dropdown-content'>
        <li><a href="#!">one</a></li>
        <li><a href="#!">two</a></li>
        <li class="divider"></li>
        <li><a href="#!">three</a></li>
      </ul>
    </div>
  </div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
      inDuration: 0,
      outDuration: 0
    });
  });
  afterEach(() => XunloadFixtures());

  describe('Dropdown', () => {
    let normalDropdown;

    it('should open and close programmatically', (done) => {
      const dropdown1 = document.querySelector('#dropdown1');
      normalDropdown = document.querySelector('#dropdownActivator');
      expect(dropdown1).toBeHidden('Should be hidden before dropdown is opened.');
      M.Dropdown.getInstance(normalDropdown).open();
      //setTimeout(() => {
      expect(dropdown1).toBeVisible('Should be shown after dropdown is opened.');
      M.Dropdown.getInstance(normalDropdown).close();
      setTimeout(() => {
        expect(dropdown1).toBeHidden('Should be hidden after dropdown is closed.');
        done();
      }, 5); // 400
      //}, 400);
    });

    it('should close dropdown on document click if programmatically opened', (done) => {
      const dropdown1 = document.querySelector('#dropdown1');
      normalDropdown = document.querySelector('#dropdownActivator');
      expect(dropdown1).toBeHidden('Should be hidden before dropdown is opened.');
      M.Dropdown.getInstance(normalDropdown).open();
      setTimeout(() => {
        expect(dropdown1).toBeVisible('Should be shown after dropdown is opened.');
        click(document.body);
        setTimeout(() => {
          expect(dropdown1).toBeHidden('Should be hidden after dropdown is closed.');
          done();
        }, 5); // 400
      }, 5); // 400
    });

    it('should bubble events correctly', (done) => {
      const dropdown2 = document.querySelector('#dropdown2');
      normalDropdown = document.querySelector('#dropdownBubble');
      expect(dropdown2).toBeHidden('Should be hidden before dropdown is opened.');
      click(normalDropdown.querySelector('i'));
      setTimeout(() => {
        expect(dropdown2).toBeVisible('Should be shown after dropdown is opened.');
        click(document.body);
        setTimeout(() => {
          expect(dropdown2).toBeHidden('Should be hidden after dropdown is closed.');
          done();
        }, 5); // 400
      }, 5); // 400
    });

    it('hovered should destroy itself', (done) => {
      const dropdownTrigger = document.querySelector('#dropdownDestroyTrigger');
      M.Dropdown.getInstance(dropdownTrigger).destroy();
      M.Dropdown.init(dropdownTrigger, { hover: true });
      expect(() => {
        M.Dropdown.getInstance(dropdownTrigger).destroy();
      }).not.toThrow();
      //setTimeout(() => {
      done();
      //}, 400);
    });
  });
});
