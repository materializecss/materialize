import { Utils } from './utils';
import { Component, BaseOptions, InitElements, MElement } from './component';

export interface SliderOptions extends BaseOptions {
  /**
   * Set to false to hide slide indicators.
   * @default true
   */
  indicators: boolean;
  /**
   * Set height of slider.
   * @default 400
   */
  height: number;
  /**
   * Set the duration of the transition animation in ms.
   * @default 500
   */
  duration: number;
  /**
   * Set the duration between transitions in ms.
   * @default 6000
   */
  interval: number;
  /**
   * If slider should pause when keyboard focus is received.
   * @default true
   */
  pauseOnFocus: boolean;
  /**
   * If slider should pause when is hovered by a pointer.
   * @default true
   */
  pauseOnHover: boolean;
  /**
   * Optional function used to generate ARIA label to indicators (for accessibility purposes).
   * @param index Current index, starting from "1".
   * @param current A which indicates whether it is the current element or not
   * @returns a string to be used as label indicator.
   * @default null
   */
  indicatorLabelFunc: (index: number, current: boolean) => string;
}

let _defaults: SliderOptions = {
  indicators: true,
  height: 400,
  duration: 500,
  interval: 6000,
  pauseOnFocus: true,
  pauseOnHover: true,
  indicatorLabelFunc: null // Function which will generate a label for the indicators (ARIA)
};

export class Slider extends Component<SliderOptions> {
  /** Index of current slide. */
  activeIndex: number;
  interval: string | number | NodeJS.Timeout;
  eventPause: boolean;
  _slider: HTMLUListElement;
  _slides: HTMLLIElement[];
  _activeSlide: HTMLLIElement;
  _indicators: HTMLLIElement[];
  _hovered: boolean;
  _focused: boolean;
  _focusCurrent: boolean;
  _sliderId: string;

  constructor(el: HTMLElement, options: Partial<SliderOptions>) {
    super(el, options, Slider);
    (this.el as any).M_Slider = this;

    this.options = {
      ...Slider.defaults,
      ...options
    };

    // init props
    this.interval = null;
    this.eventPause = false;
    this._hovered = false;
    this._focused = false;
    this._focusCurrent = false;

    // setup
    this._slider = this.el.querySelector('.slides');
    this._slides = Array.from(this._slider.querySelectorAll('li'));
    this.activeIndex = this._slides.findIndex((li) => li.classList.contains('active'));

    if (this.activeIndex !== -1) {
      this._activeSlide = this._slides[this.activeIndex];
    }

    this._setSliderHeight();

    // Sets element id if it does not have one
    if (this._slider.hasAttribute('id')) this._sliderId = this._slider.getAttribute('id');
    else {
      this._sliderId = 'slider-' + Utils.guid();
      this._slider.setAttribute('id', this._sliderId);
    }

    const placeholderBase64 =
      'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    // Set initial positions of captions
    this._slides.forEach((slide) => {
      // Caption
      //const caption = <HTMLElement|null>slide.querySelector('.caption');
      //if (caption) this._animateCaptionIn(caption, 0);
      // Set Images as Background Images
      const img = slide.querySelector('img');
      if (img) {
        if (img.src !== placeholderBase64) {
          img.style.backgroundImage = 'url(' + img.src + ')';
          img.src = placeholderBase64;
        }
      }
      // Sets slide as focusable by code
      if (!slide.hasAttribute('tabindex')) slide.setAttribute('tabindex', '-1');
      // Removes initial visibility from "inactive" slides
      slide.style.visibility = 'hidden';
    });

    this._setupIndicators();

    // Show active slide
    if (this._activeSlide) {
      this._activeSlide.style.display = 'block';
      this._activeSlide.style.visibility = 'visible';
    } else {
      this.activeIndex = 0;
      this._slides[0].classList.add('active');
      this._slides[0].style.visibility = 'visible';
      this._activeSlide = this._slides[0];
      this._animateSlide(this._slides[0], true);
      // Update indicators
      if (this.options.indicators) {
        this._indicators[this.activeIndex].children[0].classList.add('active');
      }
    }
    this._setupEventHandlers();
    // auto scroll
    this.start();
  }

  static get defaults() {
    return _defaults;
  }

