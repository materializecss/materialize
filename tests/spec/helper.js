const fixturesCache = {};
const containerId = 'xjasmine-fixtures';
const fixturesPath = 'http://localhost:9001/tests/spec';

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

async function XloadFixtures(fixtureUrls) {
  // console.log(JSON.stringify(fixturesCache))
  //should save and restore the body element, not just the container
  let oldcontainer = document.getElementById(containerId);
  // console.log("body before clear", document.body.innerHTML);
  if (oldcontainer) {
    oldcontainer.parentNode.removeChild(oldcontainer);
    oldcontainer = null;
  }
  // console.log("body after clear", document.body.innerHTML);
  const htmlChunks = [];
  for (let i = 0; i < fixtureUrls.length; i++) {
    const url = fixturesPath + '/' + fixtureUrls[i];
    if (fixturesCache[url] === undefined) {
      const response = await fetch(url);
      fixturesCache[url] = await response.text();
    }
    htmlChunks.push(fixturesCache[url]);
  }
  const container = document.createElement('div');
  container.id = containerId;
  container.innerHTML = htmlChunks.join('');

  // console.log("body before append", document.body.innerHTML);
  document.body.appendChild(container);
  // console.log("body after append", document.body.innerHTML);
}

function XunloadFixtures() {
  let oldcontainer = document.getElementById(containerId);
  // console.log("body before clear", document.body.innerHTML);
  if (oldcontainer) {
    oldcontainer.parentNode.removeChild(oldcontainer);
    oldcontainer = null;
  }

  //the container leaks. Lots of code moves elements around to different parent containers. These must be cleaned up.
  let c = document.body.children;
  let scriptCount = 0;
  for (let i = 0; i < c.length; i++) {
    const elt = c[i];
    if (elt.tagName === 'SCRIPT' || elt.classList[0] === 'jasmine_html-reporter') {
      scriptCount++;
    }
  }
  while (c.length > scriptCount) {
    for (let i = 0; i < c.length; i++) {
      const elt = c[i];
      if (elt.tagName !== 'SCRIPT' && elt.classList[0] !== 'jasmine_html-reporter') {
        document.body.removeChild(elt);
      }
    }
    c = document.body.children;
  }
}

beforeEach(function () {
  let matchers = {
    toExist: function (util, customEqualityTesters) {
      return {
        compare: function (actual) {
          let result = {};
          result.pass = util.equals(!!actual, true, customEqualityTesters);
          return result;
        }
      };
    },

    hasMaxHeightZero: function (util, customEqualityTesters) {
      return {
        compare: function (actual) {
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

    notHasMaxHeightZero: function (util, customEqualityTesters) {
      return {
        compare: function (actual) {
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

    toBeHidden: function (util, customEqualityTesters) {
      return {
        compare: function (actual) {
          const style = getComputedStyle(actual);
          let result = {};
          result.pass = util.equals(
            style.getPropertyValue('display'),
            'none',
            customEqualityTesters
          );
          return result;
        }
      };
    },

    toBeVisible: function (util, customEqualityTesters) {
      return {
        compare: function (actual) {
          const style = getComputedStyle(actual);
          let result = {};
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
    toHaveClass: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          let result = {};
          result.pass = util.equals(
            actual.classList.contains(expected),
            true,
            customEqualityTesters
          );

          return result;
        }
      };
    },
    toNotHaveClass: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          let result = {};
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
  window.click = function (elem) {
    let evt = document.createEvent('MouseEvent');
    evt.initMouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    elem.dispatchEvent(evt);
  };

  window.mouseenter = function (el) {
    let ev = document.createEvent('MouseEvent');
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

  window.mouseleave = function (el) {
    let ev = document.createEvent('MouseEvent');
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

  window.keydown = function (targetElement, keycode) {
    targetElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: KEYMAP[keycode],
        keyCode: keycode,
        which: keycode
      })
    );
  };

  window.keyup = function (targetElement, keycode) {
    targetElement.dispatchEvent(
      new KeyboardEvent('keyup', {
        key: KEYMAP[keycode],
        keyCode: keycode,
        which: keycode
      })
    );
  };

  window.focus = function (el) {
    let ev = document.createEvent('Events');
    ev.initEvent('focus', true, true);
    el.dispatchEvent(ev);
  };

  window.blur = function (el) {
    let ev = document.createEvent('Events');
    ev.initEvent('blur', true, true);
    el.dispatchEvent(ev);
  };
});
