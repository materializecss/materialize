// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Toast } from './toasts';

describe('Toasts:', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    Toast.dismissAll();
    Toast._removeContainer();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Toast', () => {
    it('displays and removes toast', () => {
      const instance = new Toast({
        text: 'Test toast',
        inDuration: 20,
        displayLength: 100,
        outDuration: 20
      });

      const wrapperWasCreated = document.querySelectorAll('#toast-container').length === 1;
      expect(wrapperWasCreated).toBe(true);

      const toast = instance.el;

      // Advance timers past inDuration animation trigger
      vi.advanceTimersByTime(10);
      expect(toast.getAttribute('role')).toBe('alert');
      expect(toast.getAttribute('aria-live')).toBe('assertive');
      expect(toast.getAttribute('aria-atomic')).toBe('true');
      expect(toast.innerText).toBe('Test toast');
      expect(document.body.contains(toast)).toBe(true);

      // Advance timers to middle of display duration
      vi.advanceTimersByTime(30);
      expect(document.body.contains(toast)).toBe(true);

      // Advance timers past displayLength + outDuration to trigger removal
      vi.advanceTimersByTime(150);
      expect(document.body.contains(toast)).toBe(false);
    });

    it('calls callback function when dismissed', () => {
      let wasCalled = false;
      const callback = () => {
        wasCalled = true;
      };

      new Toast({
        text: 'I am a toast',
        inDuration: 10,
        displayLength: 50,
        outDuration: 10,
        completeCallback: callback
      });

      // Advance past total duration (50 + 10 = 60ms)
      vi.advanceTimersByTime(100);
      expect(wasCalled).toBe(true);
    });

    it('applies classes to toast', () => {
      new Toast({
        text: 'Hi',
        displayLength: 100,
        inDuration: 10,
        outDuration: 10,
        classes: 'round flat'
      });

      vi.advanceTimersByTime(20);
      const toastFlat = document.querySelectorAll('.toast.round.flat');
      expect(toastFlat.length).toBe(1);
    });
  });
});
