import { Utils } from './utils';

export interface DockedDisplayPluginOptions {
  /**
   * Margin between element and docked container
   */
  margin: number;
  /**
   * Transition movement
   */
  transition: number;
  /**
   * Transition duration
   */
  duration: number;
  /**
   * The alignment of the docked container
   */
  align: string;
}

const _defaults: DockedDisplayPluginOptions = {
  margin: 5,
  transition: 10,
  duration: 250,
  align: 'left'
};

export class DockedDisplayPlugin {
  private readonly el: HTMLElement;
  private readonly container: HTMLDivElement;
  private options: Partial<DockedDisplayPluginOptions>;
  private visible: boolean;

  constructor(
    el: HTMLElement,
    container: HTMLElement,
    options: Partial<DockedDisplayPluginOptions>
  ) {
    this.el = el;
    this.options = {
      ..._defaults,
      ...options
    };

    this.container = document.createElement('div');
    this.container.classList.add('display-docked');
    this.container.append(container);
    el.parentElement.append(this.container);

    document.addEventListener('click', (e) => {
      if (
        this.visible &&
        !(this.el === <HTMLElement>e.target) &&
        !(<HTMLElement>e.target).closest('.display-docked')
      ) {
        this.hide();
      }
    }, true);
  }

  /**
   * Initializes instance of DockedDisplayPlugin
   * @param el HTMLElement to position to
   * @param container HTMLElement to be positioned
   * @param options Plugin options
   */
  static init(
    el: HTMLElement,
    container: HTMLElement,
    options?: Partial<DockedDisplayPluginOptions>
  ): DockedDisplayPlugin {
    return new DockedDisplayPlugin(el, container, options);
  }

  show = () => {
    if (this.visible) return;
    this.visible = true;
    const coordinates = Utils._setAbsolutePosition(
      this.el,
      this.container,
      'bottom',
      this.options.margin,
      this.options.transition,
      this.options.align
    );

    // @todo move to Util? -> duplicate code fragment with tooltip
    // easeOutCubic
    this.container.style.visibility = 'visible';
    this.container.style.transition = `
      transform ${this.options.duration}ms ease-out,
      opacity ${this.options.duration}ms ease-out`;
    setTimeout(() => {
      this.container.style.transform = `translateX(${coordinates.x}px) translateY(${coordinates.y}px)`;
      this.container.style.opacity = (1).toString();
    }, 1);
  };

  hide = () => {
    if (!this.visible) return;
    this.visible = false;
    // @todo move to Util? -> duplicate code fragment with tooltip
    this.container.removeAttribute('style');
    this.container.style.transition = `
      transform ${this.options.duration}ms ease-out,
      opacity ${this.options.duration}ms ease-out`;
    setTimeout(() => {
      this.container.style.transform = `translateX(0px) translateY(0px)`;
      this.container.style.opacity = '0';
    }, 1);
  };
}
