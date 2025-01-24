const KEYMAP = {
  '27': 'Escape',
  '32': 'Space',
  '13': 'Enter',
  '37': 'Left',
  '39': 'Right',
  '38': 'Up',
  '40': 'Down',
  '8': 'Backspace',
  '9': 'Tab',
  '16': 'Shift',
  '17': 'Control',
  '18': 'Alt',
  '19': 'Pause',
  '20': 'Capslock',
  '160': 'LeftShift',
  '161': 'RightShift',
  '162': 'LeftControl',
  '163': 'RightControl',
  '164': 'LeftAlt',
  '165': 'RightAlt',
  '91': 'Windows',
  '92': 'RightWindows',
  '33': 'PageUp',
  '34': 'PageDown',
  '35': 'End',
  '36': 'Home',
  '44': 'PrintScreen',
  '45': 'Insert',
  '46': 'Delete',
  '145': 'ScrollLock',
  '186': 'Semicolon',
  '187': 'Equals',
  '188': 'Comma',
  '189': 'Underscore',
  '190': 'Period',
  '191': 'Slash',
  '192': 'Tilde',
  '219': 'OpenBracket',
  '220': 'BackSlash',
  '221': 'CloseBracket',
  '222': 'Quote',
  '65': 'A',
  '66': 'B',
  '67': 'C',
  '68': 'D',
  '69': 'E',
  '70': 'F',
  '71': 'G',
  '72': 'H',
  '73': 'I',
  '74': 'J',
  '75': 'K',
  '76': 'L',
  '77': 'M',
  '78': 'N',
  '79': 'O',
  '80': 'P',
  '81': 'Q',
  '82': 'R',
  '83': 'S',
  '84': 'T',
  '85': 'U',
  '86': 'V',
  '87': 'W',
  '88': 'X',
  '89': 'Y',
  '90': 'Z',
  '48': 'D0',
  '49': 'D1',
  '50': 'D2',
  '51': 'D3',
  '52': 'D4',
  '53': 'D5',
  '54': 'D6',
  '55': 'D7',
  '56': 'D8',
  '57': 'D9',
  '112': 'F1',
  '113': 'F2',
  '114': 'F3',
  '115': 'F4',
  '116': 'F5',
  '117': 'F6',
  '118': 'F7',
  '119': 'F8',
  '120': 'F9',
  '121': 'F10',
  '122': 'F11',
  '123': 'F12',
  '124': 'F13',
  '125': 'F14',
  '126': 'F15',
  '127': 'F16',
  '128': 'F17',
  '129': 'F18',
  '130': 'F19',
  '131': 'F20',
  '132': 'F21',
  '133': 'F22',
  '134': 'F23',
  '135': 'F24',
  '144': 'Numlock',
  '111': 'Divide',
  '106': 'Multiply',
  '107': 'Add',
  '109': 'Subtract',
  '110': 'NumpadDelete',
  '96': '0',
  '97': '1',
  '98': '2',
  '99': '3',
  '100': '4',
  '101': '5',
  '102': '6',
  '103': '7',
  '104': '8',
  '105': '9'
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function XloadHtml(html, options) {
  options = options ? options : {};
  const defaultOptions = { insertionType: 'append' };
  options = {
    ...defaultOptions,
    ...options
  };
  const div = document.createElement('div');
  div.classList.add('please-delete-me');
  div.innerHTML = html;
  if (options.insertionType === 'append') {
    document.body.appendChild(div);
  } else if (options.insertionType === 'prepend') {
    document.body.prepend(div);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function XunloadFixtures() {
  document.querySelectorAll('.please-delete-me').forEach((el) => el.remove());
  document.querySelectorAll('.material-tooltip').forEach((el) => el.remove());
  document.querySelectorAll('.dropdown-content').forEach((el) => el.remove());
}

beforeEach(() => {
  const matchers = {
    toExist: (util, customEqualityTesters) => {
      return {
        compare: (actual) => {
          const result = {};
          result.pass = util.equals(!!actual, true, customEqualityTesters);
          return result;
        }
      };
    },
    hasMaxHeightZero: (util, customEqualityTesters) => {
      return {
        compare: (actual) => {
          const style = getComputedStyle(actual);
          const result = {};
          result.pass = util.equals(
            style.getPropertyValue('max-height'),
            '0px',
            customEqualityTesters
          );
          return result;
        }
      };
    },
    notHasMaxHeightZero: (util, customEqualityTesters) => {
      return {
        compare: (actual) => {
          const style = getComputedStyle(actual);
          const result = {};
          result.pass = !util.equals(
            style.getPropertyValue('max-height'),
            '0px',
            customEqualityTesters
          );
          return result;
        }
      };
    },
    toBeHidden: (util, customEqualityTesters) => {
      return {
        compare: (actual) => {
          const style = getComputedStyle(actual);
          const result = {};
          result.pass = util.equals(
            style.getPropertyValue('display'),
            'none',
            customEqualityTesters
          );
          return result;
        }
      };
    },
    toBeVisible: (util, customEqualityTesters) => {
      return {
        compare: (actual) => {
          const style = getComputedStyle(actual);
          const result = {};
          result.pass = !util.equals(
            style.getPropertyValue('display'),
            'none',
            customEqualityTesters
          );
          if (result.pass) {
            result.pass = util.equals(
              style.getPropertyValue('visibility'),
              'visible',
              customEqualityTesters
            );
          }
          return result;
        }
      };
    },
    toHaveClass: (util, customEqualityTesters) => {
      return {
        compare: (actual, expected) => {
          const result = {};
          result.pass = util.equals(
            actual.classList.contains(expected),
            true,
            customEqualityTesters
          );
          return result;
        }
      };
    },
    toNotHaveClass: (util, customEqualityTesters) => {
      return {
        compare: function (actual, expected) {
          const result = {};
          result.pass = util.equals(
            actual.classList.contains(expected),
            false,
            customEqualityTesters
          );
          return result;
        }
      };
    }
  };

  jasmine.addMatchers(matchers);

  /**
   * Creates standard click event on DOM element
   */
  window.click = (elem) => {
    const evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    elem.dispatchEvent(evt);
  };

  window.mouseenter = (el) => {
    const ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
      'mouseenter',
      true /* bubble */,
      true /* cancelable */,
      window,
      null,
      0,
      0,
      0,
      0 /* coordinates */,
      false,
      false,
      false,
      false /* modifier keys */,
      0 /*left*/,
      null
    );
    el.dispatchEvent(ev);
  };

  window.mouseleave = (el) => {
    const ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(
      'mouseleave',
      true /* bubble */,
      true /* cancelable */,
      window,
      null,
      0,
      0,
      0,
      0 /* coordinates */,
      false,
      false,
      false,
      false /* modifier keys */,
      0 /*left*/,
      null
    );
    el.dispatchEvent(ev);
  };

  window.keydown = (targetElement, keycode) => {
    targetElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: KEYMAP[keycode],
        keyCode: keycode,
        which: keycode
      })
    );
  };

  window.keyup = (targetElement, keycode) => {
    targetElement.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: KEYMAP[keycode],
        keyCode: keycode,
        which: keycode
      })
    );
  };

  window.focus = (el) => {
    const ev = document.createEvent('Events');
    ev.initEvent('focus', true, true);
    el.dispatchEvent(ev);
  };

  window.blur = (el) => {
    const ev = document.createEvent('Events');
    ev.initEvent('blur', true, true);
    el.dispatchEvent(ev);
  };
});
