import { Utils } from '../utils';
import { Component, BaseOptions, InitElements, MElement } from '../component';

// TODO: Combine this into one class

interface CarouselOptions extends BaseOptions {
  /**
   * Transition duration in milliseconds.
   * @default 200
   */
  duration: number;
  /**
   * Perspective zoom. If 0, all items are the same size.
   * @default -100
   */
  dist: number;
  /**
   * Set the spacing of the center item.
   * @default 0
   */
  shift: number;
  /**
   * Set the padding between non center items.
   * @default 0
   */
  padding: number;
  /**
   * Set the number of visible items.
   * @default 5
   */
  numVisible: number;
  /**
   * Make the carousel a full width slider like the second example.
   * @default false
   */
  fullWidth: boolean;
  /**
   * Set to true to show indicators.
   * @default false
   */
  indicators: boolean;
  /**
   * Don't wrap around and cycle through items.
   * @default false
   */
  noWrap: boolean;
  /**
   * Callback for when a new slide is cycled to.
   * @default null
   */
  onCycleTo: (current: Element, dragged: boolean) => void;
}

interface SliderOptions extends BaseOptions {
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

const _defaultsCarousel: CarouselOptions = {
  duration: 200, // ms
  dist: -100, // zoom scale TODO: make this more intuitive as an option
  shift: 0, // spacing for center image
  padding: 0, // Padding between non center items
  numVisible: 5, // Number of visible items in carousel
  fullWidth: false, // Change to full width styles
  indicators: false, // Toggle indicators
  noWrap: false, // Don't wrap around and cycle through items.
  onCycleTo: null // Callback for when a new slide is cycled to.
};

class Carousel extends Component<CarouselOptions> {
  hasMultipleSlides: boolean;
  showIndicators: boolean;
  noWrap: boolean;
  /** If the carousel is being clicked or tapped. */
  pressed: boolean;
  /** If the carousel is currently being dragged. */
  dragged: boolean;
  offset: number;
  target: number;
  images: HTMLElement[];
  itemWidth: number;
  itemHeight: number;
  dim: number;
  _indicators: HTMLUListElement;
  count: number;
  xform: string;
  verticalDragged: boolean;
  reference: number;
  referenceY: number;
  velocity: number;
  frame: number;
  timestamp: number;
  ticker: string | number | NodeJS.Timeout;
  amplitude: number;
  /** The index of the center carousel item. */
  center: number = 0;
  imageHeight: number;
  scrollingTimeout: number | NodeJS.Timeout;
  oneTimeCallback: (current: Element, dragged: boolean) => void | null;

  constructor(el: HTMLElement, options: Partial<CarouselOptions>) {
    super(el, options, Carousel);
    this.el['M_Carousel'] = this;

    this.options = {
      ...Carousel.defaults,
      ...options
    };

    // Setup
    this.hasMultipleSlides = this.el.querySelectorAll('.carousel-item').length > 1;
    this.showIndicators = this.options.indicators && this.hasMultipleSlides;
    this.noWrap = this.options.noWrap || !this.hasMultipleSlides;
    this.pressed = false;
    this.dragged = false;
    this.offset = this.target = 0;
    this.images = [];
    this.itemWidth = this.el.querySelector('.carousel-item').clientWidth;
    this.itemHeight = this.el.querySelector('.carousel-item').clientHeight;
    this.dim = this.itemWidth * 2 + this.options.padding || 1; // Make sure dim is non zero for divisions.

    // Full Width carousel setup
    if (this.options.fullWidth) {
      this.options.dist = 0;
      this._setCarouselHeight();

      // Offset fixed items when indicators.
      if (this.showIndicators) {
        this.el.querySelector('.carousel-fixed-item')?.classList.add('with-indicators');
      }
    }

    // Iterate through slides
    this._indicators = document.createElement('ul');
    this._indicators.classList.add('indicators');

    this.el.querySelectorAll('.carousel-item').forEach((item: HTMLElement, i) => {
      this.images.push(item);
      if (this.showIndicators) {
        const indicator = document.createElement('li');
        indicator.classList.add('indicator-item');
        indicator.tabIndex = 0;
        if (i === 0) {
          indicator.classList.add('active');
        }
        this._indicators.appendChild(indicator);
      }
    });

    if (this.showIndicators) this.el.appendChild(this._indicators);

    this.count = this.images.length;

    // Cap numVisible at count
    this.options.numVisible = Math.min(this.count, this.options.numVisible);

    // Setup cross browser string
    this.xform = 'transform';
    ['webkit', 'Moz', 'O', 'ms'].every((prefix) => {
      const e = prefix + 'Transform';
      if (typeof document.body.style[e] !== 'undefined') {
        this.xform = e;
        return false;
      }
      return true;
    });

    this._setupEventHandlers();
    this._scroll(this.offset);
  }

