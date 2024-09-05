describe('Scrollspy Plugin', () => {
  const fixture = `
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
      </div>
  `;
  let scrollspyInstances = [];

  beforeEach(() => {
    XloadHtml(fixture, { insertionType: 'prepend' });
    window.scrollTo(0, 0);
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, {});
  });

  afterEach(() => {
    scrollspyInstances.forEach((value) => value.destroy());
    XunloadFixtures();
  });

  function resetScrollspy(options) {
    options = options ? options : {};
    scrollspyInstances.forEach((value) => value.destroy());
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, options);
  }

  function clickLink(value) {
    document.querySelector(`a[href="#${value}"]`).click();
  }

  describe('Scrollspy basic test cases', () => {
    it('Test scrollspy smooth behavior positive case', (done) => {
      resetScrollspy({ behavior: 'smooth' });
      const viewportHeightPx = window.innerHeight;

      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(viewportHeightPx * 2);
        done();
      }, 900);
    });

    it('Test scrollspy smooth behavior negative case', (done) => {
      resetScrollspy({ behavior: 'smooth' });
      const viewportHeightPx = window.innerHeight;

      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop)
          .withContext("Scroll animation shouldn't reach the element in the given time")
          .toBeLessThan(viewportHeightPx * 2);
        done();
      }, 5);
    });
  });
});