  /**
   * Initializes instance of Slider.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<SliderOptions>): Slider;
  /**
   * Initializes instances of Slider.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<SliderOptions>): Slider[];
  /**
   * Initializes instances of Slider.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<SliderOptions> = {}
  ): Slider | Slider[] {
    return super.init(els, options, Slider);
  }

  static getInstance(el: HTMLElement): Slider {
    return (el as any).M_Slider;
  }

  destroy() {
    this.pause();
    this._removeIndicators();
    this._removeEventHandlers();
    (this.el as any).M_Slider = undefined;
  }

  private _setupEventHandlers() {
    if (this.options.pauseOnFocus) {
      this.el.addEventListener('focusin', this._handleAutoPauseFocus);
      this.el.addEventListener('focusout', this._handleAutoStartFocus);
    }
    if (this.options.pauseOnHover) {
      this.el.addEventListener('mouseenter', this._handleAutoPauseHover);
      this.el.addEventListener('mouseleave', this._handleAutoStartHover);
    }
    if (this.options.indicators) {
      this._indicators.forEach((el) => {
        el.addEventListener('click', this._handleIndicatorClick);
      });
    }
  }

  private _removeEventHandlers() {
    if (this.options.pauseOnFocus) {
      this.el.removeEventListener('focusin', this._handleAutoPauseFocus);
      this.el.removeEventListener('focusout', this._handleAutoStartFocus);
    }
    if (this.options.pauseOnHover) {
      this.el.removeEventListener('mouseenter', this._handleAutoPauseHover);
      this.el.removeEventListener('mouseleave', this._handleAutoStartHover);
    }
    if (this.options.indicators) {
      this._indicators.forEach((el) => {
        el.removeEventListener('click', this._handleIndicatorClick);
      });
    }
  }

  private _handleIndicatorClick = (e: MouseEvent) => {
    const el = (<HTMLElement>e.target).parentElement;
    const currIndex = [...el.parentNode.children].indexOf(el);
    this._focusCurrent = true;
    this.set(currIndex);
  };

  private _handleAutoPauseHover = () => {
    this._hovered = true;
    if (this.interval != null) {
      this._pause(true);
    }
  };

  private _handleAutoPauseFocus = () => {
    this._focused = true;
    if (this.interval != null) {
      this._pause(true);
    }
  };

  private _handleAutoStartHover = () => {
    this._hovered = false;
    if (!(this.options.pauseOnFocus && this._focused) && this.eventPause) {
      this.start();
    }
  };

  private _handleAutoStartFocus = () => {
    this._focused = false;
    if (!(this.options.pauseOnHover && this._hovered) && this.eventPause) {
      this.start();
    }
  };

  private _handleInterval = () => {
    const activeElem = this._slider.querySelector('.active');
    let newActiveIndex = [...activeElem.parentNode.children].indexOf(activeElem);
    if (this._slides.length === newActiveIndex + 1)
      newActiveIndex = 0; // loop to start
    else newActiveIndex += 1;
    this.set(newActiveIndex);
  };

  private _animateSlide(slide: HTMLElement, isDirectionIn: boolean): void {
    let dx = 0,
      dy = 0;
    // from
    slide.style.opacity = isDirectionIn ? '0' : '1';
    setTimeout(() => {
      slide.style.transition = `opacity ${this.options.duration}ms ease`;
      // to
      slide.style.opacity = isDirectionIn ? '1' : '0';
    }, 1);
    // Caption
    const caption: HTMLElement = slide.querySelector('.caption');
    if (!caption) return;
    if (caption.classList.contains('center-align')) dy = -100;
    else if (caption.classList.contains('right-align')) dx = 100;
    else if (caption.classList.contains('left-align')) dx = -100;
    // from
    caption.style.opacity = isDirectionIn ? '0' : '1';
    caption.style.transform = isDirectionIn ? `translate(${dx}px, ${dy}px)` : `translate(0, 0)`;
    setTimeout(() => {
      caption.style.transition = `opacity ${this.options.duration}ms ease, transform ${this.options.duration}ms ease`;
      // to
      caption.style.opacity = isDirectionIn ? '1' : '0';
      caption.style.transform = isDirectionIn ? `translate(0, 0)` : `translate(${dx}px, ${dy}px)`;
    }, this.options.duration); // delay
  }

  private _setSliderHeight() {
    // If fullscreen, do nothing
    if (!this.el.classList.contains('fullscreen')) {
      if (this.options.indicators) {
        // Add height if indicators are present
        this.el.style.height = this.options.height + 40 + 'px'; //.css('height', this.options.height + 40 + 'px');
      } else {
        this.el.style.height = this.options.height + 'px';
      }
      this._slider.style.height = this.options.height + 'px';
    }
  }

  private _setupIndicators() {
    if (this.options.indicators) {
      const ul = document.createElement('ul');
      ul.classList.add('indicators');

      const arrLi = [];
      this._slides.forEach((el, i) => {
        const label = this.options.indicatorLabelFunc
          ? this.options.indicatorLabelFunc.call(this, i + 1, i === 0)
          : `${i + 1}`;
        const li = document.createElement('li');
        li.classList.add('indicator-item');
        li.innerHTML = `<button type="button" class="indicator-item-btn" aria-label="${label}" aria-controls="${this._sliderId}"></button>`;
        arrLi.push(li);
        ul.append(li);
      });

      this.el.append(ul);
      this._indicators = arrLi;
    }
  }

  private _removeIndicators() {
    this.el.querySelector('ul.indicators').remove(); //find('ul.indicators').remove();
  }

  set(index: number) {
    // Wrap around indices.
    if (index >= this._slides.length) index = 0;
    else if (index < 0) index = this._slides.length - 1;

    // Only do if index changes
    if (this.activeIndex === index) return;

    this._activeSlide = this._slides[this.activeIndex];
    const _caption = <HTMLElement | null>this._activeSlide.querySelector('.caption');

    this._activeSlide.classList.remove('active');
    // Enables every slide
    this._slides.forEach((slide) => (slide.style.visibility = 'visible'));

    //--- Hide active Slide + Caption
    this._activeSlide.style.opacity = '0';
    setTimeout(() => {
      this._slides.forEach((slide) => {
        if (slide.classList.contains('active')) return;
        slide.style.opacity = '0';
        slide.style.transform = 'translate(0, 0)';
        // Disables invisible slides (for assistive technologies)
        slide.style.visibility = 'hidden';
      });
    }, this.options.duration);

    // Hide active Caption
    //this._animateCaptionIn(_caption, this.options.duration);
    _caption.style.opacity = '0';

    // Update indicators
    if (this.options.indicators) {
      const activeIndicator = this._indicators[this.activeIndex].children[0];
      const nextIndicator = this._indicators[index].children[0];
      activeIndicator.classList.remove('active');
      nextIndicator.classList.add('active');
      if (typeof this.options.indicatorLabelFunc === 'function') {
        activeIndicator.ariaLabel = this.options.indicatorLabelFunc.call(
          this,
          this.activeIndex,
          false
        );
        nextIndicator.ariaLabel = this.options.indicatorLabelFunc.call(this, index, true);
      }
    }

    //--- Show new Slide + Caption
    this._animateSlide(this._slides[index], true);
    this._slides[index].classList.add('active');
    this.activeIndex = index;

    // Reset interval, if allowed. This check prevents autostart
    // when slider is paused, since it can be changed though indicators.
    if (this.interval != null) {
      this.start();
    }
  }

  _pause(fromEvent: boolean) {
    clearInterval(this.interval);
    this.eventPause = fromEvent;
    this.interval = null;
  }

  /**
   * Pause slider autoslide.
   */
  pause = () => {
    this._pause(false);
  };

  /**
   * Start slider autoslide.
   */
  start = () => {
    clearInterval(this.interval);
    this.interval = setInterval(
      this._handleInterval,
      this.options.duration + this.options.interval
    );
    this.eventPause = false;
  };

  /**
   * Move to next slider.
   */
  next = () => {
    let newIndex = this.activeIndex + 1;
    // Wrap around indices.
    if (newIndex >= this._slides.length) newIndex = 0;
    else if (newIndex < 0) newIndex = this._slides.length - 1;
    this.set(newIndex);
  };

  /**
   * Move to prev slider.
   */
  prev = () => {
    let newIndex = this.activeIndex - 1;
    // Wrap around indices.
    if (newIndex >= this._slides.length) newIndex = 0;
    else if (newIndex < 0) newIndex = this._slides.length - 1;
    this.set(newIndex);
  };
}
