import { Component } from "./component";
import { M } from "./global";
import anim from "animejs";

let _defaults = {
  indicators: true,
  height: 400,
  duration: 500,
  interval: 6000,
  pauseOnFocus: true,
  pauseOnHover: true,
  indicatorLabelFunc: null // Function which will generate a label for the indicators (ARIA)
};

export class Slider extends Component {
  el: HTMLElement;
  _slider: HTMLUListElement;
  _slides: HTMLLIElement[];
  activeIndex: number;
  _activeSlide: HTMLLIElement;
  _indicators: HTMLLIElement[];
  interval: string | number | NodeJS.Timeout;
  eventPause: any;
  _hovered: boolean;
  _focused: boolean;
  _focusCurrent: boolean;
  _sliderId: string;

  constructor(el, options) {
    super(Slider, el, options);
    (this.el as any).M_Slider = this;
    this.options = {...Slider.defaults, ...options};

    // init props
    this.interval = null;
    this.eventPause = false;
    this._hovered = false;
    this._focused = false;
    this._focusCurrent = false;

    // setup
    this._slider = this.el.querySelector('.slides');
    this._slides = Array.from(this._slider.querySelectorAll('li'));
    this.activeIndex = this._slides.findIndex(li => li.classList.contains('active'));

    if (this.activeIndex !== -1) {
      this._activeSlide = this._slides[this.activeIndex];
    }

    this._setSliderHeight();

    // Sets element id if it does not have one
    if (this._slider.hasAttribute('id'))
      this._sliderId = this._slider.getAttribute('id');
    else {
      this._sliderId = 'slider-' + M.guid();
      this._slider.setAttribute('id', this._sliderId);
    }

    const placeholderBase64 = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    // Set initial positions of captions
    this._slides.forEach(slide => {
      // Caption
      //const caption = <HTMLElement|null>slide.querySelector('.caption');
      //if (caption) this._animateCaptionIn(caption, 0);
      // Set Images as Background Images
      const img = slide.querySelector('img');
      if (img) {
        if (img.src !== placeholderBase64) {
          img.style.backgroundImage = 'url('+ img.src +')';
          img.src = placeholderBase64;
        }
      }
      // Sets slide as focusable by code
      if (!slide.hasAttribute('tabindex'))
        slide.setAttribute('tabindex', '-1');
      // Removes initial visibility from "inactive" slides
      slide.style.visibility = 'hidden';
    });

    this._setupIndicators();

    // Show active slide
    if (this._activeSlide) {
      this._activeSlide.style.display = 'block';
      this._activeSlide.style.visibility = 'visible';
    }
    else {
      this.activeIndex = 0;
      this._slides[0].classList.add('active');
      this._slides[0].style.visibility = 'visible';
      this._activeSlide = this._slides[0];
      this._animateSlide(this._slides[0], true);
      /*anim({
        targets: this._slides[0],
        opacity: 1,
        duration: this.options.duration,
        easing: 'easeOutQuad'
      });
      */
      // Update indicators
      if (this.options.indicators) {
        this._indicators[this.activeIndex].children[0].classList.add('active');
      }
    }

    // Adjust height to current slide
    // TODO: ??? Code does not do what it says in comment
    /*
    this._activeSlide.querySelectorAll('img').forEach(el => {
      anim({
        targets: this._activeSlide.querySelector('.caption'),
        opacity: 1,
        translateX: 0,
        translateY: 0,
        duration: this.options.duration,
        easing: 'easeOutQuad'
      });
    });
    */

    this._setupEventHandlers();
    // auto scroll
    this.start();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    let domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Slider;
  }

  destroy() {
    this.pause();
    this._removeIndicators();
    this._removeEventHandlers();
    (this.el as any).M_Slider = undefined;
  }