  static get defaults(): CarouselOptions {
    return _defaultsCarousel;
  }

  /**
   * Initializes instance of Carousel.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<CarouselOptions>): Carousel;
  /**
   * Initializes instances of Carousel.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<CarouselOptions>): Carousel[];
  /**
   * Initializes instances of Carousel.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(
    els: HTMLElement | InitElements<MElement>,
    options: Partial<CarouselOptions> = {}
  ): Carousel | Carousel[] {
    return super.init(els, options, Carousel);
  }

  static getInstance(el: HTMLElement): Carousel {
    return el['M_Carousel'];
  }

  destroy() {
    this._removeEventHandlers();
    this.el['M_Carousel'] = undefined;
  }

  _setupEventHandlers() {
    if (typeof window.ontouchstart !== 'undefined') {
      this.el.addEventListener('touchstart', this._handleCarouselTap);
      this.el.addEventListener('touchmove', this._handleCarouselDrag);
      this.el.addEventListener('touchend', this._handleCarouselRelease);
    }
    this.el.addEventListener('mousedown', this._handleCarouselTap);
    this.el.addEventListener('mousemove', this._handleCarouselDrag);
    this.el.addEventListener('mouseup', this._handleCarouselRelease);
    this.el.addEventListener('mouseleave', this._handleCarouselRelease);
    this.el.addEventListener('click', this._handleCarouselClick);
    if (this.showIndicators && this._indicators) {
      this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
        el.addEventListener('click', this._handleIndicatorClick);
        el.addEventListener('keypress', this._handleIndicatorKeyPress);
      });
    }
    // Resize
    window.addEventListener('resize', this._handleThrottledResize);
  }

  _removeEventHandlers() {
    if (typeof window.ontouchstart !== 'undefined') {
      this.el.removeEventListener('touchstart', this._handleCarouselTap);
      this.el.removeEventListener('touchmove', this._handleCarouselDrag);
      this.el.removeEventListener('touchend', this._handleCarouselRelease);
    }
    this.el.removeEventListener('mousedown', this._handleCarouselTap);
    this.el.removeEventListener('mousemove', this._handleCarouselDrag);
    this.el.removeEventListener('mouseup', this._handleCarouselRelease);
    this.el.removeEventListener('mouseleave', this._handleCarouselRelease);
    this.el.removeEventListener('click', this._handleCarouselClick);
    if (this.showIndicators && this._indicators) {
      this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
        el.removeEventListener('click', this._handleIndicatorClick);
      });
    }
    window.removeEventListener('resize', this._handleThrottledResize);
  }

  _handleThrottledResize = (): void => Utils.throttle(this._handleResize, 200, null).bind(this);

  _handleCarouselTap = (e: MouseEvent | TouchEvent) => {
    // Fixes firefox draggable image bug
    if (e.type === 'mousedown' && (<HTMLElement>e.target).tagName === 'IMG') {
      e.preventDefault();
    }
    this.pressed = true;
    this.dragged = false;
    this.verticalDragged = false;
    this.reference = this._xpos(e);
    this.referenceY = this._ypos(e);

    this.velocity = this.amplitude = 0;
    this.frame = this.offset;
    this.timestamp = Date.now();
    clearInterval(this.ticker);
    this.ticker = setInterval(this._track, 100);
  };

  _handleCarouselDrag = (e: MouseEvent | TouchEvent) => {
    let x: number, y: number, delta: number, deltaY: number;
    if (this.pressed) {
      x = this._xpos(e);
      y = this._ypos(e);
      delta = this.reference - x;
      deltaY = Math.abs(this.referenceY - y);
      if (deltaY < 30 && !this.verticalDragged) {
        // If vertical scrolling don't allow dragging.
        if (delta > 2 || delta < -2) {
          this.dragged = true;
          this.reference = x;
          this._scroll(this.offset + delta);
        }
      } else if (this.dragged) {
        // If dragging don't allow vertical scroll.
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else {
        // Vertical scrolling.
        this.verticalDragged = true;
      }
    }
    if (this.dragged) {
      // If dragging don't allow vertical scroll.
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  _handleCarouselRelease = (e: MouseEvent | TouchEvent) => {
    if (this.pressed) {
      this.pressed = false;
    } else {
      return;
    }
    clearInterval(this.ticker);
    this.target = this.offset;
    if (this.velocity > 10 || this.velocity < -10) {
      this.amplitude = 0.9 * this.velocity;
      this.target = this.offset + this.amplitude;
    }
    this.target = Math.round(this.target / this.dim) * this.dim;
    // No wrap of items.
    if (this.noWrap) {
      if (this.target >= this.dim * (this.count - 1)) {
        this.target = this.dim * (this.count - 1);
      } else if (this.target < 0) {
        this.target = 0;
      }
    }
    this.amplitude = this.target - this.offset;
    this.timestamp = Date.now();
    requestAnimationFrame(this._autoScroll);
    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  };

  _handleCarouselClick = (e: MouseEvent | TouchEvent) => {
    // Disable clicks if carousel was dragged.
    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (!this.options.fullWidth) {
      const clickedElem = (<HTMLElement>e.target).closest('.carousel-item');
      if (!clickedElem) return;
      const clickedIndex = [...clickedElem.parentNode.children].indexOf(clickedElem);
      const diff = this._wrap(this.center) - clickedIndex;
      // Disable clicks if carousel was shifted by click
      if (diff !== 0) {
        e.preventDefault();
        e.stopPropagation();
      }
      // fixes https://github.com/materializecss/materialize/issues/180
      if (clickedIndex < 0) {
        // relative X position > center of carousel = clicked at the right part of the carousel
        if (
          (e as MouseEvent).clientX - (e.target as HTMLElement).getBoundingClientRect().left >
          this.el.clientWidth / 2
        ) {
          this.next();
        } else {
          this.prev();
        }
      } else {
        this._cycleTo(clickedIndex);
      }
    }
  };

  _handleIndicatorClick = (e: Event) => {
    e.stopPropagation();
    this._handleIndicatorInteraction(e);
  };

  _handleIndicatorKeyPress = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (Utils.keys.ENTER.includes(e.key)) {
      this._handleIndicatorInteraction(e);
    }
  };

  _handleIndicatorInteraction = (e: Event) => {
    const indicator = (<HTMLElement>e.target).closest('.indicator-item');
    if (indicator) {
      const index = [...indicator.parentNode.children].indexOf(indicator);
      this._cycleTo(index);
    }
  };

  _handleResize = () => {
    if (this.options.fullWidth) {
      this.itemWidth = this.el.querySelector('.carousel-item').clientWidth;
      this.imageHeight = this.el.querySelector('.carousel-item.active').clientHeight;
      this.dim = this.itemWidth * 2 + this.options.padding;
      this.offset = this.center * 2 * this.itemWidth;
      this.target = this.offset;
      this._setCarouselHeight(true);
    } else {
      this._scroll();
    }
  };

  _setCarouselHeight(imageOnly: boolean = false) {
    const firstSlide = this.el.querySelector('.carousel-item.active')
      ? this.el.querySelector('.carousel-item.active')
      : this.el.querySelector('.carousel-item');

    const firstImage = firstSlide.querySelector('img');
    if (firstImage) {
      if (firstImage.complete) {
        // If image won't trigger the load event
        const imageHeight = firstImage.clientHeight;
        if (imageHeight > 0) {
          this.el.style.height = imageHeight + 'px';
        } else {
          // If image still has no height, use the natural dimensions to calculate
          const naturalWidth = firstImage.naturalWidth;
          const naturalHeight = firstImage.naturalHeight;
          const adjustedHeight = (this.el.clientWidth / naturalWidth) * naturalHeight;
          this.el.style.height = adjustedHeight + 'px';
        }
      } else {
        // Get height when image is loaded normally
        firstImage.addEventListener('load', () => {
          this.el.style.height = firstImage.offsetHeight + 'px';
        });
      }
    } else if (!imageOnly) {
      const slideHeight = firstSlide.clientHeight;
      this.el.style.height = slideHeight + 'px';
    }
  }

  _xpos(e: MouseEvent | TouchEvent) {
    // touch event
    if (e.type.startsWith('touch') && (e as TouchEvent).targetTouches.length >= 1) {
      return (e as TouchEvent).targetTouches[0].clientX;
    }
    // mouse event
    return (e as MouseEvent).clientX;
  }

  _ypos(e: MouseEvent | TouchEvent) {
    // touch event
    if (e.type.startsWith('touch') && (e as TouchEvent).targetTouches.length >= 1) {
      return (e as TouchEvent).targetTouches[0].clientY;
    }
    // mouse event
    return (e as MouseEvent).clientY;
  }

  _wrap(x: number) {
    return x >= this.count ? x % this.count : x < 0 ? this._wrap(this.count + (x % this.count)) : x;
  }

  _track = () => {
    const now: number = Date.now(),
      elapsed: number = now - this.timestamp,
      delta: number = this.offset - this.frame,
      v: number = (1000 * delta) / (1 + elapsed);
    // now = Date.now();
    // elapsed = now - this.timestamp;
    this.timestamp = now;
    // delta = this.offset - this.frame;
    this.frame = this.offset;
    // v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  };

  _autoScroll = () => {
    let elapsed: number, delta: number;
    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = this.amplitude * Math.exp(-elapsed / this.options.duration);
      if (delta > 2 || delta < -2) {
        this._scroll(this.target - delta);
        requestAnimationFrame(this._autoScroll);
      } else {
        this._scroll(this.target);
      }
    }
  };

  _scroll(x: number = 0) {
    // Track scrolling state
    if (!this.el.classList.contains('scrolling')) {
      this.el.classList.add('scrolling');
    }
    if (this.scrollingTimeout != null) {
      clearTimeout(this.scrollingTimeout);
    }
    this.scrollingTimeout = setTimeout(() => {
      this.el.classList.remove('scrolling');
    }, this.options.duration);

    // Save last center before updating the center for onCycleTo callback
    const lastCenter = this.center;

    // Start actual scroll
    this.offset = typeof x === 'number' ? x : this.offset;
    this.center = Math.floor((this.offset + this.dim / 2) / this.dim);

    const half: number = this.count >> 1,
      delta: number = this.offset - this.center * this.dim,
      dir: number = delta < 0 ? 1 : -1,
      tween: number = (-dir * delta * 2) / this.dim;
    let i: number,
      el: HTMLElement,
      alignment: string,
      zTranslation: number,
      tweenedOpacity: number,
      centerTweenedOpacity: number;
    const numVisibleOffset = 1 / this.options.numVisible;

    // delta = this.offset - this.center * this.dim;
    // dir = delta < 0 ? 1 : -1;
    // tween = (-dir * delta * 2) / this.dim;
    // half = this.count >> 1;

    if (this.options.fullWidth) {
      alignment = 'translateX(0)';
      centerTweenedOpacity = 1;
    } else {
      alignment = 'translateX(' + (this.el.clientWidth - this.itemWidth) / 2 + 'px) ';
      alignment += 'translateY(' + (this.el.clientHeight - this.itemHeight) / 2 + 'px)';
      centerTweenedOpacity = 1 - numVisibleOffset * tween;
    }

    // Set indicator active
    if (this.showIndicators) {
      const diff = this.center % this.count;
      const activeIndicator = this._indicators.querySelector('.indicator-item.active');
      const activeIndicatorIndex = [...activeIndicator.parentNode.children].indexOf(
        activeIndicator
      );
      if (activeIndicatorIndex !== diff) {
        activeIndicator.classList.remove('active');
        const pos = diff < 0 ? this.count + diff : diff;
        this._indicators.querySelectorAll('.indicator-item')[pos].classList.add('active');
      }
    }

    // center
    // Don't show wrapped items.
    if (!this.noWrap || (this.center >= 0 && this.center < this.count)) {
      el = this.images[this._wrap(this.center)];

      // Add active class to center item.
      if (!el.classList.contains('active')) {
        this.el.querySelector('.carousel-item').classList.remove('active');
        el.classList.add('active');
      }

      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${
        dir * this.options.shift * tween * i
      }px) translateZ(${this.options.dist * tween}px)`;
      this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
    }

    for (i = 1; i <= half; ++i) {
      // right side
      if (this.options.fullWidth) {
        zTranslation = this.options.dist;
        tweenedOpacity = i === half && delta < 0 ? 1 - tween : 1;
      } else {
        zTranslation = this.options.dist * (i * 2 + tween * dir);
        tweenedOpacity = 1 - numVisibleOffset * (i * 2 + tween * dir);
      }
      // Don't show wrapped items.
      if (!this.noWrap || this.center + i < this.count) {
        el = this.images[this._wrap(this.center + i)];
        const transformString = `${alignment} translateX(${
          this.options.shift + (this.dim * i - delta) / 2
        }px) translateZ(${zTranslation}px)`;
        this._updateItemStyle(el, tweenedOpacity, -i, transformString);
      }
      // left side
      if (this.options.fullWidth) {
        zTranslation = this.options.dist;
        tweenedOpacity = i === half && delta > 0 ? 1 - tween : 1;
      } else {
        zTranslation = this.options.dist * (i * 2 - tween * dir);
        tweenedOpacity = 1 - numVisibleOffset * (i * 2 - tween * dir);
      }
      // Don't show wrapped items.
      if (!this.noWrap || this.center - i >= 0) {
        el = this.images[this._wrap(this.center - i)];
        const transformString = `${alignment} translateX(${
          -this.options.shift + (-this.dim * i - delta) / 2
        }px) translateZ(${zTranslation}px)`;
        this._updateItemStyle(el, tweenedOpacity, -i, transformString);
      }
    }
    // center
    // Don't show wrapped items.
    if (!this.noWrap || (this.center >= 0 && this.center < this.count)) {
      el = this.images[this._wrap(this.center)];
      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${
        dir * this.options.shift * tween
      }px) translateZ(${this.options.dist * tween}px)`;
      this._updateItemStyle(el, centerTweenedOpacity, 0, transformString);
    }
    // onCycleTo callback
    const _currItem = this.el.querySelectorAll('.carousel-item')[this._wrap(this.center)];

    if (lastCenter !== this.center && typeof this.options.onCycleTo === 'function') {
      this.options.onCycleTo.call(this, _currItem, this.dragged);
    }
    // One time callback
    if (typeof this.oneTimeCallback === 'function') {
      this.oneTimeCallback.call(this, _currItem, this.dragged);
      this.oneTimeCallback = null;
    }
  }

  _updateItemStyle(el: HTMLElement, opacity: number, zIndex: number, transform: string) {
    el.style[this.xform] = transform;
    el.style.zIndex = zIndex.toString();
    el.style.opacity = opacity.toString();
    el.style.visibility = 'visible';
  }

  _cycleTo(n: number, callback: CarouselOptions['onCycleTo'] = null) {
    let diff = (this.center % this.count) - n;
    // Account for wraparound.
    if (!this.noWrap) {
      if (diff < 0) {
        if (Math.abs(diff + this.count) < Math.abs(diff)) {
          diff += this.count;
        }
      } else if (diff > 0) {
        if (Math.abs(diff - this.count) < diff) {
          diff -= this.count;
        }
      }
    }
    this.target = this.dim * Math.round(this.offset / this.dim);
    // Next
    if (diff < 0) {
      this.target += this.dim * Math.abs(diff);
    } // Prev
    else if (diff > 0) {
      this.target -= this.dim * diff;
    }
    // Set one time callback
    if (typeof callback === 'function') {
      this.oneTimeCallback = callback;
    }
    // Scroll
    if (this.offset !== this.target) {
      this.amplitude = this.target - this.offset;
      this.timestamp = Date.now();
      requestAnimationFrame(this._autoScroll);
    }
  }

  /**
   * Move carousel to next slide or go forward a given amount of slides.
   * @param n How many times the carousel slides.
   */
  next(n: number = 1) {
    if (n === undefined || isNaN(n)) {
      n = 1;
    }
    let index = this.center + n;
    if (index >= this.count || index < 0) {
      if (this.noWrap) return;
      index = this._wrap(index);
    }
    this._cycleTo(index);
  }

