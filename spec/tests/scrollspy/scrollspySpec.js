describe('Scrollspy', () => {
  const DELAY_IN_MS = 40;
  const fixture1 = `
  <div id="scrollspyRoot" style="
          position: relative;
          top: 0;
          right: 0;
          padding: 0;
          margin: 0;
          width: 300px;
          height: 100%;
          overflow-y: auto;
          background-color: #f8f9fa;
          ">
      <div class="row">
          <div class="col m7">
              <div id="introduction" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: red;">
                  introduction
              </div>
              <div id="initialization" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: green;">
                  initialization
              </div>
              <div id="options" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;">
                  options
              </div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li>
                              <a href="#introduction" class="">Introduction</a>
                          </li>
                          <li>
                              <a href="#initialization" class="">Initialization</a>
                          </li>
                          <li>
                              <a href="#options" class="">Options</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;" />
      </div>
  </div>
  `;
  const fixture2 = `
      <div class="row">
          <div class="col m7">
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="introduction" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: red;">
                  introduction
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="initialization" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: green;">
                  initialization
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="options" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;">
                  options
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li>
                              <a href="#introduction" class="">Introduction</a>
                          </li>
                          <li>
                              <a href="#initialization" class="">Initialization</a>
                          </li>
                          <li>
                              <a href="#options" class="">Options</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;" />
      </div>
  `;
  const defaultOptions = { animationDuration: 1 };
  let scrollspyInstances = [];

  function isItemActive(value, activeClassName) {
    activeClassName = activeClassName ? activeClassName : 'active';
    const element = document.querySelector(`a[href="#${value}"]`);
    return Array.from(element.classList).includes(activeClassName);
  }

  function expectOnlyThisElementIsActive(value, activeClassName) {
    ['introduction', 'initialization', 'options']
      .filter((el) => el !== value)
      .forEach((el) =>
        expect(isItemActive(el, activeClassName))
          .withContext(`expecting ${el} not to be active`)
          .toBeFalse()
      );

    expect(isItemActive(value, activeClassName))
      .withContext(`expecting ${value} to be active`)
      .toBeTrue();
  }

  function expectNoActiveElements(activeClassName) {
    ['introduction', 'initialization', 'options'].forEach((el) =>
      expect(isItemActive(el, activeClassName))
        .withContext(`expecting ${el} not to be active`)
        .toBeFalse()
    );
  }

  function resetScrollspy(options) {
    options = options ? options : {};
    scrollspyInstances.forEach((value) => value.destroy());
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, options);
  }

  function clickLink(value) {
    document.querySelector(`a[href="#${value}"]`).click();
  }

  function getDistanceFromTop(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const distanceFromTop = rect.top + scrollTop;

    return distanceFromTop;
  }

  function scrollTo(targetPosition) {
    window.scrollTo(0, targetPosition);
  }

  describe('Scrollspy with keepTopElementActive flag test cases', () => {
    beforeEach(() => {
      XloadHtml(fixture2, { insertionType: 'prepend' });
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, defaultOptions);
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy());
      XunloadFixtures();
    });

    it('Test click on table of contents element for scrollspy with instant animationDuration', (done) => {
      resetScrollspy({ animationDuration: 0, keepTopElementActive: true });
      clickLink('options');
      setTimeout(() => {
        expectOnlyThisElementIsActive('introduction');
        done();
      }, DELAY_IN_MS);
    });

    it('Test first element is active on true keepTopElementActive even if the elements are much lower down on the page', () => {
      resetScrollspy({ keepTopElementActive: true });
      expectOnlyThisElementIsActive('introduction');
    });

    it('Test default keepTopElementActive value if false', () => {
      expectNoActiveElements();
    });

    it('Test no active elements on false keepTopElementActive if the elements are much lower down on the page', () => {
      resetScrollspy({ keepTopElementActive: false });
      expectNoActiveElements();
    });

    it('Test scroll to the bottom and to the top of the page should keep last and then first element active', (done) => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: true });

      scrollTo(document.body.scrollHeight);
      setTimeout(() => {
        expectOnlyThisElementIsActive('options');
        scrollTo(0);
        setTimeout(() => {
          expectOnlyThisElementIsActive('introduction');
          done();
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test scroll to the noScrollSpy sections should keep nearest top element active on true keepTopElementActive', (done) => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: true });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      scrollTo(getDistanceFromTop(noScrollSpy2));
      setTimeout(() => {
        expectOnlyThisElementIsActive('introduction');
        scrollTo(getDistanceFromTop(noScrollSpy3));
        setTimeout(() => {
          expectOnlyThisElementIsActive('initialization');
          scrollTo(getDistanceFromTop(noScrollSpy4));
          setTimeout(() => {
            expectOnlyThisElementIsActive('options');
            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test on false keepTopElementActive scroll to the noScrollSpy should not make active elements', (done) => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: false });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      scrollTo(getDistanceFromTop(noScrollSpy2));
      setTimeout(() => {
        expectNoActiveElements();

        scrollTo(getDistanceFromTop(noScrollSpy3));
        setTimeout(() => {
          expectNoActiveElements();

          scrollTo(getDistanceFromTop(noScrollSpy4));
          setTimeout(() => {
            expectNoActiveElements();
            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });
  });

  describe('Scrollspy basic test cases', () => {
    beforeEach(() => {
      XloadHtml(fixture1, { insertionType: 'prepend' });
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, defaultOptions);
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy());
      XunloadFixtures();
    });

    it('Test scrollspy native smooth behavior', (done) => {
      resetScrollspy({ ...defaultOptions, animationDuration: null });
      const viewportHeightPx = window.innerHeight;

      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(viewportHeightPx * 2);
        done();
      }, 800);
    });

    it('Test scrollspy smooth behavior positive case', (done) => {
      const viewportHeightPx = window.innerHeight;

      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(viewportHeightPx * 2);
        done();
      }, DELAY_IN_MS);
    });

    it('Test scrollspy smooth behavior negative case', (done) => {
      resetScrollspy({ ...defaultOptions, animationDuration: 100 });
      const viewportHeightPx = window.innerHeight;
      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop)
          .withContext("Scroll animation shouldn't reach the element in the given time")
          .toBeLessThan(viewportHeightPx * 2);
        setTimeout(() => {
          done();
        }, 120);
      }, 5);
    });

    it('Test click on an item in the table of contents should make item active', (done) => {
      clickLink('introduction');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(window.innerHeight * 0);
        expectOnlyThisElementIsActive('introduction');

        clickLink('initialization');
        setTimeout(() => {
          const scrollTop = window.scrollY;
          expect(scrollTop).toBe(window.innerHeight * 1);
          expectOnlyThisElementIsActive('initialization');

          clickLink('options');
          setTimeout(() => {
            const scrollTop = window.scrollY;
            expect(scrollTop).toBe(window.innerHeight * 2);
            expectOnlyThisElementIsActive('options');

            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test click on an item in the table of contents should make item active with explicit class', (done) => {
      resetScrollspy({ ...defaultOptions, activeClass: 'otherActiveExample' });

      clickLink('options');
      setTimeout(() => {
        expectNoActiveElements('active');
        expectOnlyThisElementIsActive('options', 'otherActiveExample');
        done();
      }, DELAY_IN_MS);
    });

    it('Test explicit getActiveElement implementation', (done) => {
      const customGetActiveElement = (id) => {
        const selector = 'div#testContainerId';
        const testDivElement = document.querySelector(selector);
        testDivElement.textContent = id;
        return selector;
      };
      resetScrollspy({
        ...defaultOptions,
        getActiveElement: customGetActiveElement,
        animationDuration: 100
      });

      clickLink('options');
      setTimeout(() => {
        expectNoActiveElements();

        const element = document.querySelector('div#testContainerId');
        expect(element.textContent).toBe('options');
        expect(Array.from(element.classList)).toEqual(['active']);
        done();
      }, 120);
    });
  });
});
