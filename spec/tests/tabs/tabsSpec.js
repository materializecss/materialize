describe('Tabs Plugin', () => {
  const fixture = `<div class="row">
  <div class="col s12">
    <ul class="tabs normal">
      <li class="tab col s3"><a href="#test1">Test 1</a></li>
      <li class="tab col s3"><a class="active" href="#test2">Test 2</a></li>
      <li class="tab col s3 disabled"><a href="#test3">Disabled Tab</a></li>
      <li class="tab col s3"><a href="#test4">Test 4</a></li>
      <li class="tab col s3"><a href="#test5">Test 4</a></li>
      <li class="tab col s3"><a href="#test6">Test 4</a></li>
      <li class="tab col s3"><a href="#test7">Test 4</a></li>
      <li class="tab col s3"><a href="#test8">Test 4</a></li>
    </ul>
  </div>
  <div id="test1" class="col s12">Test 1</div>
  <div id="test2" class="col s12">Test 2</div>
  <div id="test3" class="col s12">Test 3</div>
  <div id="test4" class="col s12">Test 4</div>
  <div id="test5" class="col s12">Test 1</div>
  <div id="test6" class="col s12">Test 2</div>
  <div id="test7" class="col s12">Test 3</div>
  <div id="test8" class="col s12">Test 4</div>
</div>`;

  beforeEach(() => {
    XloadHtml(fixture);
    const normalTabs = document.querySelector('.tabs.normal');
    M.Tabs.init(normalTabs, { duration: 0 });
    window.location.hash = '';
    //HACK the tabs init function not fully initializing. it restores state even after element has been removed from DOM, even after using tabInstance.destroy()
    M.Tabs.getInstance(normalTabs).select('test2');
  });
  afterEach(() => XunloadFixtures());

  describe('Tabs', () => {
    it('should open to active tab', () => {
      const normalTabs = document.querySelector('.tabs.normal');
      const activeTab = normalTabs.querySelector('.active');
      const activeTabHash = activeTab.getAttribute('href');
      const tabLinks = normalTabs.querySelectorAll('.tab a');
      for (let i = 0; i < tabLinks.length; i++) {
        const tabHash = tabLinks[i].getAttribute('href');
        if (tabHash === activeTabHash) {
          expect(document.querySelector(tabHash)).toBeVisible(
            'active tab content should be visible by default'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        } else {
          expect(document.querySelector(tabHash)).toBeHidden(
            'Tab content should be hidden by default'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        }
      }
      const indicator = normalTabs.querySelector('.indicator');
      expect(indicator).toExist('Indicator should be generated');
      // expect(Math.abs(indicator.offset().left - activeTab.offset().left)).toBeLessThan(1, 'Indicator should be at active tab by default.');
    });

    it('should switch to clicked tab', (done) => {
      const normalTabs = document.querySelector('.tabs.normal');
      const activeTab = normalTabs.querySelector('.active');
      const activeTabHash = activeTab.getAttribute('href');
      const disabledTab = normalTabs.querySelector('.disabled a');
      const disabledTabHash = disabledTab.getAttribute('href');
      const firstTab = normalTabs.querySelector('.tab a');
      const firstTabHash = firstTab.getAttribute('href');
      const indicator = normalTabs.querySelector('.indicator');
      expect(indicator).toExist('Indicator should be generated');
      // expect(Math.abs(indicator.offset().left - activeTab.offset().left)).toBeLessThan(1, 'Indicator should be at active tab by default.');
      click(disabledTab);
      setTimeout(() => {
        expect(document.querySelector(activeTabHash)).toBeVisible(
          'Clicking disabled should not change tabs.'
        ); //TODO replace with alternative for deprecated jasmine-jquery
        expect(document.querySelector(disabledTabHash)).toBeHidden(
          'Clicking disabled should not change tabs.'
        ); //TODO replace with alternative for deprecated jasmine-jquery

        click(firstTab);

        setTimeout(() => {
          expect(document.querySelector(activeTabHash)).toBeHidden(
            'Clicking tab should switch to that tab.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
          expect(document.querySelector(firstTabHash)).toBeVisible(
            'Clicking tab should switch to that tab.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
          expect(indicator.offsetLeft).toEqual(
            firstTab.offsetLeft,
            'Indicator should move to clicked tab.'
          );
          done();
        }, 10); // 400
      }, 10); // 400
    });

    it("shouldn't hide active tab if clicked while active", (done) => {
      const normalTabs = document.querySelector('.tabs.normal');
      const activeTab = normalTabs.querySelector('.active');
      const activeTabHash = activeTab.getAttribute('href');
      const indicator = normalTabs.querySelector('.indicator');
      expect(indicator).toExist('Indicator should be generated');
      click(activeTab);
      setTimeout(() => {
        expect(document.querySelector(activeTabHash)).toBeVisible(
          'Clicking active tab while active should not hide it.'
        );
        done();
      }, 5); // 400
    });

    it('should horizontally scroll when too many tabs', (done) => {
      let tabsScrollWidth = 0;
      const normalTabs = document.querySelector('.tabs.normal');
      normalTabs.style.width = '400px';
      const tabs = normalTabs.querySelectorAll('.tab');
      for (let i = 0; i < tabs.length; i++) {
        setTimeout(() => {
          tabsScrollWidth += tabs[i].offsetWidth;
        }, 0);
      }

      setTimeout(() => {
        expect(tabsScrollWidth).toBeGreaterThan(
          normalTabs.offsetWidth,
          'Scroll width should exceed tabs width'
        );
        done();
      }, 5); // 400
    });

    it('should programmatically switch tabs', (done) => {
      const normalTabs = document.querySelector('.tabs.normal');
      const activeTab = normalTabs.querySelector('.active');
      const activeTabHash = activeTab.getAttribute('href');
      const firstTab = normalTabs.querySelector('li a');
      const firstTabHash = firstTab.getAttribute('href');
      const indicator = normalTabs.querySelector('.indicator');
      const tabs = normalTabs.querySelectorAll('.tab a');
      for (let i = 0; i < tabs.length; i++) {
        const tabHash = tabs[i].getAttribute('href');
        if (tabHash === activeTabHash) {
          expect(document.querySelector(tabHash)).toBeVisible(
            'active tab content should be visible by default'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        } else {
          expect(document.querySelector(tabHash)).toBeHidden(
            'Tab content should be hidden by default'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        }
      }

      M.Tabs.getInstance(normalTabs).select('test1');

      setTimeout(() => {
        expect(document.querySelector(activeTabHash)).toBeHidden(
          'Clicking tab should switch to that tab.'
        ); //TODO replace with alternative for deprecated jasmine-jquery
        expect(document.querySelector(firstTabHash)).toBeVisible(
          'Clicking tab should switch to that tab.'
        ); //TODO replace with alternative for deprecated jasmine-jquery
        expect(indicator.offsetLeft).toEqual(
          firstTab.offsetLeft,
          'Indicator should move to clicked tab.'
        );
        done();
      }, 5); // 400
    });

    it("shouldn't error if tab has no associated content", (done) => {
      document.querySelector('#test8').remove();
      const tabNoContent = document.querySelector('[href="#test8"]');
      expect(tabNoContent).toNotHaveClass('active', 'Tab should not be selected');
      click(tabNoContent);
      setTimeout(() => {
        expect(tabNoContent).toHaveClass('active', 'Tab should be selected even with no content');
        done();
      }, 10); // 400
    });
  });
});
