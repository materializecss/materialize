// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Tooltip } from './tooltip';

const fixture = `
  <a id="test" class="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am tooltip">
    Hover me!
  </a>

  <a id="test1" class="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am a tooltip that is really really long so that I would definitely overflow off the screen if I were not smart!">
    Hover me!
  </a>

  <div style="position: fixed; top: 50%; left: 50%;">
    <a id="test2" class="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="Fixed position tooltip">
      Hover me!
    </a>
  </div>
`;

describe('Tooltip (Popover API)', () => {
  beforeEach(() => {
    // Setup fake timers for delay assertions
    vi.useFakeTimers();

    // Polyfill popover methods if Happy-DOM environment does not support native Popover API yet
    if (!HTMLElement.prototype.showPopover) {
      HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
        this.setAttribute('popover-open', '');
        this.matches = (selector: string) =>
          selector === ':popover-open' || selector === '[popover]';
      });
      HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
        this.removeAttribute('popover-open');
        this.matches = (selector: string) => selector === '[popover]';
      });
    }

    // Set up document fixture
    document.body.innerHTML = fixture;

    // Initialize tooltips
    Tooltip.init(document.querySelectorAll('.tooltipped'), {
      enterDelay: 0,
      exitDelay: 0
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('opens and closes properly', () => {
    it('shows tooltip on mouse enter and hides on mouse leave', () => {
      const tooltippedBtn = document.querySelector<HTMLElement>('#test')!;
      const instance = Tooltip.getInstance(tooltippedBtn);
      const tooltip = instance.tooltipEl;

      // Simulate mouse enter
      tooltippedBtn.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(10);

      // Verify content and open state
      expect(instance.isOpen).toBe(true);
      expect(tooltip.textContent).toBe('I am tooltip');

      // Simulate mouse leave
      tooltippedBtn.dispatchEvent(new Event('mouseleave'));
      vi.advanceTimersByTime(10);

      expect(instance.isOpen).toBe(false);
    });

    it('removes tooltip DOM object on destroy', () => {
      const tooltippedBtn = document.querySelector<HTMLElement>('#test1')!;
      const instance = Tooltip.getInstance(tooltippedBtn);
      const tooltipEl = instance.tooltipEl;

      instance.destroy();

      // Check DOM cleanup & instance ref clearance
      expect(Tooltip.getInstance(tooltippedBtn)).toBeUndefined();
      expect(document.body.contains(tooltipEl)).toBe(false);
    });

    it('changes position attribute dynamically', () => {
      const tooltippedBtn = document.querySelector<HTMLElement>('#test')!;
      tooltippedBtn.setAttribute('data-position', 'right');

      const instance = Tooltip.getInstance(tooltippedBtn);

      tooltippedBtn.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(10);

      expect(instance.tooltipEl.dataset.position).toBe('right');
    });

    it('accepts delay option from javascript initialization', () => {
      const tooltippedBtn = document.querySelector<HTMLElement>('#test')!;
      tooltippedBtn.removeAttribute('data-delay');

      // Re-initialize with a custom enterDelay
      const instance = Tooltip.init(tooltippedBtn, { enterDelay: 200 });

      tooltippedBtn.dispatchEvent(new Event('mouseenter'));

      // Check before delay completes
      vi.advanceTimersByTime(150);
      expect(instance.isOpen).toBe(false);

      // Check after delay passes
      vi.advanceTimersByTime(100);
      expect(instance.isOpen).toBe(true);
    });

    it('assigns correctly with a fixed position parent', () => {
      const tooltippedBtn = document.querySelector<HTMLElement>('#test2')!;
      const instance = Tooltip.getInstance(tooltippedBtn);

      tooltippedBtn.dispatchEvent(new Event('mouseenter'));
      vi.advanceTimersByTime(10);

      expect(instance.isOpen).toBe(true);
      expect(instance.tooltipEl.dataset.position).toBe('bottom');
    });
  });
});
