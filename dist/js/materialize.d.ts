/**
 * Base options for component initialization.
 */
interface BaseOptions$1 {
}
type MElement = HTMLElement | Element;
type InitElements<T extends MElement> = NodeListOf<T> | HTMLCollectionOf<T>;
type ComponentConstructor<T extends Component<O>, O extends BaseOptions$1> = {
    new (el: HTMLElement, options: Partial<O>): T;
};
type ComponentType<C extends Component<O>, O extends BaseOptions$1> = ComponentConstructor<C, O> & typeof Component<O>;
interface I18nOptions {
    cancel: string;
    clear: string;
    done: string;
}
interface Openable {
    isOpen: boolean;
    open(): void;
    close(): void;
}
/**
 * Base class implementation for Materialize components.
 */
declare class Component<O extends BaseOptions$1> {
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
    constructor(el: HTMLElement, options: Partial<O>, classDef: ComponentType<Component<O>, O>);
    /**
     * Initializes component instance.
     * @param el HTML element.
     * @param options Component options.
     * @param classDef Class definition.
     */
    protected static init<I extends HTMLElement, O extends BaseOptions$1, C extends Component<O>>(el: I, options: O, classDef: ComponentType<C, O>): C;
    /**
     * Initializes component instances.
     * @param els HTML elements.
     * @param options Component options.
     * @param classDef Class definition.
     */
    protected static init<I extends MElement, O extends BaseOptions$1, C extends Component<O>>(els: InitElements<I>, options: Partial<O>, classDef: ComponentType<C, O>): C[];
    /**
     * Initializes component instances.
     * @param els HTML elements.
     * @param options Component options.
     * @param classDef Class definition.
     */
    protected static init<I extends MElement, O extends BaseOptions$1, C extends Component<O>>(els: I | InitElements<I>, options: Partial<O>, classDef: ComponentType<C, O>): C | C[];
    /**
     * @returns default options for component instance.
     */
    static get defaults(): BaseOptions$1;
    /**
     * Retrieves component instance for the given element.
     * @param el Associated HTML Element.
     */
    static getInstance(el: HTMLElement): Component<BaseOptions$1>;
    /**
     * Destroy plugin instance and teardown.
     */
    destroy(): void;
}

interface DropdownOptions extends BaseOptions$1 {
    /**
     * Defines the edge the menu is aligned to.
     * @default 'left'
     */
    alignment: 'left' | 'right';
    /**
     * If true, automatically focus dropdown el for keyboard.
     * @default true
     */
    autoFocus: boolean;
    /**
     * If true, constrainWidth to the size of the dropdown activator.
     * @default true
     */
    constrainWidth: boolean;
    /**
     * Provide an element that will be the bounding container of the dropdown.
     * @default null
     */
    container: Element;
    /**
     * If false, the dropdown will show below the trigger.
     * @default true
     */
    coverTrigger: boolean;
    /**
     * If true, close dropdown on item click.
     * @default true
     */
    closeOnClick: boolean;
    /**
     * If true, the dropdown will open on hover.
     * @default false
     */
    hover: boolean;
    /**
     * The duration of the transition enter in milliseconds.
     * @default 150
     */
    inDuration: number;
    /**
     * The duration of the transition out in milliseconds.
     * @default 250
     */
    outDuration: number;
    /**
     * Function called when dropdown starts entering.
     * @default null
     */
    onOpenStart: (el: HTMLElement) => void;
    /**
     * Function called when dropdown finishes entering.
     * @default null
     */
    onOpenEnd: (el: HTMLElement) => void;
    /**
     * Function called when dropdown starts exiting.
     * @default null
     */
    onCloseStart: (el: HTMLElement) => void;
    /**
     * Function called when dropdown finishes exiting.
     * @default null
     */
    onCloseEnd: (el: HTMLElement) => void;
    /**
     * Function called when item is clicked.
     * @default null
     */
    onItemClick: (el: HTMLLIElement) => void;
}
declare class Dropdown extends Component<DropdownOptions> implements Openable {
    static _dropdowns: Dropdown[];
    /** ID of the dropdown element. */
    id: string;
    /** The DOM element of the dropdown. */
    dropdownEl: HTMLElement;
    /** If the dropdown is open. */
    isOpen: boolean;
    /** If the dropdown content is scrollable. */
    isScrollable: boolean;
    isTouchMoving: boolean;
    /** The index of the item focused. */
    focusedIndex: number;
    filterQuery: string[];
    filterTimeout: NodeJS.Timeout | number;
    constructor(el: HTMLElement, options: Partial<DropdownOptions>);
    static get defaults(): DropdownOptions;
    /**
     * Initializes instance of Dropdown.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<DropdownOptions>): Dropdown;
    /**
     * Initializes instances of Dropdown.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<DropdownOptions>): Dropdown[];
    static getInstance(el: HTMLElement): Dropdown;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _setupTemporaryEventHandlers(): void;
    _removeTemporaryEventHandlers(): void;
    _handleClick: (e: MouseEvent) => void;
    _handleMouseEnter: () => void;
    _handleMouseLeave: (e: MouseEvent) => void;
    _handleDocumentClick: (e: MouseEvent) => void;
    _handleTriggerKeydown: (e: KeyboardEvent) => void;
    _handleDocumentTouchmove: (e: TouchEvent) => void;
    _handleDropdownClick: (e: MouseEvent) => void;
    _handleDropdownKeydown: (e: KeyboardEvent) => void;
    _handleWindowResize: () => void;
    _resetFilterQuery: () => void;
    _resetDropdownStyles(): void;
    _resetDropdownPositioningStyles(): void;
    _moveDropdownToElement(containerEl?: HTMLElement): void;
    _makeDropdownFocusable(): void;
    _focusFocusedItem(): void;
    _getDropdownPosition(closestOverflowParent: HTMLElement): {
        x: number;
        y: number;
        verticalAlignment: string;
        horizontalAlignment: "left" | "right";
        height: number;
        width: number;
    };
    _animateIn(): void;
    _animateOut(): void;
    private _getClosestAncestor;
    _placeDropdown(): void;
    /**
     * Open dropdown.
     */
    open: () => void;
    /**
     * Close dropdown.
     */
    close: () => void;
    /**
     * While dropdown is open, you can recalculate its dimensions if its contents have changed.
     */
    recalculateDimensions: () => void;
}

