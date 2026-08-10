// @vitest-environment happy-dom
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Collapsible } from './collapsible';

// Helper function to simulate clicking an element
function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

// Helper to handle timeouts cleanly with async/await
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('Collapsible Plugin:', () => {
  let collapsible: NodeListOf<HTMLElement>;
  let accordion: HTMLElement;
  let popout: HTMLElement;
  let expandable: HTMLElement;
  let expandablePreselect: HTMLElement;

  const fixture = `
<ul class="collapsible expandable">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>

<ul class="collapsible expandable-preselected">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li class="active">
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>

<ul class="collapsible accordion">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>

<ul class="collapsible popout">
  <li style="margin-left: 24px; margin-right: 24px;">
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li style="margin-left: 24px; margin-right: 24px;">
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li style="margin-left: 24px; margin-right: 24px;">
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>`;

  beforeEach(() => {
    document.body.innerHTML = fixture;

    collapsible = document.querySelectorAll<HTMLElement>('.collapsible');
    expandable = document.querySelector<HTMLElement>('.expandable')!;
    expandablePreselect = document.querySelector<HTMLElement>('.expandable-preselected')!;
    accordion = document.querySelector<HTMLElement>('.accordion')!;
    popout = document.querySelector<HTMLElement>('.popout')!;

    // Mock scrollHeight for virtual DOM environment
    document.querySelectorAll<HTMLElement>('.collapsible-body').forEach((body) => {
      Object.defineProperty(body, 'scrollHeight', {
        configurable: true,
        value: 100
      });
    });

    Collapsible.init(Array.from(collapsible), { inDuration: 0, outDuration: 0 });
    Collapsible.init(expandable, { accordion: false, inDuration: 0, outDuration: 0 });
    Collapsible.init(expandablePreselect, { accordion: false, inDuration: 0, outDuration: 0 });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('collapsible', () => {
    it('should open all items, keeping all open', async () => {
      const headers = expandable.querySelectorAll<HTMLElement>('.collapsible-header');
      const bodies = expandable.querySelectorAll<HTMLElement>('.collapsible-body');

      // Collapsible body height should be 0 on start when hidden.
      bodies.forEach((body) => {
        expect(body.style.maxHeight).toBe('');
      });

      // Open all items
      headers.forEach((header) => click(header));

      await wait(10);

      // Collapsible body height should be > 0 after being opened.
      bodies.forEach((body) => {
        expect(body.style.maxHeight).toBe('100px');
      });
    });

    it('should allow preopened sections', () => {
      const bodies = expandablePreselect.querySelectorAll<HTMLElement>('.collapsible-body');

      bodies.forEach((body, i) => {
        const headerLi = body.parentNode as HTMLElement;

        if (i === 1) {
          expect(headerLi.classList.contains('active')).toBe(true);
          expect(body.style.maxHeight).toBe('100px');
        } else {
          expect(body.style.maxHeight).not.toBe('100px');
        }
      });
    });

    it('should open and close programmatically with callbacks', async () => {
      const openCallback = vi.fn();
      const closeCallback = vi.fn();

      Collapsible.init(expandable, {
        accordion: false,
        onOpenStart: openCallback,
        onCloseStart: closeCallback,
        inDuration: 0,
        outDuration: 0
      });

      const bodies = expandable.querySelectorAll<HTMLElement>('.collapsible-body');

      expect(openCallback).not.toHaveBeenCalled();
      expect(closeCallback).not.toHaveBeenCalled();

      bodies.forEach((body, i) => {
        const instance = Collapsible.getInstance(body.closest('.collapsible') as HTMLElement);
        instance.open(i);
      });

      expect(openCallback).toHaveBeenCalled();

      await wait(10);

      bodies.forEach((body, i) => {
        expect(body.style.maxHeight).toBe('100px');

        const instance = Collapsible.getInstance(body.closest('.collapsible') as HTMLElement);
        instance.close(i);
      });

      expect(closeCallback).toHaveBeenCalled();

      await wait(10);

      bodies.forEach((body) => {
        expect(body.style.maxHeight).toBe('0');
      });
    });
  });

  describe('accordion', () => {
    it('should open first and second items, keeping only second open', async () => {
      const headers = accordion.querySelectorAll<HTMLElement>('.collapsible-header');
      const bodies = accordion.querySelectorAll<HTMLElement>('.collapsible-body');

      expect(bodies[0].style.maxHeight).not.toBe('100px');
      expect(bodies[1].style.maxHeight).not.toBe('100px');

      click(headers[0]);

      await wait(10);

      expect(bodies[0].style.maxHeight).toBe('100px');

      click(headers[1]);

      await wait(10);

      expect(bodies[0].style.maxHeight).toBe('0');
      expect(bodies[1].style.maxHeight).toBe('100px');
    });
  });

  describe('popout', () => {
    it('should open first and popout', async () => {
      const listItems = popout.querySelectorAll<HTMLElement>('li');
      const firstHeader = popout.querySelector<HTMLElement>('.collapsible-header')!;
      const firstBody = popout.querySelector<HTMLElement>('.collapsible-body')!;

      expect(firstBody.style.maxHeight).not.toBe('100px');

      // Closed popout items should have horizontal margins
      listItems.forEach((li) => {
        const style = getComputedStyle(li);
        const marginLeft = parseInt(style.marginLeft || '0', 10);
        const marginRight = parseInt(style.marginRight || '0', 10);

        expect(marginLeft).toBeGreaterThan(0);
        expect(marginRight).toBeGreaterThan(0);
      });

      click(firstHeader);

      await wait(10);

      expect(firstBody.style.maxHeight).toBe('100px');
    });
  });
});