  _setupEventHandlers() {
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

  _removeEventHandlers() {
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

  _handleIndicatorClick = (e) => {
    const el = (<HTMLElement>e.target).parentElement;
    const currIndex = [...el.parentNode.children].indexOf(el);
    this._focusCurrent = true;
    this.set(currIndex);
  }

  _handleAutoPauseHover = () => {
    this._hovered = true;
    if (this.interval != null) {
      this._pause(true);
    }
  }

  _handleAutoPauseFocus = () => {
    this._focused = true;
    if (this.interval != null) {
      this._pause(true);
    }
  }

  _handleAutoStartHover = () => {
    this._hovered = false;
    if (!(this.options.pauseOnFocus && this._focused) && this.eventPause) {
      this.start();
    }
  }

  _handleAutoStartFocus = () => {
    this._focused = false;
    if (!(this.options.pauseOnHover && this._hovered) && this.eventPause) {
      this.start();
    }
  }

  _handleInterval = () => {
    const activeElem = this._slider.querySelector('.active');
    let newActiveIndex = [...activeElem.parentNode.children].indexOf(activeElem);
    if (this._slides.length === newActiveIndex + 1)
      newActiveIndex = 0; // loop to start
    else
      newActiveIndex += 1;
    this.set(newActiveIndex);
  }

  _animateSlide(slide: HTMLElement, isDirectionIn: boolean): void {
    let dx = 0, dy = 0;
    anim({
      targets: slide,
      opacity: isDirectionIn ? [0, 1] : [1, 0],
      duration: this.options.duration,
      easing: 'easeOutQuad'
    });

    const caption = slide.querySelector('.caption');
    if (!caption) return;
    if (caption.classList.contains('center-align')) dy = -100;
    else if (caption.classList.contains('right-align')) dx = 100;
    else if (caption.classList.contains('left-align')) dx = -100;
    anim({
      targets: caption,
      opacity: isDirectionIn ? [0, 1] : [1, 0],
      translateX: isDirectionIn ? [dx, 0] : [0, dx],
      translateY: isDirectionIn ? [dy, 0] : [0, dy],
      duration: this.options.duration,
      delay: this.options.duration,
      easing: 'easeOutQuad'
    });
  }

  _setSliderHeight() {
    // If fullscreen, do nothing
    if (!this.el.classList.contains('fullscreen')) {
      if (this.options.indicators) {
        // Add height if indicators are present
        this.el.style.height = (this.options.height + 40)+'px'; //.css('height', this.options.height + 40 + 'px');
      }
      else {
        this.el.style.height = this.options.height+'px';
      }
      this._slider.style.height = this.options.height+'px';
    }
  }

  _setupIndicators() {
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

  _removeIndicators() {
    this.el.querySelector('ul.indicators').remove(); //find('ul.indicators').remove();
  }

  set(index: number) {
    // Wrap around indices.
    if (index >= this._slides.length) index = 0;
    else if (index < 0) index = this._slides.length - 1;

    // Only do if index changes
    if (this.activeIndex === index) return;

    this._activeSlide = this._slides[this.activeIndex];
    const _caption = <HTMLElement|null>this._activeSlide.querySelector('.caption');

    this._activeSlide.classList.remove('active');
    // Enables every slide
    this._slides.forEach(slide => slide.style.visibility = 'visible');

    //--- Hide active Slide + Caption
    // TODO: What does this do?
    anim({
      targets: this._activeSlide,
      opacity: 0,
      duration: this.options.duration,
      easing: 'easeOutQuad',
      complete: () => {
        this._slides.forEach(el => {
          if (el.classList.contains('active')) return;
          anim({
            targets: el,
            opacity: 0,
            translateX: 0,
            translateY: 0,
            duration: 0, // Animation with duration 0... why use anim at all then?
            easing: 'easeOutQuad'
          });
          // Disables invisible slides (for assistive technologies)
          el.style.visibility = 'hidden';
        });
      }
    });

    // Hide active Caption
    //this._animateCaptionIn(_caption, this.options.duration);
    _caption.style.opacity = '0';

    // Update indicators
    if (this.options.indicators) {
      const activeIndicator = this._indicators[this.activeIndex].children[0];
      const nextIndicator = this._indicators[index].children[0];
      activeIndicator.classList.remove('active');
      nextIndicator.classList.add('active');
      if (typeof this.options.indicatorLabelFunc === "function"){
        activeIndicator.ariaLabel = this.options.indicatorLabelFunc.call(this, this.activeIndex, false);
        nextIndicator.ariaLabel = this.options.indicatorLabelFunc.call(this, index, true);
      }
    }

    //--- Show new Slide + Caption
    this._animateSlide(this._slides[index], true);

    this._slides[index].classList.add('active');

    // TODO: Why focus? => causes uncontrollable page scroll
    /*
    if (this._focusCurrent) {
      this._slides[index].focus();
      this._focusCurrent = false;
    }
    */

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

  pause() {
    this._pause(false);
  }

  start() {
    clearInterval(this.interval);
    this.interval = setInterval(
      this._handleInterval,
      this.options.duration + this.options.interval
    );
    this.eventPause = false;
  }

  next() {
    let newIndex = this.activeIndex + 1;
    // Wrap around indices.
    if (newIndex >= this._slides.length) newIndex = 0;
    else if (newIndex < 0) newIndex = this._slides.length - 1;
    this.set(newIndex);
  }

  prev() {
    let newIndex = this.activeIndex - 1;
    // Wrap around indices.
    if (newIndex >= this._slides.length) newIndex = 0;
    else if (newIndex < 0) newIndex = this._slides.length - 1;
    this.set(newIndex);
  }
}