  /**
   * Move carousel to previous slide or go back a given amount of slides.
   * @param n How many times the carousel slides.
   */
  prev(n: number = 1) {
    if (n === undefined || isNaN(n)) {
      n = 1;
    }
    let index = this.center - n;
    if (index >= this.count || index < 0) {
      if (this.noWrap) return;
      index = this._wrap(index);
    }
    this._cycleTo(index);
  }

  /**
   * Move carousel to nth slide.
   * @param n Index of slide.
   * @param callback "onCycleTo" optional callback.
   */
  set(n: number, callback?: CarouselOptions['onCycleTo']) {
    if (n === undefined || isNaN(n)) {
      n = 0;
    }
    if (n > this.count || n < 0) {
      if (this.noWrap) return;
      n = this._wrap(n);
    }
    this._cycleTo(n, callback);
  }
}

const _defaults: SliderOptions = {
  indicators: true,
  height: 400,
  duration: 500,
  interval: 6000,
  pauseOnFocus: true,
  pauseOnHover: true,
  indicatorLabelFunc: null // Function which will generate a label for the indicators (ARIA)
};

class Slider extends Component<SliderOptions> {
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
    this.el['M_Slider'] = this;

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
    return el['M_Slider'];
  }

  destroy() {
    this.pause();
    this._removeIndicators();
    this._removeEventHandlers();
    this.el['M_Slider'] = undefined;
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

export { Slider, SliderOptions, Carousel, CarouselOptions };
