/**
 * Base options for component initialization.
 */
export interface BaseOptions {};

export type MElement = HTMLElement | Element;
export type InitElements<T extends MElement> = NodeListOf<T> | HTMLCollectionOf<T>;
type ComponentConstructor<T extends Component<O>, O extends BaseOptions> = {
  new (el: HTMLElement, options: Partial<O>): T
};
type ComponentType<C extends Component<O>, O extends BaseOptions> = ComponentConstructor<C, O> & typeof Component<O>;

export interface I18nOptions {
  cancel: string;
  clear: string;
  done: string;
}

export interface Openable {
  isOpen: boolean;
  open(): void;
  close(): void;
};

/**
 * Base class implementation for Materialize components.
 */
export class Component<O extends BaseOptions>{
  /**
   * The DOM element the plugin was initialized with.
   */
  el: HTMLElement;
  /**
   * The options the instance was initialized with.
   */
  options: O;

  /**
   * Constructs component instance and set everything up.
   */
  constructor(el: HTMLElement, options: Partial<O>, classDef: ComponentType<Component<O>, O>){
    // Display error if el is not a valid HTML Element
    if (!(el instanceof HTMLElement)) {
      console.error(Error(el + ' is not an HTML Element'));
    }
    // If exists, destroy and reinitialize in child
    const ins = classDef.getInstance(el);
    if (!!ins) {
      ins.destroy();
    }
    this.el = el;
  }

  /**
   * Initializes component instance.
   * @param el HTML element.
   * @param options Component options.
   * @param classDef Class definition.
   */
  protected static init<
    I extends HTMLElement, O extends BaseOptions, C extends Component<O>
  >(el: I, options: O, classDef: ComponentType<C, O>): C;
  /**
   * Initializes component instances.
   * @param els HTML elements.
   * @param options Component options.
   * @param classDef Class definition.
   */
  protected static init<
    I extends MElement, O extends BaseOptions, C extends Component<O>
  >(els: InitElements<I>, options: Partial<O>, classDef: ComponentType<C, O>): C[];
  /**
   * Initializes component instances.
   * @param els HTML elements.
   * @param options Component options.
   * @param classDef Class definition.
   */
  protected static init<
    I extends MElement, O extends BaseOptions, C extends Component<O>
  >(els: I | InitElements<I>, options: Partial<O>, classDef: ComponentType<C, O>): C | C[];
  /**
   * Initializes component instances.
   * @param els HTML elements.
   * @param options Component options.
   * @param classDef Class definition.
   */
  protected static init<
    I extends MElement, O extends BaseOptions, C extends Component<O>
  >(els: I | InitElements<I>, options: Partial<O>, classDef: ComponentType<C, O>): C | C[] {
    let instances = null;
    if (els instanceof Element) {
      instances = new classDef(<HTMLElement>els, options);
    }
    else if (!!els && els.length) {
      instances = [];
      for (let i = 0; i < els.length; i++) {
        instances.push(new classDef(<HTMLElement>els[i], options));
      }
    }
    return instances;
  }

  /**
   * @returns default options for component instance.
   */
  static get defaults(): BaseOptions{ return {}; }

  /**
   * Retrieves component instance for the given element.
   * @param el Associated HTML Element.
   */
  static getInstance(el: HTMLElement): Component<BaseOptions> {
    throw new Error("This method must be implemented.");
  }

  /**
   * Destroy plugin instance and teardown.
   */
  destroy(): void { throw new Error("This method must be implemented."); }
}
