import { Component } from "./component";
import { M } from "./global";
import anim from "animejs";

let _defaults = {
  throttle: 100,
  scrollOffset: 200, // offset - 200 allows elements near bottom of page to scroll
  activeClass: 'active',
  getActiveElement: (id: string): string => { return 'a[href="#'+id+'"]'; }
};

export class ScrollSpy extends Component {
  el: HTMLElement;
  static _elements: ScrollSpy[];
  static _count: number;
  static _increment: number;
  tickId: number;
  id: any;
  static _elementsInView: ScrollSpy[];
  static _visibleElements: any[];
  static _ticks: number;

  constructor(el, options) {
    super(ScrollSpy, el, options);
    (this.el as any).M_ScrollSpy = this;
    this.options = {...ScrollSpy.defaults, ...options};
    ScrollSpy._elements.push(this);
    ScrollSpy._count++;
    ScrollSpy._increment++;
    this.tickId = -1;
    this.id = ScrollSpy._increment;
    this._setupEventHandlers();
    this._handleWindowScroll();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    let domElem = !!el.jquery ? el[0] : el;
    return domElem.M_ScrollSpy;
  }

  destroy() {
    ScrollSpy._elements.splice(ScrollSpy._elements.indexOf(this), 1);
    ScrollSpy._elementsInView.splice(ScrollSpy._elementsInView.indexOf(this), 1);
    ScrollSpy._visibleElements.splice(ScrollSpy._visibleElements.indexOf(this.el), 1);
    ScrollSpy._count--;
    this._removeEventHandlers();
    const actElem = document.querySelector(this.options.getActiveElement(this.el.id));
    actElem.classList.remove(this.options.activeClass);
    (this.el as any).M_ScrollSpy = undefined;
  }

  _setupEventHandlers() {
    if (ScrollSpy._count === 1) {
      window.addEventListener('scroll', this._handleWindowScroll);
      window.addEventListener('resize', this._handleThrottledResize);
      document.body.addEventListener('click', this._handleTriggerClick);
    }
  }

  _removeEventHandlers() {
    if (ScrollSpy._count === 0) {
      window.removeEventListener('scroll', this._handleWindowScroll);
      window.removeEventListener('resize', this._handleThrottledResize);
      document.body.removeEventListener('click', this._handleTriggerClick);
    }
  }

  _handleThrottledResize = (() => M.throttle(function(){ this._handleWindowScroll(); }, 200).bind(this))(); 

  _handleTriggerClick = (e) => {
    const trigger = e.target;
    for (let i = ScrollSpy._elements.length - 1; i >= 0; i--) {
      const scrollspy = ScrollSpy._elements[i];

      const x = document.querySelector('a[href="#'+scrollspy.el.id+'"]');
      if (trigger === x) {
        e.preventDefault();
        const offset = ScrollSpy._offset(scrollspy.el).top + 1;

        anim({
          targets: [document.documentElement, document.body],
          scrollTop: offset - scrollspy.options.scrollOffset,
          duration: 400,
          easing: 'easeOutCubic'
        });

        break;
      }
    }
  }

  _handleWindowScroll = () => {
    // unique tick id
    ScrollSpy._ticks++;

    // viewport rectangle
    let top = M.getDocumentScrollTop(),
      left = M.getDocumentScrollLeft(),
      right = left + window.innerWidth,
      bottom = top + window.innerHeight;

    // determine which elements are in view
    let intersections = ScrollSpy._findElements(top, right, bottom, left);
    for (let i = 0; i < intersections.length; i++) {
      let scrollspy = intersections[i];
      let lastTick = scrollspy.tickId;
      if (lastTick < 0) {
        // entered into view
        scrollspy._enter();
      }

      // update tick id
      scrollspy.tickId = ScrollSpy._ticks;
    }

    for (let i = 0; i < ScrollSpy._elementsInView.length; i++) {
      let scrollspy = ScrollSpy._elementsInView[i];
      let lastTick = scrollspy.tickId;
      if (lastTick >= 0 && lastTick !== ScrollSpy._ticks) {
        // exited from view
        scrollspy._exit();
        scrollspy.tickId = -1;
      }
    }
    // remember elements in view for next tick
    ScrollSpy._elementsInView = intersections;
  }

  static _offset(el) {
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }

  static _findElements(top: number, right: number, bottom: number, left: number): ScrollSpy[] {
    let hits = [];
    for (let i = 0; i < ScrollSpy._elements.length; i++) {
      let scrollspy = ScrollSpy._elements[i];
      let currTop = top + scrollspy.options.scrollOffset || 200;

      if (scrollspy.el.getBoundingClientRect().height > 0) {
        let elTop = ScrollSpy._offset(scrollspy.el).top,
          elLeft = ScrollSpy._offset(scrollspy.el).left,
          elRight = elLeft + scrollspy.el.getBoundingClientRect().width,
          elBottom = elTop + scrollspy.el.getBoundingClientRect().height;

        let isIntersect = !(
          elLeft > right ||
          elRight < left ||
          elTop > bottom ||
          elBottom < currTop
        );

        if (isIntersect) {
          hits.push(scrollspy);
        }
      }
    }
    return hits;
  }

  _enter() {
    ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter(value => value.getBoundingClientRect().height !== 0);

    if (ScrollSpy._visibleElements[0]) {
      const actElem = document.querySelector(this.options.getActiveElement(ScrollSpy._visibleElements[0].id));
      actElem?.classList.remove(this.options.activeClass);

      if (ScrollSpy._visibleElements[0].M_ScrollSpy && this.id < ScrollSpy._visibleElements[0].M_ScrollSpy.id) {
        ScrollSpy._visibleElements.unshift(this.el);
      }
      else {
        ScrollSpy._visibleElements.push(this.el);
      }
    }
    else {
      ScrollSpy._visibleElements.push(this.el);
    }
    const selector = this.options.getActiveElement(ScrollSpy._visibleElements[0].id);
    document.querySelector(selector)?.classList.add(this.options.activeClass);
  }

  _exit() {
    ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter(value => value.getBoundingClientRect().height !== 0);

    if (ScrollSpy._visibleElements[0]) {
      const actElem = document.querySelector(this.options.getActiveElement(ScrollSpy._visibleElements[0].id));
      actElem?.classList.remove(this.options.activeClass);

      ScrollSpy._visibleElements = ScrollSpy._visibleElements.filter((x) => x.id != this.el.id);

      if (ScrollSpy._visibleElements[0]) {
        // Check if empty
        const selector = this.options.getActiveElement(ScrollSpy._visibleElements[0].id);
        document.querySelector(selector)?.classList.add(this.options.activeClass);
      }
    }
  }

  static {
    ScrollSpy._elements = [];
    ScrollSpy._elementsInView = [];
    ScrollSpy._visibleElements = []; // Array.<cash>
    ScrollSpy._count = 0;
    ScrollSpy._increment = 0;
    ScrollSpy._ticks = 0;
  }
}
