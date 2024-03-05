import { Carousel } from "./carousel";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface TabsOptions extends BaseOptions {
  /**
   * Transition duration in milliseconds.
   * @default 300
   */
  duration: number;
  /**
   * Callback for when a new tab content is shown.
   * @default null
   */
  onShow: (newContent: Element) => void;
  /**
   * Set to true to enable swipeable tabs.
   * This also uses the responsiveThreshold option.
   * @default false
   */
  swipeable: boolean;
  /**
   * The maximum width of the screen, in pixels,
   * where the swipeable functionality initializes.
   * @default infinity
   */
  responsiveThreshold: number;
};

let _defaults: TabsOptions = {
  duration: 300,
  onShow: null,
  swipeable: false,
  responsiveThreshold: Infinity // breakpoint for swipeable
};

export class Tabs extends Component<TabsOptions> {
  _tabLinks: NodeListOf<HTMLAnchorElement>;
  _index: number;
  _indicator: HTMLLIElement;
  _tabWidth: number;
  _tabsWidth: number;
  _tabsCarousel: any;
  _activeTabLink: any;
  _content: any;

  constructor(el: HTMLElement, options: Partial<TabsOptions>) {
    super(el, options, Tabs);
    (this.el as any).M_Tabs = this;

    this.options = {
      ...Tabs.defaults,
      ...options
    };

    this._tabLinks = this.el.querySelectorAll('li.tab > a');
    this._index = 0;
    this._setupActiveTabLink();
    if (this.options.swipeable) {
      this._setupSwipeableTabs();
    } else {
      this._setupNormalTabs();
    }
    // Setup tabs indicator after content to ensure accurate widths
    this._setTabsAndTabWidth();
    this._createIndicator();
    this._setupEventHandlers();
  }

  static get defaults(): TabsOptions {
    return _defaults;
  }

  /**
   * Initializes instance of Tabs.
   * @param el HTML element.
   * @param options Component options.
   */
  static init(el: HTMLElement, options?: Partial<TabsOptions>): Tabs;
  /**
   * Initializes instances of Tabs.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: InitElements<MElement>, options?: Partial<TabsOptions>): Tabs[];
  /**
   * Initializes instances of Tabs.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLElement | InitElements<MElement>, options: Partial<TabsOptions> = {}): Tabs | Tabs[] {
    return super.init(els, options, Tabs);
  }

  static getInstance(el: HTMLElement): Tabs {
    return (el as any).M_Tabs;
  }

  destroy() {
    this._removeEventHandlers();
    this._indicator.parentNode.removeChild(this._indicator);
    if (this.options.swipeable) {
      this._teardownSwipeableTabs();
    }
    else {
      this._teardownNormalTabs();
    }
    (this.el as any).M_Tabs = undefined;
  }

  /**
   * The index of tab that is currently shown.
   */
  get index(){ return this._index; }

  _setupEventHandlers() {
    window.addEventListener('resize', this._handleWindowResize);
    this.el.addEventListener('click', this._handleTabClick);
  }

  _removeEventHandlers() {
    window.removeEventListener('resize', this._handleWindowResize);
    this.el.removeEventListener('click', this._handleTabClick);
  }

  _handleWindowResize = () => {
    this._setTabsAndTabWidth();
    if (this._tabWidth !== 0 && this._tabsWidth !== 0) {
      this._indicator.style.left = this._calcLeftPos(this._activeTabLink)+'px';
      this._indicator.style.right = this._calcRightPos(this._activeTabLink)+'px';
    }
  }

  _handleTabClick = (e: MouseEvent) => {
    const tabLink = e.target as HTMLAnchorElement;
    const tab = tabLink.parentElement;
    // Handle click on tab link only
    if (!tabLink || !tab.classList.contains('tab')) return;
    // is disabled?
    if (tab.classList.contains('disabled')) {
      e.preventDefault();
      return;
    }
    // Act as regular link if target attribute is specified.
    if (tabLink.hasAttribute('target')) return;
    // Make the old tab inactive.
    this._activeTabLink.classList.remove('active');
    const _oldContent = this._content;
    // Update the variables with the new link and content

      this._activeTabLink = tabLink;
      if (tabLink.hash)
        this._content = document.querySelector(tabLink.hash);
      this._tabLinks = this.el.querySelectorAll('li.tab > a');
      // Make the tab active
      this._activeTabLink.classList.add('active');
      const prevIndex = this._index;
      this._index = Math.max(Array.from(this._tabLinks).indexOf(tabLink), 0);

    // Swap content
    if (this.options.swipeable) {
      if (this._tabsCarousel) {
        this._tabsCarousel.set(this._index, () => {
          if (typeof this.options.onShow === 'function')
            this.options.onShow.call(this, this._content);
        });
      }
    } else {
      if (this._content) {
        this._content.style.display = 'block';
        this._content.classList.add('active');
        if (typeof this.options.onShow === 'function')
          this.options.onShow.call(this, this._content);
        if (_oldContent && _oldContent !== this._content) {
          _oldContent.style.display = 'none';
          _oldContent.classList.remove('active');
        }
      }
    }
    // Update widths after content is swapped (scrollbar bugfix)
    this._setTabsAndTabWidth();
    this._animateIndicator(prevIndex);
    e.preventDefault();
  }

  _createIndicator() {
    const indicator = document.createElement('li');
    indicator.classList.add('indicator');
    this.el.appendChild(indicator);
    this._indicator = indicator;
    this._indicator.style.left = this._calcLeftPos(this._activeTabLink)+'px';
    this._indicator.style.right = this._calcRightPos(this._activeTabLink)+'px';
  }

