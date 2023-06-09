import { Component } from "./component";
import { M } from "./global";

let _defaults = {
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

export class Carousel extends Component {
  el: HTMLElement;
  hasMultipleSlides: boolean;
  showIndicators: boolean;
  noWrap: any;
  pressed: boolean;
  dragged: boolean;
  offset: number;
  target: number;
  images: HTMLElement[];
  itemWidth: any;
  itemHeight: any;
  dim: number;
  _autoScrollBound: any;
  _trackBound: any;
  _indicators: any;
  count: number;
  xform: string;
  private _handleCarouselTapBound: any;
  private _handleCarouselDragBound: any;
  private _handleCarouselReleaseBound: any;
  private _handleCarouselClickBound: any;
  _handleIndicatorClickBound: any;
  _handleThrottledResizeBound: any;
  verticalDragged: boolean;
  reference: any;
  referenceY: any;
  velocity: number;
  frame: number;
  timestamp: number;
  ticker: NodeJS.Timer;
  amplitude: number;
  center: number = 0;
  imageHeight: any;
  scrollingTimeout: any;
  oneTimeCallback: any;

  constructor(el: Element, options: Object) {
    super(Carousel, el, options);
    (this.el as any).M_Carousel = this;
    this.options = {...Carousel.defaults, ...options};

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
    this._autoScrollBound = this._autoScroll.bind(this);
    this._trackBound = this._track.bind(this);

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
        if (i === 0) {
          indicator.classList.add('active');
        }
        this._indicators.appendChild(indicator);
      }
    });

    if (this.showIndicators)
      this.el.appendChild(this._indicators);

    this.count = this.images.length;

    // Cap numVisible at count
    this.options.numVisible = Math.min(this.count, this.options.numVisible);

    // Setup cross browser string
    this.xform = 'transform';
    ['webkit', 'Moz', 'O', 'ms'].every((prefix) => {
      var e = prefix + 'Transform';
      if (typeof document.body.style[e] !== 'undefined') {
        this.xform = e;
        return false;
      }
      return true;
    });

    this._setupEventHandlers();
    this._scroll(this.offset);
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    let domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Carousel;
  }

  destroy() {
    this._removeEventHandlers();
    (this.el as any).M_Carousel = undefined;
  }

  _setupEventHandlers() {
    this._handleCarouselTapBound = this._handleCarouselTap.bind(this);
    this._handleCarouselDragBound = this._handleCarouselDrag.bind(this);
    this._handleCarouselReleaseBound = this._handleCarouselRelease.bind(this);
    this._handleCarouselClickBound = this._handleCarouselClick.bind(this);
    if (typeof window.ontouchstart !== 'undefined') {
      this.el.addEventListener('touchstart', this._handleCarouselTapBound);
      this.el.addEventListener('touchmove', this._handleCarouselDragBound);
      this.el.addEventListener('touchend', this._handleCarouselReleaseBound);
    }
    this.el.addEventListener('mousedown', this._handleCarouselTapBound);
    this.el.addEventListener('mousemove', this._handleCarouselDragBound);
    this.el.addEventListener('mouseup', this._handleCarouselReleaseBound);
    this.el.addEventListener('mouseleave', this._handleCarouselReleaseBound);
    this.el.addEventListener('click', this._handleCarouselClickBound);
    if (this.showIndicators && this._indicators) {
      this._handleIndicatorClickBound = this._handleIndicatorClick.bind(this);
      this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
        el.addEventListener('click', this._handleIndicatorClickBound);
      });
    }
    // Resize
    let throttledResize = M.throttle(this._handleResize, 200, null);
    this._handleThrottledResizeBound = throttledResize.bind(this);
    window.addEventListener('resize', this._handleThrottledResizeBound);
  }

  _removeEventHandlers() {
    if (typeof window.ontouchstart !== 'undefined') {
      this.el.removeEventListener('touchstart', this._handleCarouselTapBound);
      this.el.removeEventListener('touchmove', this._handleCarouselDragBound);
      this.el.removeEventListener('touchend', this._handleCarouselReleaseBound);
    }
    this.el.removeEventListener('mousedown', this._handleCarouselTapBound);
    this.el.removeEventListener('mousemove', this._handleCarouselDragBound);
    this.el.removeEventListener('mouseup', this._handleCarouselReleaseBound);
    this.el.removeEventListener('mouseleave', this._handleCarouselReleaseBound);
    this.el.removeEventListener('click', this._handleCarouselClickBound);
    if (this.showIndicators && this._indicators) {
      this._indicators.querySelectorAll('.indicator-item').forEach((el) => {
        el.removeEventListener('click', this._handleIndicatorClickBound);
      });
    }
    window.removeEventListener('resize', this._handleThrottledResizeBound);
  }

  _handleCarouselTap(e) {
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
    this.ticker = setInterval(this._trackBound, 100);
  }

  _handleCarouselDrag(e) {
    let x, y, delta, deltaY;
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
  }

  _handleCarouselRelease(e) {
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
    requestAnimationFrame(this._autoScrollBound);
    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  }

  _handleCarouselClick(e) {
    // Disable clicks if carousel was dragged.
    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    else if (!this.options.fullWidth) {
      const clickedElem = (<HTMLElement>e.target).closest('.carousel-item');
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
        if (e.clientX - e.target.getBoundingClientRect().left > this.el.clientWidth / 2) {
          this.next();
        } else {
          this.prev();
        }
      } else {
        this._cycleTo(clickedIndex);
      }
    }
  }

  _handleIndicatorClick(e: Event) {
    e.stopPropagation();
    const indicator = (<HTMLElement>e.target).closest('.indicator-item');
    if (indicator) {
      const index = [...indicator.parentNode.children].indexOf(indicator);
      this._cycleTo(index);
    }
  }

  _handleResize(e) {
    if (this.options.fullWidth) {
      this.itemWidth = this.el.querySelector('.carousel-item').clientWidth;
      this.imageHeight = this.el.querySelector('.carousel-item.active').clientHeight;
      this.dim = this.itemWidth * 2 + this.options.padding;
      this.offset = this.center * 2 * this.itemWidth;
      this.target = this.offset;
      this._setCarouselHeight(true);
    }
    else {
      this._scroll();
    }
  }

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
          this.el.style.height = imageHeight+'px';
        }
        else {
          // If image still has no height, use the natural dimensions to calculate
          const naturalWidth = firstImage.naturalWidth;
          const naturalHeight = firstImage.naturalHeight;
          const adjustedHeight = (this.el.clientWidth / naturalWidth) * naturalHeight;
          this.el.style.height = adjustedHeight+'px';
        }
      } else {
        // Get height when image is loaded normally
        firstImage.addEventListener('load', () => {
          this.el.style.height = firstImage.offsetHeight+'px';
        });
      }
    }
    else if (!imageOnly) {
      const slideHeight = firstSlide.clientHeight;
      this.el.style.height = slideHeight+'px';
    }
  }

  _xpos(e) {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientX;
    }
    // mouse event
    return e.clientX;
  }

  _ypos(e) {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientY;
    }
    // mouse event
    return e.clientY;
  }

  _wrap(x: number) {
    return x >= this.count
      ? x % this.count
      : x < 0
      ? this._wrap(this.count + (x % this.count))
      : x;
  }

  _track() {
    let now, elapsed, delta, v;
    now = Date.now();
    elapsed = now - this.timestamp;
    this.timestamp = now;
    delta = this.offset - this.frame;
    this.frame = this.offset;
    v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  }

  _autoScroll() {
    let elapsed, delta;
    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = this.amplitude * Math.exp(-elapsed / this.options.duration);
      if (delta > 2 || delta < -2) {
        this._scroll(this.target - delta);
        requestAnimationFrame(this._autoScrollBound);
      } else {
        this._scroll(this.target);
      }
    }
  }

  _scroll(x: number = 0) {
    // Track scrolling state
    if (!this.el.classList.contains('scrolling')) {
      this.el.classList.add('scrolling');
    }
    if (this.scrollingTimeout != null) {
      window.clearTimeout(this.scrollingTimeout);
    }
    this.scrollingTimeout = window.setTimeout(() => {
      this.el.classList.remove('scrolling');
    }, this.options.duration);

    // Start actual scroll
    let i,
      half,
      delta,
      dir,
      tween,
      el,
      alignment,
      zTranslation,
      tweenedOpacity,
      centerTweenedOpacity;
    let lastCenter = this.center;
    let numVisibleOffset = 1 / this.options.numVisible;

    this.offset = typeof x === 'number' ? x : this.offset;
    this.center = Math.floor((this.offset + this.dim / 2) / this.dim);

    delta = this.offset - this.center * this.dim;
    dir = delta < 0 ? 1 : -1;
    tween = (-dir * delta * 2) / this.dim;
    half = this.count >> 1;

    if (this.options.fullWidth) {
      alignment = 'translateX(0)';
      centerTweenedOpacity = 1;
    }
    else {
      alignment = 'translateX(' + (this.el.clientWidth - this.itemWidth) / 2 + 'px) ';
      alignment += 'translateY(' + (this.el.clientHeight - this.itemHeight) / 2 + 'px)';
      centerTweenedOpacity = 1 - numVisibleOffset * tween;
    }

    // Set indicator active
    if (this.showIndicators) {
      const diff = this.center % this.count;
      const activeIndicator = this._indicators.querySelector('.indicator-item.active');
      const activeIndicatorIndex = [...activeIndicator.parentNode.children].indexOf(activeIndicator);
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

      let transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir *
        this.options.shift *
        tween *
        i}px) translateZ(${this.options.dist * tween}px)`;
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
        let transformString = `${alignment} translateX(${this.options.shift +
          (this.dim * i - delta) / 2}px) translateZ(${zTranslation}px)`;
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
        let transformString = `${alignment} translateX(${-this.options.shift +
          (-this.dim * i - delta) / 2}px) translateZ(${zTranslation}px)`;
        this._updateItemStyle(el, tweenedOpacity, -i, transformString);
      }
    }
    // center
    // Don't show wrapped items.
    if (!this.noWrap || (this.center >= 0 && this.center < this.count)) {
      el = this.images[this._wrap(this.center)];
      let transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir *
        this.options.shift *
        tween}px) translateZ(${this.options.dist * tween}px)`;
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

  _cycleTo(n: number, callback: Function = null) {
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
      requestAnimationFrame(this._autoScrollBound);
    }
  }

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

  set(n: number, callback: Function) {
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
