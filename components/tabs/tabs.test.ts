// @vitest-environment happy-dom
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Tabs } from './tabs.ts';

// Helper utility for async delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Tabs Plugin', () => {
  const fixture = `<div class="row">
    <div class="col s12">
      <ul class="tabs normal">
        <li class="tab col s3"><a href="#test1">Test 1</a></li>
        <li class="tab col s3"><a class="active" href="#test2">Test 2</a></li>
        <li class="tab col s3 disabled"><a href="#test3">Disabled Tab</a></li>
        <li class="tab col s3"><a href="#test4">Test 4</a></li>
        <li class="tab col s3"><a href="#test5">Test 5</a></li>
        <li class="tab col s3"><a href="#test6">Test 6</a></li>
        <li class="tab col s3"><a href="#test7">Test 7</a></li>
        <li class="tab col s3"><a href="#test8">Test 8</a></li>
      </ul>
    </div>
    <div id="test1" class="col s12">Test 1</div>
    <div id="test2" class="col s12">Test 2</div>
    <div id="test3" class="col s12">Test 3</div>
    <div id="test4" class="col s12">Test 4</div>
    <div id="test5" class="col s12">Test 5</div>
    <div id="test6" class="col s12">Test 6</div>
    <div id="test7" class="col s12">Test 7</div>
    <div id="test8" class="col s12">Test 8</div>
  </div>`;

  let container: HTMLDivElement;

  beforeEach(() => {
    // Mount fixture
    container = document.createElement('div');
    container.innerHTML = fixture;
    document.body.appendChild(container);

    const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
    Tabs.init(normalTabs, { duration: 0 });
    window.location.hash = '';

    // Force selection of test2 as active tab
    Tabs.getInstance(normalTabs)?.select('test2');
  });

  afterEach(() => {
    const normalTabs = document.querySelector<HTMLElement>('.tabs.normal');
    if (normalTabs) {
      Tabs.getInstance(normalTabs)?.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('Tabs', () => {
    it('should open to active tab', () => {
      const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
      const activeTab = normalTabs.querySelector<HTMLAnchorElement>('.active')!;
      const activeTabHash = activeTab.getAttribute('href')!;
      const tabLinks = normalTabs.querySelectorAll<HTMLAnchorElement>('.tab a');

      tabLinks.forEach((tabLink) => {
        const tabHash = tabLink.getAttribute('href')!;
        const contentEl = document.querySelector<HTMLElement>(tabHash)!;

        if (tabHash === activeTabHash) {
          expect(contentEl.style.display).not.toBe('none');
        } else {
          expect(contentEl.style.display).toBe('none');
        }
      });

      const indicator = normalTabs.querySelector('.indicator');
      expect(indicator).not.toBeNull();
    });

    it('should switch to clicked tab', async () => {
      const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
      const activeTab = normalTabs.querySelector<HTMLAnchorElement>('.active')!;
      const activeTabHash = activeTab.getAttribute('href')!;
      const disabledTab = normalTabs.querySelector<HTMLAnchorElement>('.disabled a')!;
      const disabledTabHash = disabledTab.getAttribute('href')!;
      const firstTab = normalTabs.querySelector<HTMLAnchorElement>('.tab a')!;
      const firstTabHash = firstTab.getAttribute('href')!;
      const indicator = normalTabs.querySelector<HTMLElement>('.indicator')!;

      expect(indicator).not.toBeNull();

      // Click disabled tab
      disabledTab.click();
      await delay(10);

      const activeContent = document.querySelector<HTMLElement>(activeTabHash)!;
      const disabledContent = document.querySelector<HTMLElement>(disabledTabHash)!;

      expect(activeContent.style.display).not.toBe('none');
      expect(disabledContent.style.display).toBe('none');

      // Click first tab
      firstTab.click();
      await delay(10);

      const firstContent = document.querySelector<HTMLElement>(firstTabHash)!;

      expect(activeContent.style.display).toBe('none');
      expect(firstContent.style.display).not.toBe('none');
      expect(indicator.offsetLeft).toBe(firstTab.offsetLeft);
    });

    it("shouldn't hide active tab if clicked while active", async () => {
      const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
      const activeTab = normalTabs.querySelector<HTMLAnchorElement>('.active')!;
      const activeTabHash = activeTab.getAttribute('href')!;
      const indicator = normalTabs.querySelector('.indicator');

      expect(indicator).not.toBeNull();

      activeTab.click();
      await delay(10);

      const activeContent = document.querySelector<HTMLElement>(activeTabHash)!;
      expect(activeContent.style.display).not.toBe('none');
    });

    it('should horizontally scroll when too many tabs', () => {
      const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
      const tabsInstance = Tabs.getInstance(normalTabs);
      // Mock container visible width (400px) and total scroll width (800px)
      vi.spyOn(normalTabs, 'getBoundingClientRect').mockReturnValue({
        width: 400,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 400,
        x: 0,
        y: 0,
        toJSON: () => {}
      });
      Object.defineProperty(normalTabs, 'scrollWidth', {
        configurable: true,
        value: 800
      });
      // Trigger recalculation
      tabsInstance._setTabsAndTabWidth();
      // Verify internal width state
      expect(normalTabs.scrollWidth).toBeGreaterThan(tabsInstance._tabsWidth);
      expect(tabsInstance._tabWidth).toBe(100); // 800px scrollWidth / 8 tabs
    });

    it('should programmatically switch tabs', async () => {
      const normalTabs = document.querySelector<HTMLElement>('.tabs.normal')!;
      const activeTab = normalTabs.querySelector<HTMLAnchorElement>('.active')!;
      const activeTabHash = activeTab.getAttribute('href')!;
      const firstTab = normalTabs.querySelector<HTMLAnchorElement>('li a')!;
      const firstTabHash = firstTab.getAttribute('href')!;
      const indicator = normalTabs.querySelector<HTMLElement>('.indicator')!;
      const tabs = normalTabs.querySelectorAll<HTMLAnchorElement>('.tab a');

      tabs.forEach((tab) => {
        const tabHash = tab.getAttribute('href')!;
        const contentEl = document.querySelector<HTMLElement>(tabHash)!;

        if (tabHash === activeTabHash) {
          expect(contentEl.style.display).not.toBe('none');
        } else {
          expect(contentEl.style.display).toBe('none');
        }
      });

      Tabs.getInstance(normalTabs)?.select('test1');
      await delay(10);

      const activeContent = document.querySelector<HTMLElement>(activeTabHash)!;
      const firstContent = document.querySelector<HTMLElement>(firstTabHash)!;

      expect(activeContent.style.display).toBe('none');
      expect(firstContent.style.display).not.toBe('none');
      expect(indicator.offsetLeft).toBe(firstTab.offsetLeft);
    });

    it("shouldn't error if tab has no associated content", async () => {
      document.querySelector('#test8')?.remove();

      const tabNoContent = document.querySelector<HTMLAnchorElement>('[href="#test8"]')!;
      expect(tabNoContent.classList.contains('active')).toBe(false);

      tabNoContent.click();
      await delay(10);

      expect(tabNoContent.classList.contains('active')).toBe(true);
    });
  });
});