interface AutocompleteData {
    /**
     * A primitive value that can be converted to string.
     * If "text" is not provided, it will also be used as "option text" as well
     */
    id: string | number;
    /**
     * This optional attribute is used as "display value" for the current entry.
     * When provided, it will also be taken into consideration by the standard search function.
     */
    text?: string;
    /**
     * This optional attribute is used to provide a valid image URL to the current option.
     */
    image?: string;
    /**
     * Optional attributes which describes the option.
     */
    description?: string;
}
interface AutocompleteOptions extends BaseOptions$1 {
    /**
     * Data object defining autocomplete options with
     * optional icon strings.
     */
    data: AutocompleteData[];
    /**
     * Flag which can be set if multiple values can be selected. The Result will be an Array.
     * @default false
     */
    isMultiSelect: boolean;
    /**
     * Callback for when autocompleted.
     */
    onAutocomplete: (entries: AutocompleteData[]) => void;
    /**
     * Minimum number of characters before autocomplete starts.
     * @default 1
     */
    minLength: number;
    /**
     * The height of the Menu which can be set via css-property.
     * @default '300px'
     */
    maxDropDownHeight: string;
    /**
     * Function is called when the input text is altered and data can also be loaded asynchronously.
     * If the results are collected the items in the list can be updated via the function setMenuItems(collectedItems).
     * @param text Searched text.
     * @param autocomplete Current autocomplete instance.
     */
    onSearch: (text: string, autocomplete: Autocomplete) => void;
    /**
     * If true will render the key from each item directly as HTML.
     * User input MUST be properly sanitized first.
     * @default false
     */
    allowUnsafeHTML: boolean;
    /**
     * Pass options object to select dropdown initialization.
     * @default {}
     */
    dropdownOptions: Partial<DropdownOptions>;
    /**
     * Predefined selected values
     */
    selected: number[] | string[];
}
declare class Autocomplete extends Component<AutocompleteOptions> {
    el: HTMLInputElement;
    /** If the autocomplete is open. */
    isOpen: boolean;
    /** Number of matching autocomplete options. */
    count: number;
    /** Index of the current selected option. */
    activeIndex: number;
    private oldVal;
    private $active;
    private _mousedown;
    container: HTMLElement;
    /** Instance of the dropdown plugin for this autocomplete. */
    dropdown: Dropdown;
    static _keydown: boolean;
    selectedValues: AutocompleteData[];
    menuItems: AutocompleteData[];
    constructor(el: HTMLInputElement, options: Partial<AutocompleteOptions>);
    static get defaults(): AutocompleteOptions;
    /**
     * Initializes instance of Autocomplete.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLInputElement, options?: Partial<AutocompleteOptions>): Autocomplete;
    /**
     * Initializes instances of Autocomplete.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<HTMLInputElement | MElement>, options?: Partial<AutocompleteOptions>): Autocomplete[];
    static getInstance(el: HTMLElement): Autocomplete;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _setupDropdown(): void;
    _removeDropdown(): void;
    _handleInputBlur: () => void;
    _handleInputKeyup: (e: KeyboardEvent) => void;
    _handleInputFocus: () => void;
    _inputChangeDetection: (value: string) => void;
    _handleInputKeydown: (e: KeyboardEvent) => void;
    _handleInputClick: () => void;
    _handleContainerMousedownAndTouchstart: () => void;
    _handleContainerMouseupAndTouchend: () => void;
    _resetCurrentElementPosition(): void;
    _resetAutocomplete(): void;
    _highlightPartialText(input: string, label: string): string[];
    _createDropdownItem(entry: AutocompleteData): HTMLLIElement;
    _renderDropdown(): void;
    _setStatusLoading(): void;
    _updateSelectedInfo(): void;
    _refreshInputText(): void;
    _triggerChanged(): void;
    /**
     * Show autocomplete.
     */
    open: () => void;
    /**
     * Hide autocomplete.
     */
    close: () => void;
    /**
     * Updates the visible or selectable items shown in the menu.
     * @param menuItems Items to be available.
     * @param selected Selected item ids
     * @param open Option to conditionally open dropdown
     */
    setMenuItems(menuItems: AutocompleteData[], selected?: number[] | string[], open?: boolean): void;
    /**
     * Sets selected values.
     * @deprecated @see https://github.com/materializecss/materialize/issues/552
     * @param entries
     */
    setValues(entries: AutocompleteData[]): void;
    /**
     * Select a specific autocomplete option via id-property.
     * @param id The id of a data-entry.
     */
    selectOption(id: number | string): void;
    selectOptions(ids: []): void;
}

interface FloatingActionButtonOptions extends BaseOptions$1 {
    /**
     * Direction FAB menu opens.
     * @default "top"
     */
    direction: 'top' | 'right' | 'bottom' | 'left';
    /**
     * true: FAB menu appears on hover, false: FAB menu appears on click.
     * @default true
     */
    hoverEnabled: boolean;
    /**
     * Enable transit the FAB into a toolbar on click.
     * @default false
     */
    toolbarEnabled: boolean;
}
declare class FloatingActionButton extends Component<FloatingActionButtonOptions> implements Openable {
    /**
     * Describes open/close state of FAB.
     */
    isOpen: boolean;
    private _anchor;
    private _menu;
    private _floatingBtns;
    private _floatingBtnsReverse;
    offsetY: number;
    offsetX: number;
    btnBottom: number;
    btnLeft: number;
    btnWidth: number;
    constructor(el: HTMLElement, options: Partial<FloatingActionButtonOptions>);
    static get defaults(): FloatingActionButtonOptions;
    /**
     * Initializes instance of FloatingActionButton.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<FloatingActionButtonOptions>): FloatingActionButton;
    /**
     * Initializes instances of FloatingActionButton.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<FloatingActionButtonOptions>): FloatingActionButton[];
    static getInstance(el: HTMLElement): FloatingActionButton;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleFABClick: () => void;
    _handleFABKeyPress: (e: any) => void;
    _handleFABToggle: () => void;
    _handleDocumentClick: (e: MouseEvent) => void;
    /**
     * Open FAB.
     */
    open: () => void;
    /**
     * Close FAB.
     */
    close: () => void;
    _animateInFAB(): void;
    _animateOutFAB(): void;
    _animateInToolbar(): void;
}

interface CardsOptions extends BaseOptions$1 {
    onOpen: (el: Element) => void;
    onClose: (el: Element) => void;
    inDuration: number;
    outDuration: number;
}
declare class Cards extends Component<CardsOptions> implements Openable {
    isOpen: boolean;
    private readonly cardReveal;
    private readonly initialOverflow;
    private _activators;
    private cardRevealClose;
    constructor(el: HTMLElement, options: Partial<CardsOptions>);
    static get defaults(): CardsOptions;
    /**
     * Initializes instance of Cards.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<CardsOptions>): Cards;
    /**
     * Initializes instances of Cards.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<CardsOptions>): Cards[];
    static getInstance(el: HTMLElement): Cards;
    /**
     * {@inheritDoc}
     */
    destroy(): void;
    _setupEventHandlers: () => void;
    _removeEventHandlers: () => void;
    _handleClickInteraction: () => void;
    _handleKeypressEvent: (e: KeyboardEvent) => void;
    _handleRevealEvent: () => void;
    _setupRevealCloseEventHandlers: () => void;
    _removeRevealCloseEventHandlers: () => void;
    _handleKeypressCloseEvent: (e: KeyboardEvent) => void;
    /**
     * Show card reveal.
     */
    open: () => void;
    /**
     * Hide card reveal.
     */
    close: () => void;
    static Init(): void;
}

