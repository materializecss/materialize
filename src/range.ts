import { Component } from "./component";
import anim from "animejs";

const _defaults = {};

// TODO: !!!!!

export class Range extends Component {
  el: HTMLInputElement;
  private _mousedown: boolean;
  private _handleRangeChangeBound: any;
  private _handleRangeMousedownTouchstartBound: any;
  private _handleRangeInputMousemoveTouchmoveBound: any;
  private _handleRangeMouseupTouchendBound: any;
  private _handleRangeBlurMouseoutTouchleaveBound: any;
  value: HTMLElement;
  thumb: HTMLElement;

  constructor(el, options) {
    super(Range, el, options);
    (this.el as any).M_Range = this;
    this.options = {...Range.defaults, ...options};
    this._mousedown = false;
    this._setupThumb();
    this._setupEventHandlers();
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Range;
  }

  destroy() {
    this._removeEventHandlers();
    this._removeThumb();
    (this.el as any).M_Range = undefined;
  }

  _setupEventHandlers() {
    this._handleRangeChangeBound = this._handleRangeChange.bind(this);
    this._handleRangeMousedownTouchstartBound = this._handleRangeMousedownTouchstart.bind(this);
    this._handleRangeInputMousemoveTouchmoveBound = this._handleRangeInputMousemoveTouchmove.bind(this);
    this._handleRangeMouseupTouchendBound = this._handleRangeMouseupTouchend.bind(this);
    this._handleRangeBlurMouseoutTouchleaveBound = this._handleRangeBlurMouseoutTouchleave.bind(this);
    this.el.addEventListener('change', this._handleRangeChangeBound);
    this.el.addEventListener('mousedown', this._handleRangeMousedownTouchstartBound);
    this.el.addEventListener('touchstart', this._handleRangeMousedownTouchstartBound);
    this.el.addEventListener('input', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.addEventListener('mousemove', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.addEventListener('touchmove', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.addEventListener('mouseup', this._handleRangeMouseupTouchendBound);
    this.el.addEventListener('touchend', this._handleRangeMouseupTouchendBound);
    this.el.addEventListener('blur', this._handleRangeBlurMouseoutTouchleaveBound);
    this.el.addEventListener('mouseout', this._handleRangeBlurMouseoutTouchleaveBound);
    this.el.addEventListener('touchleave', this._handleRangeBlurMouseoutTouchleaveBound);
  }

  _removeEventHandlers() {
    this.el.removeEventListener('change', this._handleRangeChangeBound);
    this.el.removeEventListener('mousedown', this._handleRangeMousedownTouchstartBound);
    this.el.removeEventListener('touchstart', this._handleRangeMousedownTouchstartBound);
    this.el.removeEventListener('input', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.removeEventListener('mousemove', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.removeEventListener('touchmove', this._handleRangeInputMousemoveTouchmoveBound);
    this.el.removeEventListener('mouseup', this._handleRangeMouseupTouchendBound);
    this.el.removeEventListener('touchend', this._handleRangeMouseupTouchendBound);
    this.el.removeEventListener('blur', this._handleRangeBlurMouseoutTouchleaveBound);
    this.el.removeEventListener('mouseout', this._handleRangeBlurMouseoutTouchleaveBound);
    this.el.removeEventListener('touchleave', this._handleRangeBlurMouseoutTouchleaveBound);
  }

  _handleRangeChange() {
    this.value.innerHTML = this.el.value;
    if (!this.thumb.classList.contains('active')) {
      this._showRangeBubble();
    }
    const offsetLeft = this._calcRangeOffset();
    this.thumb.classList.add('active');
    this.thumb.style.left = offsetLeft+'px';
  }

  _handleRangeMousedownTouchstart(e) {
    // Set indicator value
    this.value.innerHTML = this.el.value;
    this._mousedown = true;
    this.el.classList.add('active');
    if (!this.thumb.classList.contains('active')) {
      this._showRangeBubble();
    }
    if (e.type !== 'input') {
      const offsetLeft = this._calcRangeOffset();
      this.thumb.classList.add('active');
      this.thumb.style.left = offsetLeft+'px';
    }
  }

  _handleRangeInputMousemoveTouchmove() {
    if (this._mousedown) {
      if (!this.thumb.classList.contains('active')) {
        this._showRangeBubble();
      }
      const offsetLeft = this._calcRangeOffset();
      this.thumb.classList.add('active');
      this.thumb.style.left = offsetLeft+'px';
      this.value.innerHTML = this.el.value;
    }
  }

  _handleRangeMouseupTouchend() {
    this._mousedown = false;
    this.el.classList.remove('active');
  }

  _handleRangeBlurMouseoutTouchleave() {
    if (!this._mousedown) {
      const paddingLeft = parseInt(getComputedStyle(this.el).paddingLeft);
      const marginLeft = 7 + paddingLeft + 'px';
      if (this.thumb.classList.contains('active')) {
        anim.remove(this.thumb);
        anim({
          targets: this.thumb,
          height: 0,
          width: 0,
          top: 10,
          easing: 'easeOutQuad',
          marginLeft: marginLeft,
          duration: 100
        });
      }
      this.thumb.classList.remove('active');
    }
  }

  _setupThumb() {
    this.thumb = document.createElement('span');
    this.value = document.createElement('span');
    this.thumb.classList.add('thumb');
    this.value.classList.add('value');
    this.thumb.append(this.value);
    this.el.after(this.thumb);
  }

  _removeThumb() {
    this.thumb.remove();
  }

  _showRangeBubble() {
    const paddingLeft = parseInt(getComputedStyle(this.thumb.parentElement).paddingLeft);
    const marginLeft = -7 + paddingLeft + 'px'; // TODO: fix magic number?
    anim.remove(this.thumb);
    anim({
      targets: this.thumb,
      height: 30,
      width: 30,
      top: -30,
      marginLeft: marginLeft,
      duration: 300,
      easing: 'easeOutQuint'
    });
  }

  _calcRangeOffset(): number {
    const width = this.el.getBoundingClientRect().width - 15;
    const max = parseFloat(this.el.getAttribute('max')) || 100; // Range default max
    const min = parseFloat(this.el.getAttribute('min')) || 0; // Range default min
    const percent = (parseFloat(this.el.value) - min) / (max - min);
    return percent * width;
  }

  static Init(){
    Range.init(document.querySelectorAll('input[type=range]'), {});
  }
}