  _setupActiveTabLink() {
    // If the location.hash matches one of the links, use that as the active tab.
    this._activeTabLink = Array.from(this._tabLinks).find((a: HTMLAnchorElement) => a.getAttribute('href') === location.hash);
    // If no match is found, use the first link or any with class 'active' as the initial active tab.
    if (!this._activeTabLink) {
      this._activeTabLink = this.el.querySelector('li.tab a.active');
    }
    if (this._activeTabLink.length === 0) {
      this._activeTabLink = this.el.querySelector('li.tab a');
    }
    Array.from(this._tabLinks).forEach((a: HTMLAnchorElement) => a.classList.remove('active'));
    this._activeTabLink.classList.add('active');

      this._index = Math.max(Array.from(this._tabLinks).indexOf(this._activeTabLink), 0);
      if (this._activeTabLink && this._activeTabLink.hash) {
        this._content = document.querySelector(this._activeTabLink.hash);
        if (this._content) 
          this._content.classList.add('active');
      }
    }

  _setupSwipeableTabs() {
    // Change swipeable according to responsive threshold
    if (window.innerWidth > this.options.responsiveThreshold)
      this.options.swipeable = false;

      const tabsContent = [];
      this._tabLinks.forEach(a => {
        if (a.hash) {
          const currContent = document.querySelector(a.hash);
          currContent.classList.add('carousel-item');
          tabsContent.push(currContent);  
        }
      });

    // Create Carousel-Wrapper around Tab-Contents
    const tabsWrapper = document.createElement('div');
    tabsWrapper.classList.add('tabs-content', 'carousel', 'carousel-slider');

    // Wrap around
    tabsContent[0].parentElement.insertBefore(tabsWrapper, tabsContent[0]);
    tabsContent.forEach(tabContent => {
      tabsWrapper.appendChild(tabContent);
      tabContent.style.display = '';
    });

    // Keep active tab index to set initial carousel slide
    const tab = this._activeTabLink.parentElement;
    const activeTabIndex = Array.from(tab.parentNode.children).indexOf(tab);

    this._tabsCarousel = Carousel.init(tabsWrapper, {
      fullWidth: true,
      noWrap: true,
      onCycleTo: (item) => {
        const prevIndex = this._index;
        this._index = Array.from(item.parentNode.children).indexOf(item);
        this._activeTabLink.classList.remove('active');
        this._activeTabLink = Array.from(this._tabLinks)[this._index];
        this._activeTabLink.classList.add('active');
        this._animateIndicator(prevIndex);
        if (typeof this.options.onShow === 'function')
          this.options.onShow.call(this, this._content);
      }
    });
    // Set initial carousel slide to active tab
    this._tabsCarousel.set(activeTabIndex);
  }

  _teardownSwipeableTabs() {
    const tabsWrapper = this._tabsCarousel.el;
    this._tabsCarousel.destroy();
    // Unwrap
    tabsWrapper.after(tabsWrapper.children);
    tabsWrapper.remove();
  }

  _setupNormalTabs() {
    // Hide Tabs Content
    Array.from(this._tabLinks).forEach((a) => {
      if (a === this._activeTabLink) return;
      if ((<HTMLAnchorElement>a).hash) {
        const currContent = document.querySelector((<HTMLAnchorElement>a).hash);
        if (currContent) (<HTMLElement>currContent).style.display = 'none';
      }
    });
  }

  _teardownNormalTabs() {
    // show Tabs Content
    this._tabLinks.forEach((a) => {
      if (a.hash) {
        const currContent = document.querySelector(a.hash) as HTMLElement;
        if (currContent) currContent.style.display = '';
      }
    });
  }

  _setTabsAndTabWidth() {
    this._tabsWidth = this.el.getBoundingClientRect().width;
    this._tabWidth = Math.max(this._tabsWidth, this.el.scrollWidth) / this._tabLinks.length;
  }

  _calcRightPos(el) {
    return Math.ceil(this._tabsWidth - el.offsetLeft - el.getBoundingClientRect().width);
  }

  _calcLeftPos(el) {
    return Math.floor(el.offsetLeft);
  }

  /**
   * Recalculate tab indicator position. This is useful when
   * the indicator position is not correct.
   */
  updateTabIndicator() {
    this._setTabsAndTabWidth();
    this._animateIndicator(this._index);
  }

  _animateIndicator(prevIndex) {
    let leftDelay = 0, rightDelay = 0;

    const isMovingLeftOrStaying = (this._index - prevIndex >= 0);
    if (isMovingLeftOrStaying)
      leftDelay = 90;
    else
      rightDelay = 90;

    // in v1: easeOutQuad
    this._indicator.style.transition = `
      left ${this.options.duration}ms ease-out ${leftDelay}ms,
      right ${this.options.duration}ms ease-out ${rightDelay}ms`;

    this._indicator.style.left = this._calcLeftPos(this._activeTabLink) + 'px';
    this._indicator.style.right = this._calcRightPos(this._activeTabLink) + 'px';
  }

  /**
   * Show tab content that corresponds to the tab with the id.
   * @param tabId The id of the tab that you want to switch to.
   */
  select(tabId: string) {
    const tab = Array.from(this._tabLinks).find((a: HTMLAnchorElement) => a.getAttribute('href') === '#'+tabId);
    if (tab) (<HTMLAnchorElement>tab).click();
  }
}
