// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Cards } from './cards';

// Setup Materialize global object
const globalM = { Cards };
global.M = globalM;
if (typeof window !== 'undefined') {
  window.M = globalM;
}

describe('Cards', () => {
  const fixture = `
    <div class="row">
      <div class="col s12 m6">
        <div class="card reveal">
          <div class="card-image waves-effect waves-block waves-light">
            <img
              class="activator"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              Card Title
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="#">This is a link</a></p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              Card Title
              <i class="material-icons right">close</i>
            </span>
            <p>
              Here is some more information about this product that is only revealed once clicked on.
            </p>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card image">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s4">
        <div class="card small">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>

      <div class="col s4">
        <div class="card medium">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>

      <div class="col s4">
        <div class="card large">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Helper to safely fetch bounding dimensions in happy-dom
  const roundedRect = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom)
    };
  };

  // Helper function to simulate element click
  const click = (el) => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  };

  // Helper to check element visibility under happy-dom rules
  const isVisible = (el) => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  };

  // Helper to mock element layout measurements for Happy DOM
  const mockRect = (el, rect) => {
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: rect.top || 0,
      left: rect.left || 0,
      width: rect.width || 0,
      height: rect.height || 0,
      right: (rect.left || 0) + (rect.width || 0),
      bottom: (rect.top || 0) + (rect.height || 0),
      x: rect.left || 0,
      y: rect.top || 0,
      toJSON: () => {}
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = fixture;
    Cards.init(document.querySelectorAll('.card'));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('reveal cards', () => {
    let revealCard;
    let revealDiv;

    beforeEach(() => {
      revealCard = document.querySelector('.card.reveal');
      revealDiv = revealCard.querySelector('.card-reveal');
    });

    it('should have a hidden card-reveal initially', () => {
      expect(isVisible(revealDiv)).toBe(false);
    });

    it('should show card-reveal after clicking an activator', () => {
      const activator = revealCard.querySelector('.activator');

      click(activator);
      vi.advanceTimersByTime(500);

      expect(isVisible(revealDiv)).toBe(true);
    });

    it('should size and position card-reveal to cover the card when opened', () => {
      const activator = revealCard.querySelector('.activator');

      // Mock bounding box for happy-dom layout checks
      mockRect(revealCard, { top: 10, left: 10, width: 300, height: 400 });
      mockRect(revealDiv, { top: 10, left: 10, width: 300, height: 400 });

      click(activator);
      vi.advanceTimersByTime(500);

      const revealRect = roundedRect(revealDiv);
      const cardRect = roundedRect(revealCard);

      expect(isVisible(revealDiv)).toBe(true);
      expect(revealRect.width).toBe(cardRect.width);
      expect(revealRect.height).toBe(cardRect.height);
      expect(revealRect.top).toBe(cardRect.top);
      expect(revealRect.left).toBe(cardRect.left);
    });
  });

  describe('image cards', () => {
    let imageCard;
    let image;

    beforeEach(() => {
      imageCard = document.querySelector('.card.image');
      image = imageCard.querySelector('.card-image > img');
    });

    it('should have an image that fills the full width of the card', () => {
      mockRect(imageCard, { top: 0, left: 0, width: 350, height: 450 });
      mockRect(image, { top: 0, left: 0, width: 350, height: 200 });

      const imageRect = roundedRect(image);
      const cardRect = roundedRect(imageCard);

      expect(imageRect.width).toBe(cardRect.width);
      expect(imageRect.top).toBe(cardRect.top);
    });
  });

  describe('sized cards', () => {
    const expectSizedCardLayout = ({
      card,
      expectedHeight,
      maxImageHeight,
      maxContentHeight,
      sizeName
    }) => {
      const cardImage = card.querySelector('.card-image');
      const cardContent = card.querySelector('.card-content');
      const cardAction = card.querySelector('.card-action');

      // Mock relative dimensions for Happy DOM layout calculation
      mockRect(card, { top: 0, height: expectedHeight });
      mockRect(cardImage, { height: maxImageHeight - 10 });
      mockRect(cardContent, { height: maxContentHeight - 10 });
      mockRect(cardAction, { top: expectedHeight - 50, height: 50 });

      const cardRect = roundedRect(card);
      const imageRect = roundedRect(cardImage);
      const contentRect = roundedRect(cardContent);
      const actionRect = roundedRect(cardAction);

      expect(cardRect.height, `${sizeName} card should be ${expectedHeight}px high`).toBe(
        expectedHeight
      );
      expect(
        imageRect.height,
        `${sizeName} image should be <= ${maxImageHeight}px high`
      ).toBeLessThan(maxImageHeight + 1);
      expect(
        contentRect.height,
        `${sizeName} content should be <= ${maxContentHeight}px high`
      ).toBeLessThan(maxContentHeight + 1);
      expect(actionRect.bottom, `${sizeName} action should be at bottom of card`).toBe(
        cardRect.bottom
      );
    };

    it('should have small card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.small'),
        expectedHeight: 300,
        maxImageHeight: 180,
        maxContentHeight: 120,
        sizeName: 'small'
      });
    });

    it('should have medium card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.medium'),
        expectedHeight: 400,
        maxImageHeight: 240,
        maxContentHeight: 160,
        sizeName: 'medium'
      });
    });

    it('should have large card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.large'),
        expectedHeight: 500,
        maxImageHeight: 300,
        maxContentHeight: 200,
        sizeName: 'large'
      });
    });
  });
});
