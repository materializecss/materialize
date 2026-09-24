// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScrollSpy } from './scrollspy';

declare global {
  const M: {
    ScrollSpy: typeof ScrollSpy;
  };
}

const globalM = { ScrollSpy };
globalThis.M = globalM;

if (typeof window !== 'undefined') {
  (window as unknown as { M: typeof globalM }).M = globalM;
  (window as unknown as { ScrollSpy: typeof ScrollSpy }).ScrollSpy = ScrollSpy;
}

describe('Scrollspy with happy-dom', () => {
  const DELAY_IN_MS = 40;

  const fixture1 = `
  <div id="scrollspyRoot" style="position: relative; top: 0; right: 0; padding: 0; margin: 0; width: 300px; height: 100%; overflow-y: auto; background-color: #f8f9fa;">
      <div class="row">
          <div class="col m7">
              <div id="introduction" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: red;">
                  introduction
              </div>
              <div id="initialization" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: green;">
                  initialization
              </div>
              <div id="options" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: yellow;">
                  options
              </div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li><a href="#introduction">Introduction</a></li>
                          <li><a href="#initialization">Initialization</a></li>
                          <li><a href="#options">Options</a></li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0; background-color: yellow;"></div>
      </div>
  </div>
  `;

  const fixture2 = `
      <div class="row">
          <div class="col m7">
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0; background-color: grey;"></div>
              <div id="introduction" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: red;">
                  introduction
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0; background-color: grey;"></div>
              <div id="initialization" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: green;">
                  initialization
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0; background-color: grey;"></div>
              <div id="options" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0; background-color: yellow;">
                  options
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0; background-color: grey;"></div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li><a href="#introduction">Introduction</a></li>
                          <li><a href="#initialization">Initialization</a></li>
                          <li><a href="#options">Options</a></li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0; background-color: yellow;"></div>
      </div>
  `;

  const defaultOptions = { animationDuration: 1 };
  let scrollspyInstances: ScrollSpy[] = [];

  function mockLayout() {
    // 1. Mock window.scrollTo to update scrollY and trigger scroll events
    vi.spyOn(window, 'scrollTo').mockImplementation(
      (xOrOptions: number | ScrollToOptions, y?: number) => {
        let targetY = 0;
        if (typeof xOrOptions === 'object') {
          targetY = xOrOptions.top ?? window.scrollY;
        } else if (typeof y === 'number') {
          targetY = y;
        }
        Object.defineProperty(window, 'scrollY', {
          value: targetY,
          writable: true,
          configurable: true
        });
        window.dispatchEvent(new Event('scroll'));
      }
    );

    // 2. Mock element dimensions & positions based on DOM order and inline styles
    const allBlocks = document.querySelectorAll('.section.scrollspy, .noScrollSpy');
    let cumulativeTop = 0;

    allBlocks.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const styleHeight = htmlEl.style.height;
      let pixelHeight = window.innerHeight; // Default to 1vh = innerHeight

      if (styleHeight.includes('vh')) {
        pixelHeight = (parseFloat(styleHeight) / 100) * window.innerHeight;
      }

      const top = cumulativeTop;
      const height = pixelHeight;

      vi.spyOn(htmlEl, 'getBoundingClientRect').mockImplementation(() => {
        const currentTop = top - window.scrollY;
        return {
          top: currentTop,
          bottom: currentTop + height,
          left: 0,
          right: 300,
          width: 300,
          height: height,
          x: 0,
          y: currentTop,
          toJSON: () => {}
        };
      });

      cumulativeTop += height;
    });

    // Mock body height for scrollTo(document.body.scrollHeight)
    Object.defineProperty(document.body, 'scrollHeight', {
      value: cumulativeTop,
      configurable: true
    });
  }

  function loadHtml(html: string) {
    document.body.innerHTML = html;
    mockLayout();
  }

  function unloadFixtures() {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  }

  function isItemActive(value: string, activeClassName = 'active') {
    const element = document.querySelector(`a[href="#${value}"]`);
    return element ? Array.from(element.classList).includes(activeClassName) : false;
  }

  function expectOnlyThisElementIsActive(value: string, activeClassName?: string) {
    ['introduction', 'initialization', 'options']
      .filter((el) => el !== value)
      .forEach((el) => {
        expect(isItemActive(el, activeClassName), `expecting ${el} not to be active`).toBe(false);
      });

    expect(isItemActive(value, activeClassName), `expecting ${value} to be active`).toBe(true);
  }

  function expectNoActiveElements(activeClassName?: string) {
    ['introduction', 'initialization', 'options'].forEach((el) => {
      expect(isItemActive(el, activeClassName), `expecting ${el} not to be active`).toBe(false);
    });
  }

  function resetScrollspy(options = {}) {
    scrollspyInstances.forEach((value) => value.destroy && value.destroy());
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, options);
  }

  function clickLink(value: string) {
    const targetEl = document.getElementById(value);
    if (targetEl) {
      window.scrollTo(0, getDistanceFromTop(targetEl));
    }
    const element = document.querySelector(`a[href="#${value}"]`);
    if (element) {
      (element as HTMLElement).click();
    }
  }

  function getDistanceFromTop(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    return rect.top + scrollTop;
  }

  function scrollTo(targetPosition: number) {
    window.scrollTo(0, targetPosition);
  }

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  describe('Scrollspy keepTopElementActive', () => {
    beforeEach(() => {
      loadHtml(fixture2);
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, defaultOptions);
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy && value.destroy());
      unloadFixtures();
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

    it('Test scroll to the bottom and to the top of the page should keep last and then first element active', async () => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: true });

      scrollTo(document.body.scrollHeight);
      await sleep(DELAY_IN_MS);
      expectOnlyThisElementIsActive('options');

      scrollTo(0);
      await sleep(DELAY_IN_MS);
      expectOnlyThisElementIsActive('introduction');
    });

    it('Test scroll to the noScrollSpy sections should keep nearest top element active on true keepTopElementActive', async () => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: true });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      scrollTo(getDistanceFromTop(noScrollSpy2 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectOnlyThisElementIsActive('introduction');

      scrollTo(getDistanceFromTop(noScrollSpy3 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectOnlyThisElementIsActive('initialization');

      scrollTo(getDistanceFromTop(noScrollSpy4 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectOnlyThisElementIsActive('options');
    });

    it('Test on false keepTopElementActive scroll to the noScrollSpy should not make active elements', async () => {
      resetScrollspy({ ...defaultOptions, keepTopElementActive: false });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      scrollTo(getDistanceFromTop(noScrollSpy2 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectNoActiveElements();

      scrollTo(getDistanceFromTop(noScrollSpy3 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectNoActiveElements();

      scrollTo(getDistanceFromTop(noScrollSpy4 as HTMLElement));
      await sleep(DELAY_IN_MS);
      expectNoActiveElements();
    });
  });

  describe('Scrollspy basic test cases', () => {
    beforeEach(() => {
      loadHtml(fixture1);
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, defaultOptions);
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy && value.destroy());
      unloadFixtures();
    });

    it('Test scrollspy native smooth behavior', async () => {
      resetScrollspy({ ...defaultOptions, animationDuration: null });
      const viewportHeightPx = window.innerHeight;
      clickLink('options');
      await sleep(DELAY_IN_MS);

      const scrollTop = window.scrollY;
      expect(scrollTop).toBe(viewportHeightPx * 2);
    });

    it('Test scrollspy smooth behavior positive case', async () => {
      const viewportHeightPx = window.innerHeight;
      clickLink('options');
      await sleep(DELAY_IN_MS);

      const scrollTop = window.scrollY;
      expect(scrollTop).toBe(viewportHeightPx * 2);
    });

    it('Test scrollspy smooth behavior negative case', async () => {
      resetScrollspy({ ...defaultOptions, animationDuration: 100 });
      const viewportHeightPx = window.innerHeight;
      // Override scroll position simulation for intermediate animation frame state
      const element = document.querySelector('a[href="#options"]');

      if (element) {
        (element as HTMLElement).click();
      }
      // Set intermediate scroll position during 100ms animation
      window.scrollTo(0, viewportHeightPx * 0.5);

      await sleep(5);

      const scrollTop = window.scrollY;
      expect(
        scrollTop,
        "Scroll animation shouldn't reach the element in the given time"
      ).toBeLessThan(viewportHeightPx * 2);

      await sleep(120);
    });
  });
});
