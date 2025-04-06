export interface ModalDisplayPluginOptions {
  /**
   * Classes to add on modal container.
   */
  classList: string[],
  /**
   * Title element.
   */
  title: HTMLElement|null
}

const _defaults: ModalDisplayPluginOptions = {
  classList: ['modal'],
  title: null
}

export class ModalDisplayPlugin {
  private readonly el: HTMLElement;
  private readonly container: HTMLDialogElement;
  private options: Partial<ModalDisplayPluginOptions>;
  private visible: boolean;
  footer: HTMLElement;

  constructor(el: HTMLElement, container: HTMLElement, options: Partial<ModalDisplayPluginOptions>) {
    this.el = el;
    this.options = {
      ..._defaults,
      ...options,
    };

    this.container = document.createElement('dialog');
    this.container.classList.add('modal', 'display-modal', this.options.classList.join(' '));

    if(options.title) {
      const modalHeader = document.createElement('div');
      modalHeader.classList.add('modal-header');
      modalHeader.append(options.title);
      this.container.append(modalHeader);
    }

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.append(container);
    this.container.append(modalContent);

    this.footer = document.createElement('div');
    this.footer.classList.add('modal-footer');
    this.container.append(this.footer);

    document.body.append(this.container);

    document.addEventListener('click', (e) => {
      if (this.visible && !(this.el === <HTMLElement>e.target) && !((<HTMLElement>e.target).closest('.display-modal'))) {
        this.hide();
      }
    });
  }

  /**
   * Initializes instance of ModalDisplayPlugin
   * @param el HTMLElement to position to
   * @param container HTMLElement to be positioned
   * @param options Plugin options
   */
  static init(el: HTMLElement, container: HTMLElement, options?: Partial<ModalDisplayPluginOptions>): ModalDisplayPlugin {
    return new ModalDisplayPlugin(el, container, options);
  }

  show = () => {
    if (this.visible) return;
    this.visible = true;
    this.container.setAttribute('open', 'true');
  };

  hide = () => {
    if (!this.visible) return;
    this.visible = false;
    this.container.removeAttribute('open');
  };
}