interface CarouselOptions extends BaseOptions$1 {
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
declare class Carousel extends Component<CarouselOptions> {
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
    center: number;
    imageHeight: number;
    scrollingTimeout: number | NodeJS.Timeout;
    oneTimeCallback: (current: Element, dragged: boolean) => void | null;
    constructor(el: HTMLElement, options: Partial<CarouselOptions>);
    static get defaults(): CarouselOptions;
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
    static getInstance(el: HTMLElement): Carousel;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleThrottledResize: () => void;
    _handleCarouselTap: (e: MouseEvent | TouchEvent) => void;
    _handleCarouselDrag: (e: MouseEvent | TouchEvent) => boolean;
    _handleCarouselRelease: (e: MouseEvent | TouchEvent) => boolean;
    _handleCarouselClick: (e: MouseEvent | TouchEvent) => boolean;
    _handleIndicatorClick: (e: Event) => void;
    _handleIndicatorKeyPress: (e: KeyboardEvent) => void;
    _handleIndicatorInteraction: (e: Event) => void;
    _handleResize: () => void;
    _setCarouselHeight(imageOnly?: boolean): void;
    _xpos(e: MouseEvent | TouchEvent): number;
    _ypos(e: MouseEvent | TouchEvent): number;
    _wrap(x: number): any;
    _track: () => void;
    _autoScroll: () => void;
    _scroll(x?: number): void;
    _updateItemStyle(el: HTMLElement, opacity: number, zIndex: number, transform: string): void;
    _cycleTo(n: number, callback?: CarouselOptions['onCycleTo']): void;
    /**
     * Move carousel to next slide or go forward a given amount of slides.
     * @param n How many times the carousel slides.
     */
    next(n?: number): void;
    /**
     * Move carousel to previous slide or go back a given amount of slides.
     * @param n How many times the carousel slides.
     */
    prev(n?: number): void;
    /**
     * Move carousel to nth slide.
     * @param n Index of slide.
     * @param callback "onCycleTo" optional callback.
     */
    set(n: number, callback?: CarouselOptions['onCycleTo']): void;
}

interface ChipData {
    /**
     * Unique identifier.
     */
    id: number | string;
    /**
     * Chip text. If not specified, "id" will be used.
     */
    text?: string;
    /**
     * Chip image (URL).
     */
    image?: string;
}
interface ChipsOptions extends BaseOptions$1 {
    /**
     * Set the chip data.
     * @default []
     */
    data: ChipData[];
    /**
     * Set first placeholder when there are no tags.
     * @default ""
     */
    placeholder: string;
    /**
     * Set second placeholder when adding additional tags.
     * @default ""
     */
    secondaryPlaceholder: string;
    /**
     * Set autocomplete options.
     * @default {}
     */
    autocompleteOptions: Partial<AutocompleteOptions>;
    /**
     * Toggles abililty to add custom value not in autocomplete list.
     * @default false
     */
    autocompleteOnly: boolean;
    /**
     * Set chips limit.
     * @default Infinity
     */
    limit: number;
    /**
     * Specifies class to be used in "close" button (useful when working with Material Symbols icon set).
     * @default 'material-icons'
     */
    closeIconClass: string;
    /**
     *  Specifies option to render user input field
     *  @default false;
     */
    allowUserInput: boolean;
    /**
     * Callback for chip add.
     * @default null
     */
    onChipAdd: (element: HTMLElement, chip: HTMLElement) => void;
    /**
     * Callback for chip select.
     * @default null
     */
    onChipSelect: (element: HTMLElement, chip: HTMLElement) => void;
    /**
     * Callback for chip delete.
     * @default null
     */
    onChipDelete: (element: HTMLElement, chip: HTMLElement) => void;
}
declare class Chips extends Component<ChipsOptions> {
    /** Array of the current chips data. */
    chipsData: ChipData[];
    /** If the chips has autocomplete enabled. */
    hasAutocomplete: boolean;
    /** Autocomplete instance, if any. */
    autocomplete: Autocomplete;
    _input: HTMLInputElement;
    _label: HTMLLabelElement;
    _chips: HTMLElement[];
    static _keydown: boolean;
    private _selectedChip;
    constructor(el: HTMLElement, options: Partial<ChipsOptions>);
    static get defaults(): ChipsOptions;
    /**
     * Initializes instance of Chips.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<ChipsOptions>): Chips;
    /**
     * Initializes instances of Chips.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<ChipsOptions>): Chips[];
    static getInstance(el: HTMLElement): Chips;
    getData(): ChipData[];
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleChipClick: (e: MouseEvent) => void;
    static _handleChipsKeydown(e: KeyboardEvent): void;
    static _handleChipsKeyup(): void;
    static _handleChipsBlur(e: Event): void;
    _handleInputFocus: () => void;
    _handleInputBlur: () => void;
    _handleInputKeydown: (e: KeyboardEvent) => void;
    _renderChip(chip: ChipData): HTMLDivElement;
    _renderChips(): void;
    _setupAutocomplete(): void;
    _setupInput(): void;
    _setupLabel(): void;
    _setPlaceholder(): void;
    _isValidAndNotExist(chip: ChipData): boolean;
    /**
     * Add chip to input.
     * @param chip Chip data object
     */
    addChip(chip: ChipData): void;
    /**
     * Delete nth chip.
     * @param chipIndex  Index of chip
     */
    deleteChip(chipIndex: number): void;
    /**
     * Select nth chip.
     * @param chipIndex Index of chip
     */
    selectChip(chipIndex: number): void;
    static Init(): void;
}

interface CollapsibleOptions extends BaseOptions$1 {
    /**
     * If accordion versus collapsible.
     * @default true
     */
    accordion: boolean;
    /**
     * Transition in duration in milliseconds.
     * @default 300
     */
    inDuration: number;
    /**
     * Transition out duration in milliseconds.
     * @default 300
     */
    outDuration: number;
    /**
     * Callback function called before collapsible is opened.
     * @default null
     */
    onOpenStart: (el: Element) => void;
    /**
     * Callback function called after collapsible is opened.
     * @default null
     */
    onOpenEnd: (el: Element) => void;
    /**
     * Callback function called before collapsible is closed.
     * @default null
     */
    onCloseStart: (el: Element) => void;
    /**
     * Callback function called after collapsible is closed.
     * @default null
     */
    onCloseEnd: (el: Element) => void;
}
declare class Collapsible extends Component<CollapsibleOptions> {
    private _headers;
    constructor(el: HTMLElement, options: Partial<CollapsibleOptions>);
    static get defaults(): CollapsibleOptions;
    /**
     * Initializes instance of Collapsible.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<CollapsibleOptions>): Collapsible;
    /**
     * Initializes instances of Collapsible.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<CollapsibleOptions>): Collapsible[];
    static getInstance(el: HTMLElement): Collapsible;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleCollapsibleClick: (e: MouseEvent | KeyboardEvent) => void;
    _handleCollapsibleKeydown: (e: KeyboardEvent) => void;
    private _setExpanded;
    _animateIn(index: number): void;
    _animateOut(index: number): void;
    /**
     * Open collapsible section.
     * @param n Nth section to open.
     */
    open: (index: number) => void;
    /**
     * Close collapsible section.
     * @param n Nth section to close.
     */
    close: (index: number) => void;
}

interface DateI18nOptions extends I18nOptions {
    previousMonth: string;
    nextMonth: string;
    months: string[];
    monthsShort: string[];
    weekdays: string[];
    weekdaysShort: string[];
    weekdaysAbbrev: string[];
}
interface DatepickerOptions extends BaseOptions$1 {
    /**
     * The date output format for the input field value
     * or a function taking the date and outputting the
     * formatted date string.
     * @default 'mmm dd, yyyy'
     */
    format: string | ((d: Date) => string);
    /**
     * Used to create date object from current input string.
     * @default null
     */
    parse: ((value: string, format: string) => Date) | null;
    /**
     * The initial condition if the datepicker is based on date range.
     * @default false
     */
    isDateRange: boolean;
    /**
     * The selector of the user specified date range end element
     */
    dateRangeEndEl: string | null;
    /**
     * The initial condition if the datepicker is based on multiple date selection.
     * @default false
     */
    isMultipleSelection: boolean;
    /**
     * The initial date to view when first opened.
     * @default null
     */
    defaultDate: Date | null;
    /**
     * The initial end date to view when first opened.
     * @default null
     */
    defaultEndDate: Date | null;
    /**
     * Make the `defaultDate` the initial selected value.
     * @default false
     */
    setDefaultDate: boolean;
    /**
     * Make the `defaultEndDate` the initial selected value.
     * @default false
     */
    setDefaultEndDate: boolean;
    /**
     * Prevent selection of any date on the weekend.
     * @default false
     */
    disableWeekends: boolean;
    /**
     * Custom function to disable certain days.
     * @default null
     */
    disableDayFn: ((day: Date) => boolean) | null;
    /**
     * First day of week (0: Sunday, 1: Monday etc).
     * @default 0
     */
    firstDay: number;
    /**
     * The earliest date that can be selected.
     * @default null
     */
    minDate: Date | null;
    /**
     * The latest date that can be selected.
     * @default null
     */
    maxDate: Date | null;
    /**
     * Number of years either side, or array of upper/lower range.
     * @default 10
     */
    yearRange: number | number[];
    /**
     * Sort year range in reverse order.
     * @default false
     */
    yearRangeReverse: boolean;
    /**
     * Changes Datepicker to RTL.
     * @default false
     */
    isRTL: boolean;
    /**
     * Show month after year in Datepicker title.
     * @default false
     */
    showMonthAfterYear: boolean;
    /**
     * Render days of the calendar grid that fall in the next
     * or previous month.
     * @default false
     */
    showDaysInNextAndPreviousMonths: boolean;
    /**
     * Specify if the docked datepicker is in open state by default
     */
    openByDefault: boolean;
    /**
     * Specify a DOM element OR selector for a DOM element to render
     * the calendar in, by default it will be placed before the input.
     * @default null
     */
    container: HTMLElement | string | null;
    /**
     * Show the clear button in the datepicker.
     * @default false
     */
    showClearBtn: boolean;
    /**
     *  Autosubmit calendar day select to input field
     *  @default false
     */
    autoSubmit: true;
    /**
     * Internationalization options.
     */
    i18n: Partial<DateI18nOptions>;
    /**
     * An array of string returned by `Date.toDateString()`,
     * indicating there are events in the specified days.
     * @default []
     */
    events: string[];
    /**
     * Callback function when date is selected,
     * first parameter is the newly selected date.
     * @default null
     */
    onSelect: ((selectedDate: Date) => void) | null;
    /**
     * Callback function when Datepicker is closed.
     * @default null
     */
    /**
     * Callback function when Datepicker HTML is refreshed.
     * @default null
     */
    onDraw: (() => void) | null;
    /**
     * Callback function for interaction with input field.
     * @default null
     */
    onInputInteraction: (() => void) | null;
    /**
     * Callback function for interaction with confirm button.
     * @default null
     */
    onConfirm: (() => void) | null;
    /**
     * Callback function for interaction with close button.
     * @default null
     */
    onCancel: (() => void) | null;
    /** Field used for internal calculations DO NOT CHANGE IT */
    minYear?: number;
    /** Field used for internal calculations DO NOT CHANGE IT */
    maxYear?: number;
    /** Field used for internal calculations DO NOT CHANGE IT */
    minMonth?: number;
    /** Field used for internal calculations DO NOT CHANGE IT */
    maxMonth?: number;
    /** Field used for internal calculations DO NOT CHANGE IT */
    startRange?: Date;
    /** Field used for internal calculations DO NOT CHANGE IT */
    endRange?: Date;
    /**
     * Display plugin
     */
    displayPlugin: string;
    /**
     * Configurable display plugin options
     */
    displayPluginOptions: object;
}
declare class Datepicker extends Component<DatepickerOptions> {
    el: HTMLInputElement;
    id: string;
    multiple: boolean;
    calendarEl: HTMLElement;
    /** CLEAR button instance. */
    /** DONE button instance */
    containerEl: HTMLElement;
    yearTextEl: HTMLElement;
    dateTextEl: HTMLElement;
    endDateEl: HTMLInputElement;
    dateEls: HTMLInputElement[];
    /** The selected Date. */
    date: Date;
    endDate: null | Date;
    dates: Date[];
    formats: object;
    calendars: [{
        month: number;
        year: number;
    }];
    private _y;
    private _m;
    private displayPlugin;
    private footer;
    static _template: string;
    constructor(el: HTMLInputElement, options: Partial<DatepickerOptions>);
    static get defaults(): DatepickerOptions;
    /**
     * Initializes instance of Datepicker.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLInputElement, options?: Partial<DatepickerOptions>): Datepicker;
    /**
     * Initializes instances of Datepicker.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<HTMLInputElement | MElement>, options?: Partial<DatepickerOptions>): Datepicker[];
    static _isDate(obj: any): boolean;
    static _isWeekend(date: any): boolean;
    /**
     * @deprecated as this function has no effect without any return statement or global parameter setter.
     */
    static _setToStartOfDay(date: any): void;
    static _getDaysInMonth(year: any, month: any): number;
    static _isLeapYear(year: any): boolean;
    static _compareDates(a: any, b: any): boolean;
    static _compareWithinRange(day: Date, date: Date, dateEnd: Date): boolean;
    static _comparePastDate(a: Date, b: Date): boolean;
    static getInstance(el: HTMLElement): Datepicker;
    destroy(): void;
    destroySelects(): void;
    _insertHTMLIntoDOM(): void;
    /**
     * Renders the date input format
     */
    _renderDateInputFormat(el: HTMLInputElement): void;
    /**
     * Gets a string representation of the given date.
     */
    toString(date?: Date, format?: string | ((d: Date) => string)): string;
    /**
     * Returns the formatted date.
     */
    formatDate(date: Date, format: string): string;
    /**
     * Sets date from input field.
     */
    setDateFromInput(el: HTMLInputElement): void;
    /**
     * Set a date on the datepicker.
     * @param date Date to set on the datepicker.
     * @param preventOnSelect Undocumented as of 5 March 2018.
     * @param isEndDate
     * @param fromUserInput
     */
    setDate(date?: Date, preventOnSelect?: boolean, isEndDate?: boolean, fromUserInput?: boolean): void;
    validateDate(date: Date): void | Date;
    /**
     * Set a single date on the datepicker.
     * @param date Date to set on the datepicker.
     * @param isEndDate
     */
    setSingleDate(date: Date, isEndDate: boolean): void;
    /**
     * Set a multi date on the datepicker.
     * @param date Date to set on the datepicker.
     */
    setMultiDate(date: Date): void;
    /**
     * Sets the data-date attribute on the date input field
     */
    setDataDate(el: any, date: any): void;
    /**
     * Sets dates on the input values.
     */
    setInputValues(): void;
    setMultipleSelectionInputValues(): void;
    /**
     * Sets given date as the input value on the given element.
     */
    setInputValue(el: any, date: any): void;
    /**
     * Renders the date in the modal head section.
     */
    _renderDateDisplay(date: Date, endDate?: Date): void;
    /**
     * Change date view to a specific date on the datepicker.
     * @param date Date to show on the datepicker.
     */
    gotoDate(date: Date): void;
    adjustCalendars(): void;
    adjustCalendar(calendar: any): any;
    nextMonth(): void;
    prevMonth(): void;
    render(year: any, month: any, randId: any): string;
    renderDay(opts: any): string;
    renderRow(days: any, isRTL: any, isRowSelected: any): string;
    renderTable(opts: any, data: any, randId: any): string;
    renderHead(opts: any): string;
    renderBody(rows: any): string;
    renderTitle(instance: any, c: any, year: any, month: any, refYear: any, randId: any): string;
    draw(): void;
    _setupEventHandlers(): void;
    _setupVariables(): void;
    _removeEventHandlers(): void;
    _handleInputClick: (e: any) => void;
    _handleInputKeydown: (e: KeyboardEvent) => void;
    _handleCalendarClick: (e: any) => void;
    _handleDateRangeCalendarClick: (date: Date) => void;
    _handleClearClick: () => void;
    _clearDates: () => void;
    _handleMonthChange: (e: any) => void;
    _handleYearChange: (e: any) => void;
    gotoMonth(month: any): void;
    gotoYear(year: any): void;
    _handleInputChange: (e: Event) => void;
    renderDayName(opts: any, day: any, abbr?: boolean): any;
    createDateInput(): HTMLInputElement;
    _finishSelection: () => void;
    _confirm: () => void;
    _cancel: () => void;
    open(): this;
    close(): this;
}

interface MaterialboxOptions extends BaseOptions$1 {
    /**
     * Transition in duration in milliseconds.
     * @default 275
     */
    inDuration: number;
    /**
     * Transition out duration in milliseconds.
     * @default 200
     */
    outDuration: number;
    /**
     * Callback function called before materialbox is opened.
     * @default null
     */
    onOpenStart: (el: Element) => void;
    /**
     * Callback function called after materialbox is opened.
     * @default null
     */
    onOpenEnd: (el: Element) => void;
    /**
     * Callback function called before materialbox is closed.
     * @default null
     */
    onCloseStart: (el: Element) => void;
    /**
     * Callback function called after materialbox is closed.
     * @default null
     */
    onCloseEnd: (el: Element) => void;
}
declare class Materialbox extends Component<MaterialboxOptions> {
    /** If the materialbox overlay is showing. */
    overlayActive: boolean;
    /** If the materialbox is no longer being animated. */
    doneAnimating: boolean;
    /** Caption, if specified. */
    caption: string;
    /** Original width of image. */
    originalWidth: number;
    /** Original height of image. */
    originalHeight: number;
    private originInlineStyles;
    private placeholder;
    private _changedAncestorList;
    private newHeight;
    private newWidth;
    private windowWidth;
    private windowHeight;
    private attrWidth;
    private attrHeight;
    private _overlay;
    private _photoCaption;
    constructor(el: HTMLElement, options: Partial<MaterialboxOptions>);
    static get defaults(): MaterialboxOptions;
    /**
     * Initializes instance of MaterialBox.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<MaterialboxOptions>): Materialbox;
    /**
     * Initializes instances of MaterialBox.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<MaterialboxOptions>): Materialbox[];
    static getInstance(el: HTMLElement): Materialbox;
    destroy(): void;
    private _setupEventHandlers;
    private _removeEventHandlers;
    private _handleMaterialboxClick;
    private _handleMaterialboxKeypress;
    private _handleMaterialboxToggle;
    private _handleWindowScroll;
    private _handleWindowResize;
    private _handleWindowEscape;
    private _makeAncestorsOverflowVisible;
    private _offset;
    private _updateVars;
    private _animateImageIn;
    private _animateImageOut;
    private _addCaption;
    private _removeCaption;
    private _addOverlay;
    private _removeOverlay;
    /**
     * Open materialbox.
     */
    open: () => void;
    /**
     * Close materialbox.
     */
    close: () => void;
}

interface ModalOptions extends BaseOptions$1 {
    opacity: number;
    inDuration: number;
    outDuration: number;
    preventScrolling: boolean;
    onOpenStart: (this: Modal, el: HTMLElement) => void;
    onOpenEnd: (this: Modal, el: HTMLElement) => void;
    onCloseStart: (el: HTMLElement) => void;
    onCloseEnd: (el: HTMLElement) => void;
    dismissible: boolean;
    startingTop: string;
    endingTop: string;
}
declare class Modal extends Component<ModalOptions> {
    #private;
    constructor(el: HTMLElement, options: Partial<ModalOptions>);
    static get defaults(): {
        opacity: number;
        inDuration: number;
        outDuration: number;
        onOpenStart: any;
        onOpenEnd: any;
        onCloseStart: any;
        onCloseEnd: any;
        preventScrolling: boolean;
        dismissible: boolean;
        startingTop: string;
        endingTop: string;
    };
    static init(el: HTMLElement, options?: Partial<ModalOptions>): Modal;
    static init(els: InitElements<MElement>, options?: Partial<ModalOptions>): Modal[];
    static getInstance(el: HTMLElement): Modal;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleTriggerClick(): void;
    _handleOverlayClick(): void;
    _handleModalCloseClick(): void;
    _handleKeydown(): void;
    _handleFocus(): void;
    open(): this;
    close(): this;
    static create(config: any): string | HTMLDialogElement;
}

declare class Edges {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}

declare class Bounding {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * Class with utilitary functions for global usage.
 */
declare class Utils {
    /** Specifies wether tab is pressed or not. */
    static tabPressed: boolean;
    /** Specifies wether there is a key pressed. */
    static keyDown: boolean;
    /**
     * Key maps.
     */
    static keys: {
        TAB: string[];
        ENTER: string[];
        ESC: string[];
        BACKSPACE: string[];
        ARROW_UP: string[];
        ARROW_DOWN: string[];
        ARROW_LEFT: string[];
        ARROW_RIGHT: string[];
        DELETE: string[];
    };
    /**
     * Detects when a key is pressed.
     * @param e Event instance.
     */
    static docHandleKeydown(e: KeyboardEvent): void;
    /**
     * Detects when a key is released.
     * @param e Event instance.
     */
    static docHandleKeyup(e: KeyboardEvent): void;
    /**
     * Detects when document is focused.
     * @param e Event instance.
     */
    static docHandleFocus(e: FocusEvent): void;
    /**
     * Detects when document is not focused.
     * @param e Event instance.
     */
    static docHandleBlur(e: FocusEvent): void;
    /**
     * Generates a unique string identifier.
     */
    static guid(): string;
    /**
     * Checks for exceeded edges
     * @param container Container element.
     * @param bounding Bounding rect.
     * @param offset Element offset.
     */
    static checkWithinContainer(container: HTMLElement, bounding: Bounding, offset: number): Edges;
    /**
     * Checks if element can be aligned in multiple directions.
     * @param el Element to be inspected.
     * @param container Container element.
     * @param bounding Bounding rect.
     * @param offset Element offset.
     */
    static checkPossibleAlignments(el: HTMLElement, container: HTMLElement, bounding: Bounding, offset: number): {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
        spaceOnTop: number;
        spaceOnRight: number;
        spaceOnBottom: number;
        spaceOnLeft: number;
    };
    /**
     * Retrieves target element id from trigger.
     * @param trigger Trigger element.
     */
    static getIdFromTrigger(trigger: HTMLElement): string;
    /**
     * Retrieves document scroll postion from top.
     */
    static getDocumentScrollTop(): number;
    /**
     * Retrieves document scroll postion from left.
     */
    static getDocumentScrollLeft(): number;
    /**
     * Fires the given function after a certain ammount of time.
     * @param func Function to be fired.
     * @param wait Wait time.
     * @param options Additional options.
     */
    static throttle(func: (Function: object) => void, wait: number, options?: Partial<{
        leading: boolean;
        trailing: boolean;
    }>): (...args: any[]) => any;
    /**
     * Renders confirm/close buttons with callback function
     */
    static createConfirmationContainer(container: HTMLElement, confirmText: string, cancelText: string, onConfirm: (Function: object) => void, onCancel: (Function: object) => void): void;
    /**
     * Renders a button with optional callback function
     */
    static createButton(container: HTMLElement, text: string, className?: string[], visibility?: boolean, callback?: (Function: object) => void): void;
    static _setAbsolutePosition(origin: HTMLElement, container: HTMLElement, position: string, margin: number, transitionMovement: number, align?: string): {
        x: number;
        y: number;
    };
    static _repositionWithinScreen(x: number, y: number, width: number, height: number, margin: number, transitionMovement: number, align: string): {
        x: number;
        y: number;
    };
}

interface ParallaxOptions extends BaseOptions$1 {
    /**
     * The minimum width of the screen, in pixels, where the parallax functionality starts working.
     * @default 0
     */
    responsiveThreshold: number;
}
declare class Parallax extends Component<ParallaxOptions> {
    private _enabled;
    private _img;
    static _parallaxes: Parallax[];
    static _handleScrollThrottled: () => Utils;
    static _handleWindowResizeThrottled: () => Utils;
    constructor(el: HTMLElement, options: Partial<ParallaxOptions>);
    static get defaults(): ParallaxOptions;
    /**
     * Initializes instance of Parallax.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<ParallaxOptions>): Parallax;
    /**
     * Initializes instances of Parallax.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<ParallaxOptions>): Parallax[];
    static getInstance(el: HTMLElement): Parallax;
    destroy(): void;
    static _handleScroll(): void;
    static _handleWindowResize(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _setupStyles(): void;
    _handleImageLoad: () => void;
    private _offset;
    _updateParallax(): void;
}

interface PushpinOptions extends BaseOptions$1 {
    /**
     * The distance in pixels from the top of the page where
     * the element becomes fixed.
     * @default 0
     */
    top: number;
    /**
     * The distance in pixels from the top of the page where
     * the elements stops being fixed.
     * @default Infinity
     */
    bottom: number;
    /**
     * The offset from the top the element will be fixed at.
     * @default 0
     */
    offset: number;
    /**
     * Callback function called when pushpin position changes.
     * You are provided with a position string.
     * @default null
     */
    onPositionChange: (position: 'pinned' | 'pin-top' | 'pin-bottom') => void;
}
declare class Pushpin extends Component<PushpinOptions> {
    static _pushpins: Pushpin[];
    originalOffset: number;
    constructor(el: HTMLElement, options: Partial<PushpinOptions>);
    static get defaults(): PushpinOptions;
    /**
     * Initializes instance of Pushpin.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<PushpinOptions>): Pushpin;
    /**
     * Initializes instances of Pushpin.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<PushpinOptions>): Pushpin[];
    static getInstance(el: HTMLElement): Pushpin;
    destroy(): void;
    static _updateElements(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _updatePosition(): void;
    _removePinClasses(): void;
}

interface ScrollSpyOptions extends BaseOptions$1 {
    /**
     * Throttle of scroll handler.
     * @default 100
     */
    throttle: number;
    /**
     * Offset for centering element when scrolled to.
     * @default 200
     */
    scrollOffset: number;
    /**
     * Class applied to active elements.
     * @default 'active'
     */
    activeClass: string;
    /**
     * Used to find active element.
     * @default id => 'a[href="#' + id + '"]'
     */
    getActiveElement: (id: string) => string;
    /**
     * Used to keep last top element active even if
     * scrollbar goes outside of scrollspy elements.
     *
     * If there is no last top element,
     * then the active one will be the first element.
     *
     * @default false
     */
    keepTopElementActive: boolean;
    /**
     * Used to set scroll animation duration in milliseconds.
     * @default null (browser's native animation implementation/duration)
     */
    animationDuration: number | null;
}
declare class ScrollSpy extends Component<ScrollSpyOptions> {
    static _elements: ScrollSpy[];
    static _count: number;
    static _increment: number;
    static _elementsInView: ScrollSpy[];
    static _visibleElements: HTMLElement[];
    static _ticks: number;
    static _keptTopActiveElement: HTMLElement | null;
    private tickId;
    private id;
    constructor(el: HTMLElement, options: Partial<ScrollSpyOptions>);
    static get defaults(): ScrollSpyOptions;
    /**
     * Initializes instance of ScrollSpy.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<ScrollSpyOptions>): ScrollSpy;
    /**
     * Initializes instances of ScrollSpy.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<ScrollSpyOptions>): ScrollSpy[];
    static getInstance(el: HTMLElement): ScrollSpy;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleThrottledResize: () => void;
    _handleTriggerClick: (e: MouseEvent) => void;
    _handleWindowScroll: () => void;
    static _offset(el: any): {
        top: number;
        left: number;
    };
    static _findElements(top: number, right: number, bottom: number, left: number): ScrollSpy[];
    _enter(): void;
    _exit(): void;
    private _resetKeptTopActiveElementIfNeeded;
    private static _getDistanceToViewport;
    private static _smoothScrollIntoView;
}

interface FormSelectOptions extends BaseOptions$1 {
    /**
     * Classes to be added to the select wrapper element.
     * @default ""
     */
    classes: string;
    /**
     * Pass options object to select dropdown initialization.
     * @default {}
     */
    dropdownOptions: Partial<DropdownOptions>;
}
type ValueStruct = {
    el: HTMLOptionElement;
    optionEl: HTMLElement;
};
declare class FormSelect extends Component<FormSelectOptions> {
    el: HTMLSelectElement;
    /** If this is a multiple select. */
    isMultiple: boolean;
    /**
     * Label associated with the current select element.
     * Is "null", if not detected.
     */
    labelEl: HTMLLabelElement;
    /** Dropdown UL element. */
    dropdownOptions: HTMLUListElement;
    /** Text input that shows current selected option. */
    input: HTMLInputElement;
    /** Instance of the dropdown plugin for this select. */
    dropdown: Dropdown;
    /** The select wrapper element. */
    wrapper: HTMLDivElement;
    selectOptions: (HTMLOptionElement | HTMLOptGroupElement)[];
    private _values;
    nativeTabIndex: number;
    constructor(el: HTMLSelectElement, options: FormSelectOptions);
    static get defaults(): FormSelectOptions;
    /**
     * Initializes instance of FormSelect.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLSelectElement, options?: Partial<FormSelectOptions>): FormSelect;
    /**
     * Initializes instances of FormSelect.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<HTMLSelectElement | MElement>, options?: Partial<FormSelectOptions>): FormSelect[];
    static getInstance(el: HTMLElement): FormSelect;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleSelectChange: () => void;
    _handleOptionClick: (e: MouseEvent | KeyboardEvent) => void;
    _arraysEqual<T, E>(a: T[], b: (E | T)[]): boolean;
    _selectOptionElement(virtualOption: HTMLElement): void;
    _handleInputClick: () => void;
    _setupDropdown(): void;
    _addOptionToValues(realOption: HTMLOptionElement, virtualOption: HTMLElement): void;
    _removeDropdown(): void;
    _createAndAppendOptionWithIcon(realOption: HTMLOptionElement | HTMLOptGroupElement, type: string): HTMLLIElement;
    _selectValue(value: ValueStruct): void;
    _deselectValue(value: ValueStruct): void;
    _deselectAll(): void;
    _isValueSelected(value: ValueStruct): boolean;
    _toggleEntryFromArray(value: ValueStruct): void;
    _getSelectedOptions(): HTMLOptionElement[];
    _setValueToInput(): void;
    _setSelectedStates(): void;
    _activateOption(ul: HTMLElement, li: HTMLElement): void;
    getSelectedValues(): string[];
}

interface SidenavOptions extends BaseOptions$1 {
    /**
     * Side of screen on which Sidenav appears.
     * @default 'left'
     */
    edge: 'left' | 'right';
    /**
     * Allow swipe gestures to open/close Sidenav.
     * @default true
     */
    draggable: boolean;
    /**
     * Width of the area where you can start dragging.
     * @default '10px'
     */
    dragTargetWidth: string;
    /**
     * Length in ms of enter transition.
     * @default 250
     */
    inDuration: number;
    /**
     * Length in ms of exit transition.
     * @default 200
     */
    outDuration: number;
    /**
     * Prevent page from scrolling while sidenav is open.
     * @default true
     */
    preventScrolling: boolean;
    /**
     * Function called when sidenav starts entering.
     */
    onOpenStart: (elem: HTMLElement) => void;
    /**
     * Function called when sidenav finishes entering.
     */
    onOpenEnd: (elem: HTMLElement) => void;
    /**
     * Function called when sidenav starts exiting.
     */
    onCloseStart: (elem: HTMLElement) => void;
    /**
     * Function called when sidenav finishes exiting.
     */
    onCloseEnd: (elem: HTMLElement) => void;
}
declare class Sidenav extends Component<SidenavOptions> implements Openable {
    id: string;
    /** Describes open/close state of Sidenav. */
    isOpen: boolean;
    /** Describes if sidenav is fixed. */
    isFixed: boolean;
    /** Describes if Sidenav is being dragged. */
    isDragged: boolean;
    lastWindowWidth: number;
    lastWindowHeight: number;
    static _sidenavs: Sidenav[];
    private _overlay;
    dragTarget: Element;
    private _startingXpos;
    private _xPos;
    private _time;
    private _width;
    private _initialScrollTop;
    private _verticallyScrolling;
    private deltaX;
    private velocityX;
    private percentOpen;
    constructor(el: HTMLElement, options: Partial<SidenavOptions>);
    static get defaults(): SidenavOptions;
    /**
     * Initializes instance of Sidenav.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<SidenavOptions>): Sidenav;
    /**
     * Initializes instances of Sidenav.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<SidenavOptions>): Sidenav[];
    static getInstance(el: HTMLElement): Sidenav;
    destroy(): void;
    private _createOverlay;
    private _setupEventHandlers;
    private _removeEventHandlers;
    private _handleTriggerClick;
    private _startDrag;
    private _dragMoveUpdate;
    private _handleDragTargetDrag;
    private _handleDragTargetRelease;
    private _handleCloseDrag;
    private _calculateDelta;
    private _handleCloseRelease;
    private _handleCloseTriggerClick;
    private _handleWindowResize;
    private _setupClasses;
    private _removeClasses;
    private _setupFixed;
    private _isDraggable;
    private _isCurrentlyFixed;
    private _createDragTarget;
    private _preventBodyScrolling;
    private _enableBodyScrolling;
    /**
     * Opens Sidenav.
     */
    open: () => void;
    /**
     * Closes Sidenav.
     */
    close: () => void;
    private _animateIn;
    private _animateOut;
    private _animateSidenavIn;
    private _animateSidenavOut;
    private _animateOverlayIn;
    private _animateOverlayOut;
    private _setAriaHidden;
    private _setTabIndex;
}

interface TabsOptions extends BaseOptions$1 {
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
}
declare class Tabs extends Component<TabsOptions> {
    _tabLinks: NodeListOf<HTMLAnchorElement>;
    _index: number;
    _indicator: HTMLLIElement;
    _tabWidth: number;
    _tabsWidth: number;
    _tabsCarousel: Carousel;
    _activeTabLink: HTMLAnchorElement;
    _content: HTMLElement;
    constructor(el: HTMLElement, options: Partial<TabsOptions>);
    static get defaults(): TabsOptions;
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
    static getInstance(el: HTMLElement): Tabs;
    destroy(): void;
    /**
     * The index of tab that is currently shown.
     */
    get index(): number;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleWindowResize: () => void;
    _handleTabClick: (e: MouseEvent) => void;
    _createIndicator(): void;
    _setupActiveTabLink(): void;
    _setupSwipeableTabs(): void;
    _teardownSwipeableTabs(): void;
    _setupNormalTabs(): void;
    _teardownNormalTabs(): void;
    _setTabsAndTabWidth(): void;
    _calcRightPos(el: any): number;
    _calcLeftPos(el: any): number;
    /**
     * Recalculate tab indicator position. This is useful when
     * the indicator position is not correct.
     */
    updateTabIndicator(): void;
    _animateIndicator(prevIndex: any): void;
    /**
     * Show tab content that corresponds to the tab with the id.
     * @param tabId The id of the tab that you want to switch to.
     */
    select(tabId: string): void;
}

interface TapTargetOptions extends BaseOptions$1 {
    /**
     * Callback function called when Tap Target is opened.
     * @default null
     */
    onOpen: (origin: HTMLElement) => void;
    /**
     * Callback function called when Tap Target is closed.
     * @default null
     */
    onClose: (origin: HTMLElement) => void;
}
declare class TapTarget extends Component<TapTargetOptions> implements Openable {
    /**
     * If the tap target is open.
     */
    isOpen: boolean;
    static _taptargets: TapTarget[];
    private wrapper;
    private originEl;
    private waveEl;
    private contentEl;
    constructor(el: HTMLElement, options: Partial<TapTargetOptions>);
    static get defaults(): TapTargetOptions;
    /**
     * Initializes instance of TapTarget.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<TapTargetOptions>): TapTarget;
    /**
     * Initializes instances of TapTarget.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<TapTargetOptions>): TapTarget[];
    static getInstance(el: HTMLElement): TapTarget;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleThrottledResize: () => void;
    _handleKeyboardInteraction: (e: KeyboardEvent) => void;
    _handleTargetToggle: () => void;
    _handleResize: () => void;
    _handleDocumentClick: (e: MouseEvent | TouchEvent | KeyboardEvent) => void;
    _setup(): void;
    private _offset;
    _calculatePositioning(): void;
    /**
     * Open Tap Target.
     */
    open: () => void;
    /**
     * Close Tap Target.
     */
    close: () => void;
}

type Views = 'hours' | 'minutes';
interface TimepickerOptions extends BaseOptions$1 {
    /**
     * Dial radius.
     * @default 135
     */
    dialRadius: number;
    /**
     * Outer radius.
     * @default 105
     */
    outerRadius: number;
    /**
     * Inner radius.
     * @default 70
     */
    innerRadius: number;
    /**
     * Tick radius.
     * @default 20
     */
    tickRadius: number;
    /**
     * Duration of the transition from/to the hours/minutes view.
     * @default 350
     */
    duration: number;
    /**
     * Specify a DOM element OR selector for a DOM element to render
     * the time picker in, by default it will be placed before the input.
     * @default null
     */
    container: HTMLElement | string | null;
    /**
     * Show the clear button in the Timepicker.
     * @default false
     */
    showClearBtn: boolean;
    /**
     *  Autosubmit timepicker selection to input field
     *  @default true
     */
    autoSubmit: true;
    /**
     * Default time to set on the timepicker 'now' or '13:14'.
     * @default 'now';
     */
    defaultTime: string;
    /**
     * Millisecond offset from the defaultTime.
     * @default 0
     */
    fromNow: number;
    /**
     * Internationalization options.
     */
    i18n: Partial<I18nOptions>;
    /**
     * Use 12 hour AM/PM clock instead of 24 hour clock.
     * @default true
     */
    twelveHour: boolean;
    /**
     * Vibrate device when dragging clock hand.
     * @default true
     */
    vibrate: boolean;
    /**
     * Callback function when a time is selected.
     * @default null
     */
    onSelect: (hour: number, minute: number) => void;
    /**
     * Callback function for interaction with input field.
     * @default null
     */
    onInputInteraction: (() => void) | null;
    /**
     * Callback function for done.
     * @default null
     */
    onDone: (() => void) | null;
    /**
     * Callback function for cancel.
     * @default null
     */
    onCancel: (() => void) | null;
    /**
     * Display plugin
     */
    displayPlugin: string;
    /**
     * Configurable display plugin options
     */
    displayPluginOptions: object;
}
type Point = {
    x: number;
    y: number;
};
declare class Timepicker extends Component<TimepickerOptions> {
    el: HTMLInputElement;
    id: string;
    containerEl: HTMLElement;
    plate: HTMLElement;
    digitalClock: HTMLElement;
    inputHours: HTMLInputElement;
    inputMinutes: HTMLInputElement;
    x0: number;
    y0: number;
    moved: boolean;
    dx: number;
    dy: number;
    /**
     * Current view on the timepicker.
     * @default 'hours'
     */
    currentView: Views;
    hand: SVGElement;
    minutesView: HTMLElement;
    hours: number;
    minutes: number;
    /** The selected time. */
    time: string;
    /**
     * If the time is AM or PM on twelve-hour clock.
     * @default 'PM'
     */
    amOrPm: 'AM' | 'PM';
    static _template: any;
    /** Vibrate device when dragging clock hand. */
    vibrate: 'vibrate' | 'webkitVibrate' | null;
    _canvas: HTMLElement;
    hoursView: HTMLElement;
    spanAmPm: HTMLSpanElement;
    footer: HTMLElement;
    private _amBtn;
    private _pmBtn;
    bg: Element;
    bearing: Element;
    g: Element;
    toggleViewTimer: string | number | NodeJS.Timeout;
    vibrateTimer: NodeJS.Timeout | number;
    private displayPlugin;
    constructor(el: HTMLInputElement, options: Partial<TimepickerOptions>);
    static get defaults(): TimepickerOptions;
    /**
     * Initializes instance of Timepicker.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLInputElement, options?: Partial<TimepickerOptions>): Timepicker;
    /**
     * Initializes instances of Timepicker.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<HTMLInputElement | MElement>, options?: Partial<TimepickerOptions>): Timepicker[];
    static _addLeadingZero(num: number): string;
    static _createSVGEl(name: string): SVGElement;
    static _Pos(e: TouchEvent | MouseEvent): Point;
    static getInstance(el: HTMLElement): Timepicker;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleInputClick: () => void;
    _handleInputKeydown: (e: KeyboardEvent) => void;
    _handleTimeInputEnterKey: (e: KeyboardEvent) => void;
    _handleClockClickStart: (e: any) => void;
    _handleDocumentClickMove: (e: any) => void;
    _handleDocumentClickEnd: (e: any) => void;
    _insertHTMLIntoDOM(): void;
    _setupVariables(): void;
    _pickerSetup(): void;
    _clockSetup(): void;
    _buildSVGClock(): void;
    _buildHoursView(): void;
    _buildHoursTick(i: number, radian: number, radius: number): void;
    _buildMinutesView(): void;
    _handleAmPmClick: (e: MouseEvent) => void;
    _handleAmPmKeypress: (e: KeyboardEvent) => void;
    _handleAmPmInteraction: (e: HTMLElement) => void;
    _updateAmPmView(): void;
    _updateTimeFromInput(): void;
    /**
     * Show hours or minutes view on timepicker.
     * @param view The name of the view you want to switch to, 'hours' or 'minutes'.
     * @param delay
     */
    showView: (view: Views, delay?: number) => void;
    resetClock(delay: any): void;
    _inputFromTextField: () => void;
    drawClockFromTimeInput(value: any, isHours: any): void;
    setHand(x: any, y: any, roundBy5?: boolean): void;
    setClockAttributes(radian: number, radius: number): void;
    formatHours(): void;
    formatMinutes(): void;
    setHoursDefault(): void;
    done: (clearValue?: any) => void;
    confirm: () => void;
    cancel: () => void;
    clear: () => void;
    open(): this;
    close(): this;
}

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
interface TooltipOptions extends BaseOptions$1 {
    /**
     * Delay time before tooltip disappears.
     * @default 200
     */
    exitDelay: number;
    /**
     * Delay time before tooltip appears.
     * @default 0
     */
    enterDelay: number;
    /**
     * Element Id for the tooltip.
     * @default ""
     */
    tooltipId?: string;
    /**
     * Text string for the tooltip.
     * @default ""
     */
    text: string;
    /**
     * Set distance tooltip appears away from its activator
     * excluding transitionMovement.
     * @default 5
     */
    margin: number;
    /**
     * Enter transition duration.
     * @default 300
     */
    inDuration: number;
    /**
     * Opacity of the tooltip.
     * @default 1
     */
    opacity: number;
    /**
     * Exit transition duration.
     * @default 250
     */
    outDuration: number;
    /**
     * Set the direction of the tooltip.
     * @default 'bottom'
     */
    position: TooltipPosition;
    /**
     * Amount in px that the tooltip moves during its transition.
     * @default 10
     */
    transitionMovement: number;
}
declare class Tooltip extends Component<TooltipOptions> {
    /**
     * If tooltip is open.
     */
    isOpen: boolean;
    /**
     * If tooltip is hovered.
     */
    isHovered: boolean;
    /**
     * If tooltip is focused.
     */
    isFocused: boolean;
    tooltipEl: HTMLElement;
    private _exitDelayTimeout;
    private _enterDelayTimeout;
    xMovement: number;
    yMovement: number;
    constructor(el: HTMLElement, options: Partial<TooltipOptions>);
    static get defaults(): TooltipOptions;
    /**
     * Initializes instance of Tooltip.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLElement, options?: Partial<TooltipOptions>): Tooltip;
    /**
     * Initializes instances of Tooltip.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<MElement>, options?: Partial<TooltipOptions>): Tooltip[];
    static getInstance(el: HTMLElement): Tooltip;
    destroy(): void;
    _appendTooltipEl(): void;
    _setTooltipContent(tooltipContentEl: HTMLElement): void;
    _updateTooltipContent(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    /**
     * Show tooltip.
     */
    open: (isManual: boolean) => void;
    /**
     * Hide tooltip.
     */
    close: () => void;
    _setExitDelayTimeout(): void;
    _setEnterDelayTimeout(isManual: any): void;
    _positionTooltip(): void;
    _repositionWithinScreen(x: number, y: number, width: number, height: number): {
        x: number;
        y: number;
    };
    _animateIn(): void;
    _animateOut(): void;
    _handleMouseEnter: () => void;
    _handleMouseLeave: () => void;
    _handleFocus: () => void;
    _handleBlur: () => void;
    _getAttributeOptions(): Partial<TooltipOptions>;
}

interface BaseOptions {
}
type InputElement = HTMLInputElement | HTMLTextAreaElement;
declare class CharacterCounter extends Component<object> {
    el: InputElement;
    /** Stores the reference to the counter HTML element. */
    counterEl: HTMLSpanElement;
    /** Specifies whether the input is valid or not. */
    isInvalid: boolean;
    /** Specifies whether the input text has valid length or not. */
    isValidLength: boolean;
    constructor(el: HTMLInputElement | HTMLTextAreaElement, options: Partial<BaseOptions>);
    static get defaults(): BaseOptions;
    /**
     * Initializes instance of CharacterCounter.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: InputElement, options?: Partial<BaseOptions>): CharacterCounter;
    /**
     * Initializes instances of CharacterCounter.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<InputElement | MElement>, options?: Partial<BaseOptions>): CharacterCounter[];
    static getInstance(el: InputElement): CharacterCounter;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _setupCounter(): void;
    _removeCounter(): void;
    updateCounter: () => void;
    _validateInput(): void;
}

declare class Forms {
    /**
     * Checks if the label has validation and apply
     * the correct class and styles
     * @param textfield
     */
    static validateField(textfield: HTMLInputElement): void;
    /**
     * Resizes the given TextArea after updating the
     *  value content dynamically.
     * @param e EventTarget
     */
    static textareaAutoResize(e: EventTarget): void;
    static Init(): void;
    static InitTextarea(textarea: HTMLTextAreaElement): void;
    static InitFileInputPath(fileInput: HTMLInputElement): void;
}

interface SliderOptions extends BaseOptions$1 {
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
declare class Slider extends Component<SliderOptions> {
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
    constructor(el: HTMLElement, options: Partial<SliderOptions>);
    static get defaults(): SliderOptions;
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
    static getInstance(el: HTMLElement): Slider;
    destroy(): void;
    private _setupEventHandlers;
    private _removeEventHandlers;
    private _handleIndicatorClick;
    private _handleAutoPauseHover;
    private _handleAutoPauseFocus;
    private _handleAutoStartHover;
    private _handleAutoStartFocus;
    private _handleInterval;
    private _animateSlide;
    private _setSliderHeight;
    private _setupIndicators;
    private _removeIndicators;
    set(index: number): void;
    _pause(fromEvent: boolean): void;
    /**
     * Pause slider autoslide.
     */
    pause: () => void;
    /**
     * Start slider autoslide.
     */
    start: () => void;
    /**
     * Move to next slider.
     */
    next: () => void;
    /**
     * Move to prev slider.
     */
    prev: () => void;
}

interface ToastOptions extends BaseOptions$1 {
    /**
     * The content of the Toast.
     * @default ""
     */
    text: string;
    /**
     * Element Id for the tooltip.
     * @default ""
     */
    toastId?: string;
    /**
     * Length in ms the Toast stays before dismissal.
     * @default 4000
     */
    displayLength: number;
    /**
     * Transition in duration in milliseconds.
     * @default 300
     */
    inDuration: number;
    /**
     * Transition out duration in milliseconds.
     * @default 375
     */
    outDuration: number;
    /**
     * Classes to be added to the toast element.
     * @default ""
     */
    classes: string;
    /**
     * Callback function called when toast is dismissed.
     * @default null
     */
    completeCallback: () => void;
    /**
     * The percentage of the toast's width it takes fora drag
     * to dismiss a Toast.
     * @default 0.8
     */
    activationPercent: number;
}
declare class Toast {
    /** The toast element. */
    el: HTMLElement;
    /**
     * The remaining amount of time in ms that the toast
     * will stay before dismissal.
     */
    timeRemaining: number;
    /**
     * Describes the current pan state of the Toast.
     */
    panning: boolean;
    options: ToastOptions;
    message: string;
    counterInterval: NodeJS.Timeout | number;
    wasSwiped: boolean;
    startingXPos: number;
    xPos: number;
    time: number;
    deltaX: number;
    velocityX: number;
    static _toasts: Toast[];
    static _container: HTMLElement;
    static _draggedToast: Toast;
    constructor(options: Partial<ToastOptions>);
    static get defaults(): ToastOptions;
    static getInstance(el: HTMLElement): Toast;
    static _createContainer(): void;
    static _removeContainer(): void;
    static _onDragStart(e: TouchEvent | MouseEvent): void;
    static _onDragMove(e: TouchEvent | MouseEvent): void;
    static _onDragEnd(): void;
    static _xPos(e: TouchEvent | MouseEvent): number;
    /**
     * dismiss all toasts.
     */
    static dismissAll(): void;
    _createToast(): HTMLElement;
    _animateIn(): void;
    /**
     * Create setInterval which automatically removes toast when timeRemaining >= 0
     * has been reached.
     */
    _setTimer(): void;
    /**
     * Dismiss toast with animation.
     */
    dismiss(): void;
}

type RGBColor = {
    r: number;
    g: number;
    b: number;
};
type Position = {
    x: number;
    y: number;
};
declare class Waves {
    private static _offset;
    static renderWaveEffect(targetElement: HTMLElement, position?: Position | null, color?: RGBColor | null): void;
    static Init(): void;
}

interface RangeOptions extends BaseOptions$1 {
}
declare class Range extends Component<RangeOptions> {
    el: HTMLInputElement;
    private _mousedown;
    value: HTMLElement;
    thumb: HTMLElement;
    constructor(el: HTMLInputElement, options: Partial<RangeOptions>);
    static get defaults(): RangeOptions;
    /**
     * Initializes instance of Range.
     * @param el HTML element.
     * @param options Component options.
     */
    static init(el: HTMLInputElement, options?: Partial<RangeOptions>): Range;
    /**
     * Initializes instances of Range.
     * @param els HTML elements.
     * @param options Component options.
     */
    static init(els: InitElements<HTMLInputElement | MElement>, options?: Partial<RangeOptions>): Range[];
    static getInstance(el: HTMLInputElement): Range;
    destroy(): void;
    _setupEventHandlers(): void;
    _removeEventHandlers(): void;
    _handleRangeChange: () => void;
    _handleRangeMousedownTouchstart: (e: MouseEvent | TouchEvent) => void;
    _handleRangeInputMousemoveTouchmove: () => void;
    _handleRangeMouseupTouchend: () => void;
    _handleRangeBlurMouseoutTouchleave: () => void;
    _setupThumb(): void;
    _removeThumb(): void;
    _showRangeBubble(): void;
    _calcRangeOffset(): number;
    /**
     * Initializes every range input in the current document.
     */
    static Init(): void;
}

declare const version = "2.2.2";
interface AutoInitOptions {
    Autocomplete?: Partial<AutocompleteOptions>;
    Cards?: Partial<CardsOptions>;
    Carousel?: Partial<CarouselOptions>;
    Chips?: Partial<ChipsOptions>;
    Collapsible?: Partial<CollapsibleOptions>;
    Datepicker?: Partial<DatepickerOptions>;
    Dropdown?: Partial<DropdownOptions>;
    Materialbox?: Partial<MaterialboxOptions>;
    Modal?: Partial<ModalOptions>;
    Parallax?: Partial<ParallaxOptions>;
    Pushpin?: Partial<PushpinOptions>;
    ScrollSpy?: Partial<ScrollSpyOptions>;
    FormSelect?: Partial<FormSelectOptions>;
    Sidenav?: Partial<SidenavOptions>;
    Tabs?: Partial<TabsOptions>;
    TapTarget?: Partial<TapTargetOptions>;
    Timepicker?: Partial<TimepickerOptions>;
    Tooltip?: Partial<TooltipOptions>;
    FloatingActionButton?: Partial<FloatingActionButtonOptions>;
}
/**
 * Automatically initialize components.
 * @param context Root element to initialize. Defaults to `document.body`.
 * @param options Options for each component.
 */
declare function AutoInit(context?: HTMLElement, options?: Partial<AutoInitOptions>): void;

export { AutoInit, Autocomplete, Cards, Carousel, CharacterCounter, Chips, Collapsible, Datepicker, Dropdown, FloatingActionButton, FormSelect, Forms, Materialbox, Modal, Parallax, Pushpin, Range, ScrollSpy, Sidenav, Slider, Tabs, TapTarget, Timepicker, Toast, Tooltip, Waves, version };
export type { AutoInitOptions };
