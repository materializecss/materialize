import { Component } from "./component";
import { M } from "./global";
import anim from "animejs";

const _defaults = {
  edge: 'left',
  draggable: true,
  dragTargetWidth: '10px',
  inDuration: 250,
  outDuration: 200,
  onOpenStart: null,
  onOpenEnd: null,
  onCloseStart: null,
  onCloseEnd: null,
  preventScrolling: true
};

export class Sidenav extends Component {
  id: any;
  isOpen: boolean;
  isFixed: boolean;
  isDragged: boolean;
  lastWindowWidth: number;
  lastWindowHeight: number;
  static _sidenavs: any;
  private _overlay: HTMLElement;
  dragTarget: Element;
  private _startingXpos: number;
  private _xPos: number;
  private _time: number;
  private _width: number;
  private _initialScrollTop: number;
  private _verticallyScrolling: boolean;
  private deltaX: number;
  private velocityX: number;
  private percentOpen: number;

  constructor(el, options) {
    super(Sidenav, el, options);
    (this.el as any).M_Sidenav = this;
    this.id = this.el.id;
    this.options = {...Sidenav.defaults, ...options};
    this.isOpen = false;
    this.isFixed = this.el.classList.contains('sidenav-fixed');
    this.isDragged = false;
    // Window size variables for window resize checks
    this.lastWindowWidth = window.innerWidth;
    this.lastWindowHeight = window.innerHeight;
    this._createOverlay();
    this._createDragTarget();
    this._setupEventHandlers();
    this._setupClasses();
    this._setupFixed();
    Sidenav._sidenavs.push(this);
  }

  static get defaults() {
    return _defaults;
  }

  static init(els, options) {
    return super.init(this, els, options);
  }

  static getInstance(el) {
    const domElem = !!el.jquery ? el[0] : el;
    return domElem.M_Sidenav;
  }

  destroy() {
    this._removeEventHandlers();
    this._enableBodyScrolling();
    this._overlay.parentNode.removeChild(this._overlay);
    this.dragTarget.parentNode.removeChild(this.dragTarget);
    (this.el as any).M_Sidenav = undefined;
    (this.el as HTMLElement).style.transform = '';
    const index = Sidenav._sidenavs.indexOf(this);
    if (index >= 0) {
      Sidenav._sidenavs.splice(index, 1);
    }
  }

  _createOverlay() {
    this._overlay = document.createElement('div');
    this._overlay.classList.add('sidenav-overlay');
    this._overlay.addEventListener('click', this.close);
    document.body.appendChild(this._overlay);
  }

  _setupEventHandlers() {
    if (Sidenav._sidenavs.length === 0) {
      document.body.addEventListener('click', this._handleTriggerClick);
    }
    var passiveIfSupported: boolean = null;
    this.dragTarget.addEventListener('touchmove', this._handleDragTargetDrag, passiveIfSupported);
    this.dragTarget.addEventListener('touchend', this._handleDragTargetRelease);
    this._overlay.addEventListener('touchmove', this._handleCloseDrag, passiveIfSupported);
    this._overlay.addEventListener('touchend', this._handleCloseRelease);
    this.el.addEventListener('touchmove', this._handleCloseDrag, passiveIfSupported);
    this.el.addEventListener('touchend', this._handleCloseRelease);
    this.el.addEventListener('click', this._handleCloseTriggerClick);
    // Add resize for side nav fixed
    if (this.isFixed) {
      window.addEventListener('resize', this._handleWindowResize);
    }
  }

  _removeEventHandlers() {
    if (Sidenav._sidenavs.length === 1) {
      document.body.removeEventListener('click', this._handleTriggerClick);
    }
    this.dragTarget.removeEventListener('touchmove', this._handleDragTargetDrag);
    this.dragTarget.removeEventListener('touchend', this._handleDragTargetRelease);
    this._overlay.removeEventListener('touchmove', this._handleCloseDrag);
    this._overlay.removeEventListener('touchend', this._handleCloseRelease);
    this.el.removeEventListener('touchmove', this._handleCloseDrag);
    this.el.removeEventListener('touchend', this._handleCloseRelease);
    this.el.removeEventListener('click', this._handleCloseTriggerClick);

    // Remove resize for side nav fixed
    if (this.isFixed) {
      window.removeEventListener('resize', this._handleWindowResize);
    }
  }

  _handleTriggerClick(e) {
    const trigger = e.target.closest('.sidenav-trigger');
    if (e.target && trigger) {
      const sidenavId = M.getIdFromTrigger(trigger);
      const sidenavInstance = (document.getElementById(sidenavId) as any).M_Sidenav;
      if (sidenavInstance) {
        sidenavInstance.open(trigger);
      }
      e.preventDefault();
    }
  }

  // Set variables needed at the beginning of drag and stop any current transition.
  _startDrag(e) {
    const clientX = e.targetTouches[0].clientX;
    this.isDragged = true;
    this._startingXpos = clientX;
    this._xPos = this._startingXpos;
    this._time = Date.now();
    this._width = this.el.getBoundingClientRect().width;
    this._overlay.style.display = 'block';
    this._initialScrollTop = this.isOpen ? this.el.scrollTop : M.getDocumentScrollTop();
    this._verticallyScrolling = false;
    anim.remove(this.el);
    anim.remove(this._overlay);
  }

  //Set variables needed at each drag move update tick
  _dragMoveUpdate(e) {
    const clientX = e.targetTouches[0].clientX;
    const currentScrollTop = this.isOpen ? this.el.scrollTop : M.getDocumentScrollTop();
    this.deltaX = Math.abs(this._xPos - clientX);
    this._xPos = clientX;
    this.velocityX = this.deltaX / (Date.now() - this._time);
    this._time = Date.now();
    if (this._initialScrollTop !== currentScrollTop) {
      this._verticallyScrolling = true;
    }
  }

  _handleDragTargetDrag = (e) => {
    // Check if draggable
    if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
      return;
    }
    // If not being dragged, set initial drag start variables
    if (!this.isDragged) {
      this._startDrag(e);
    }
    // Run touchmove updates
    this._dragMoveUpdate(e);
    // Calculate raw deltaX
    let totalDeltaX = this._xPos - this._startingXpos;
    // dragDirection is the attempted user drag direction
    const dragDirection = totalDeltaX > 0 ? 'right' : 'left';
    // Don't allow totalDeltaX to exceed Sidenav width or be dragged in the opposite direction
    totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
    if (this.options.edge === dragDirection) {
      totalDeltaX = 0;
    }
    /**
     * transformX is the drag displacement
     * transformPrefix is the initial transform placement
     * Invert values if Sidenav is right edge
     */
    let transformX = totalDeltaX;
    let transformPrefix = 'translateX(-100%)';
    if (this.options.edge === 'right') {
      transformPrefix = 'translateX(100%)';
      transformX = -transformX;
    }
    // Calculate open/close percentage of sidenav, with open = 1 and close = 0
    this.percentOpen = Math.min(1, totalDeltaX / this._width);
    // Set transform and opacity styles
    (this.el as HTMLElement).style.transform = `${transformPrefix} translateX(${transformX}px)`;
    this._overlay.style.opacity = this.percentOpen.toString();
  }

  _handleDragTargetRelease = () => {
    if (this.isDragged) {
      if (this.percentOpen > 0.2) {
        this.open();
      } else {
        this._animateOut();
      }
      this.isDragged = false;
      this._verticallyScrolling = false;
    }
  }

  _handleCloseDrag = (e) => {
    if (this.isOpen) {
      // Check if draggable
      if (!this.options.draggable || this._isCurrentlyFixed() || this._verticallyScrolling) {
        return;
      }
      // If not being dragged, set initial drag start variables
      if (!this.isDragged) {
        this._startDrag(e);
      }
      // Run touchmove updates
      this._dragMoveUpdate(e);
      // Calculate raw deltaX
      let totalDeltaX = this._xPos - this._startingXpos;
      // dragDirection is the attempted user drag direction
      let dragDirection = totalDeltaX > 0 ? 'right' : 'left';
      // Don't allow totalDeltaX to exceed Sidenav width or be dragged in the opposite direction
      totalDeltaX = Math.min(this._width, Math.abs(totalDeltaX));
      if (this.options.edge !== dragDirection) {
        totalDeltaX = 0;
      }
      let transformX = -totalDeltaX;
      if (this.options.edge === 'right') {
        transformX = -transformX;
      }
      // Calculate open/close percentage of sidenav, with open = 1 and close = 0
      this.percentOpen = Math.min(1, 1 - totalDeltaX / this._width);
      // Set transform and opacity styles
      (this.el as HTMLElement).style.transform = `translateX(${transformX}px)`;
      this._overlay.style.opacity = this.percentOpen.toString();
    }
  }

  _handleCloseRelease = () => {
    if (this.isOpen && this.isDragged) {
      if (this.percentOpen > 0.8) {
        this._animateIn();
      } else {
        this.close();
      }
      this.isDragged = false;
      this._verticallyScrolling = false;
    }
  }

  // Handles closing of Sidenav when element with class .sidenav-close
  _handleCloseTriggerClick = (e) => {
    const closeTrigger = e.target.closest('.sidenav-close');
    if (closeTrigger && !this._isCurrentlyFixed()) {
      this.close();
    }
  }

  _handleWindowResize = () => {
    // Only handle horizontal resizes
    if (this.lastWindowWidth !== window.innerWidth) {
      if (window.innerWidth > 992) {
        this.open();
      } else {
        this.close();
      }
    }
    this.lastWindowWidth = window.innerWidth;
    this.lastWindowHeight = window.innerHeight;
  }

  _setupClasses() {
    if (this.options.edge === 'right') {
      this.el.classList.add('right-aligned');
      this.dragTarget.classList.add('right-aligned');
    }
  }

  _removeClasses() {
    this.el.classList.remove('right-aligned');
    this.dragTarget.classList.remove('right-aligned');
  }

  _setupFixed() {
    if (this._isCurrentlyFixed()) this.open();
  }

  _isCurrentlyFixed() {
    return this.isFixed && window.innerWidth > 992;
  }

  _createDragTarget() {
    const dragTarget = document.createElement('div');
    dragTarget.classList.add('drag-target');
    dragTarget.style.width = this.options.dragTargetWidth;
    document.body.appendChild(dragTarget);
    this.dragTarget = dragTarget;
  }

  _preventBodyScrolling() {
    document.body.style.overflow = 'hidden';
  }

  _enableBodyScrolling() {
    document.body.style.overflow = '';
  }

  open() {
    if (this.isOpen === true) return;
    this.isOpen = true;
    // Run onOpenStart callback
    if (typeof this.options.onOpenStart === 'function') {
      this.options.onOpenStart.call(this, this.el);
    }
    // Handle fixed Sidenav
    if (this._isCurrentlyFixed()) {
      anim.remove(this.el);
      anim({
        targets: this.el,
        translateX: 0,
        duration: 0,
        easing: 'easeOutQuad'
      });
      this._enableBodyScrolling();
      this._overlay.style.display = 'none';
    }
    // Handle non-fixed Sidenav
    else {
      if (this.options.preventScrolling) {
        this._preventBodyScrolling();
      }

      if (!this.isDragged || this.percentOpen != 1) {
        this._animateIn();
      }
    }
  }

  close = () => {
    if (this.isOpen === false) return;
    this.isOpen = false;
    // Run onCloseStart callback
    if (typeof this.options.onCloseStart === 'function') {
      this.options.onCloseStart.call(this, this.el);
    }
    // Handle fixed Sidenav
    if (this._isCurrentlyFixed()) {
      const transformX = this.options.edge === 'left' ? '-105%' : '105%';
      (this.el as HTMLElement).style.transform = `translateX(${transformX})`;
    }
    // Handle non-fixed Sidenav
    else {
      this._enableBodyScrolling();
      if (!this.isDragged || this.percentOpen != 0) {
        this._animateOut();
      } else {
        this._overlay.style.display = 'none';
      }
    }
  }

  _animateIn() {
    this._animateSidenavIn();
    this._animateOverlayIn();
  }

  _animateSidenavIn() {
    let slideOutPercent = this.options.edge === 'left' ? -1 : 1;
    if (this.isDragged) {
      slideOutPercent =
        this.options.edge === 'left'
          ? slideOutPercent + this.percentOpen
          : slideOutPercent - this.percentOpen;
    }
    anim.remove(this.el);
    anim({
      targets: this.el,
      translateX: [`${slideOutPercent * 100}%`, 0],
      duration: this.options.inDuration,
      easing: 'easeOutQuad',
      complete: () => {
        // Run onOpenEnd callback
        if (typeof this.options.onOpenEnd === 'function') {
          this.options.onOpenEnd.call(this, this.el);
        }
      }
    });
  }

  _animateOverlayIn() {
    let start = 0;
    if (this.isDragged) {
      start = this.percentOpen;
    }
    else {
      this._overlay.style.display = 'block';
    }
    anim.remove(this._overlay);
    anim({
      targets: this._overlay,
      opacity: [start, 1],
      duration: this.options.inDuration,
      easing: 'easeOutQuad'
    });
  }

  _animateOut() {
    this._animateSidenavOut();
    this._animateOverlayOut();
  }

  _animateSidenavOut() {
    const endPercent = this.options.edge === 'left' ? -1 : 1;
    let slideOutPercent = 0;
    if (this.isDragged) {
      slideOutPercent =
        this.options.edge === 'left'
          ? endPercent + this.percentOpen
          : endPercent - this.percentOpen;
    }

    anim.remove(this.el);
    anim({
      targets: this.el,
      translateX: [`${slideOutPercent * 100}%`, `${endPercent * 105}%`],
      duration: this.options.outDuration,
      easing: 'easeOutQuad',
      complete: () => {
        // Run onOpenEnd callback
        if (typeof this.options.onCloseEnd === 'function') {
          this.options.onCloseEnd.call(this, this.el);
        }
      }
    });
  }

  _animateOverlayOut() {
    anim.remove(this._overlay);
    anim({
      targets: this._overlay,
      opacity: 0,
      duration: this.options.outDuration,
      easing: 'easeOutQuad',
      complete: () => {
        this._overlay.style.display = 'none';
      }
    });
  }

  static  {
    Sidenav._sidenavs = [];
  }
}
