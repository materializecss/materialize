import { Utils } from "./utils";
import { Dropdown, DropdownOptions } from "./dropdown";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface AutocompleteData {
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

export interface AutocompleteOptions extends BaseOptions {
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
};

const _defaults: AutocompleteOptions = {
  data: [], // Autocomplete data set
  onAutocomplete: null, // Callback for when autocompleted
  dropdownOptions: {
    // Default dropdown options
    autoFocus: false,
    closeOnClick: false,
    coverTrigger: false
  },
  minLength: 1, // Min characters before autocomplete starts
  isMultiSelect: false,
  onSearch: (text: string, autocomplete: Autocomplete) => {
    const normSearch = text.toLocaleLowerCase();
    autocomplete.setMenuItems(
      autocomplete.options.data.filter((option) => 
        option.id.toString().toLocaleLowerCase().includes(normSearch)
          || option.text?.toLocaleLowerCase().includes(normSearch)
      )
    );
  },
  maxDropDownHeight: '300px',
  allowUnsafeHTML: false
};

export class Autocomplete extends Component<AutocompleteOptions> {
  declare el: HTMLInputElement;
  /** If the autocomplete is open. */
  isOpen: boolean;
  /** Number of matching autocomplete options. */
  count: number;
  /** Index of the current selected option. */
  activeIndex: number;
  private oldVal: string;
  private $active: HTMLElement|null;
  private _mousedown: boolean;
  container: HTMLElement;
  /** Instance of the dropdown plugin for this autocomplete. */
  dropdown: Dropdown;
  static _keydown: boolean;
  selectedValues: AutocompleteData[];
  menuItems: AutocompleteData[];

  constructor(el: HTMLInputElement, options: Partial<AutocompleteOptions>) {
    super(el, options, Autocomplete);
    (this.el as any).M_Autocomplete = this;

    this.options = {
      ...Autocomplete.defaults,
      ...options
    };
    
    this.isOpen = false;
    this.count = 0;
    this.activeIndex = -1;
    this.oldVal = "";
    this.selectedValues = [];
    this.menuItems = this.options.data || [];
    this.$active = null;
    this._mousedown = false;
    this._setupDropdown();
    this._setupEventHandlers();
  }

  static get defaults(): AutocompleteOptions {
    return _defaults;
  }

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
  /**
   * Initializes instances of Autocomplete.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLInputElement | InitElements<HTMLInputElement | MElement>, options: Partial<AutocompleteOptions> = {}): Autocomplete | Autocomplete[] {
    return super.init(els, options, Autocomplete);
  }

  static getInstance(el: HTMLElement): Autocomplete {
    return (el as any).M_Autocomplete;
  }

  destroy() {
    this._removeEventHandlers();
    this._removeDropdown();
    (this.el as any).M_Autocomplete = undefined;
  }

  _setupEventHandlers() {
    this.el.addEventListener('blur', this._handleInputBlur);
    this.el.addEventListener('keyup', this._handleInputKeyupAndFocus);
    this.el.addEventListener('focus', this._handleInputKeyupAndFocus);
    this.el.addEventListener('keydown', this._handleInputKeydown);
    this.el.addEventListener('click', this._handleInputClick);
    this.container.addEventListener(
      'mousedown',
      this._handleContainerMousedownAndTouchstart
    );
    this.container.addEventListener('mouseup', this._handleContainerMouseupAndTouchend);
    if (typeof window.ontouchstart !== 'undefined') {
      this.container.addEventListener(
        'touchstart',
        this._handleContainerMousedownAndTouchstart
      );
      this.container.addEventListener('touchend', this._handleContainerMouseupAndTouchend);
    }
  }

  _removeEventHandlers() {
    this.el.removeEventListener('blur', this._handleInputBlur);
    this.el.removeEventListener('keyup', this._handleInputKeyupAndFocus);
    this.el.removeEventListener('focus', this._handleInputKeyupAndFocus);
    this.el.removeEventListener('keydown', this._handleInputKeydown);
    this.el.removeEventListener('click', this._handleInputClick);
    this.container.removeEventListener(
      'mousedown',
      this._handleContainerMousedownAndTouchstart
    );
    this.container.removeEventListener('mouseup', this._handleContainerMouseupAndTouchend);

    if (typeof window.ontouchstart !== 'undefined') {
      this.container.removeEventListener(
        'touchstart',
        this._handleContainerMousedownAndTouchstart
      );
      this.container.removeEventListener(
        'touchend',
        this._handleContainerMouseupAndTouchend
      );
    }
  }

  _setupDropdown() {
    this.container = document.createElement('ul');
    this.container.style.maxHeight = this.options.maxDropDownHeight;
    this.container.id = `autocomplete-options-${Utils.guid()}`;
    this.container.classList.add('autocomplete-content', 'dropdown-content');
    this.el.setAttribute('data-target', this.container.id);

    this.menuItems.forEach(menuItem => {
      const itemElement = this._createDropdownItem(menuItem);
      this.container.append(itemElement);
    });

    // ! Issue in Component Dropdown: _placeDropdown moves dom-position
    this.el.parentElement.appendChild(this.container);

    // Initialize dropdown
    const dropdownOptions = {
      ...Autocomplete.defaults.dropdownOptions,
      ...this.options.dropdownOptions
    };
    const userOnItemClick = dropdownOptions.onItemClick;
    // Ensuring the select Option call when user passes custom onItemClick function to dropdown
    dropdownOptions.onItemClick = (li) => {
      if (!li) return;
      const entryID = li.getAttribute('data-id');
      this.selectOption(entryID);
      // Handle user declared onItemClick if needed
      if (userOnItemClick && typeof userOnItemClick === 'function')
        userOnItemClick.call(this.dropdown, this.el);
    };
    this.dropdown = Dropdown.init(this.el, dropdownOptions);

    // ! Workaround for Label: move label up again
    // TODO: Just use PopperJS in future!
    const label = this.el.parentElement.querySelector('label');
    if (label) this.el.after(label);

    // Sketchy removal of dropdown click handler
    this.el.removeEventListener('click', this.dropdown._handleClick);
    // Set Value if already set in HTML
    if (this.el.value) this.selectOption(this.el.value);
    // Add StatusInfo
    const div = document.createElement('div');
    div.classList.add('status-info');
    div.setAttribute('style', 'position: absolute;right:0;top:0;');
    this.el.parentElement.appendChild(div);
    this._updateSelectedInfo();
  }

  _removeDropdown() {
    this.container.parentNode.removeChild(this.container);
  }

  _handleInputBlur = () => {
    if (!this._mousedown) {
      this.close();
      this._resetAutocomplete();
    }
  }

  _handleInputKeyupAndFocus = (e: KeyboardEvent) => {
    if (e.type === 'keyup') Autocomplete._keydown = false;
    this.count = 0;
    const actualValue = this.el.value.toLocaleLowerCase();
    // Don't capture enter or arrow key usage.
    if (Utils.keys.ENTER.includes(e.key) || Utils.keys.ARROW_UP.includes(e.key) || Utils.keys.ARROW_DOWN.includes(e.key)) return;
    // Check if the input isn't empty
    // Check if focus triggered by tab
    if (this.oldVal !== actualValue && (Utils.tabPressed || e.type !== 'focus')) {
      this.open();
    }
    // Value has changed!
    if (this.oldVal !== actualValue) {
      this._setStatusLoading();
      this.options.onSearch(this.el.value, this);
    }
    // Reset Single-Select when Input cleared
    if (!this.options.isMultiSelect && this.el.value.length === 0) {
      this.selectedValues = [];
      this._triggerChanged();
    }
    this.oldVal = actualValue;
  }

  _handleInputKeydown = (e: KeyboardEvent) => {
    Autocomplete._keydown = true;
    // Arrow keys and enter key usage
    const numItems = this.container.querySelectorAll('li').length;
    // select element on Enter
    if (Utils.keys.ENTER.includes(e.key) && this.activeIndex >= 0) {
      const liElement = this.container.querySelectorAll('li')[this.activeIndex];
      if (liElement) {
        this.selectOption(liElement.getAttribute('data-id'));
        e.preventDefault();
      }
      return;
    }
    // Capture up and down key
    if (Utils.keys.ARROW_UP.includes(e.key) || Utils.keys.ARROW_DOWN.includes(e.key)) {
      e.preventDefault();
      if (Utils.keys.ARROW_UP.includes(e.key) && this.activeIndex > 0) this.activeIndex--;
      if (Utils.keys.ARROW_DOWN.includes(e.key) && this.activeIndex < numItems - 1) this.activeIndex++;
      this.$active?.classList.remove('active');
      if (this.activeIndex >= 0) {
        this.$active = this.container.querySelectorAll('li')[this.activeIndex];
        this.$active?.classList.add('active');
        // Focus selected
        this.container.children[this.activeIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }

  _handleInputClick = () => {
    this.open();
  }

  _handleContainerMousedownAndTouchstart = () => {
    this._mousedown = true;
  }

  _handleContainerMouseupAndTouchend = () => {
    this._mousedown = false;
  }

  _resetCurrentElementPosition() {
    this.activeIndex = -1;
    this.$active?.classList.remove('active');
  }

  _resetAutocomplete() {
    this.container.replaceChildren();
    this._resetCurrentElementPosition();
    this.oldVal = null;
    this.isOpen = false;
    this._mousedown = false;
  }

  _highlightPartialText(input: string, label: string) {
    const start = label.toLocaleLowerCase().indexOf('' + input.toLocaleLowerCase() + '');
    const end = start + input.length - 1;
    //custom filters may return results where the string does not match any part
    if (start == -1 || end == -1) {
      return [label, '', ''];
    }
    return [label.slice(0, start), label.slice(start, end + 1), label.slice(end + 1)];
  }

  _createDropdownItem(entry: AutocompleteData) {
    const item = document.createElement('li');
    item.setAttribute('data-id', <string>entry.id);
    item.setAttribute(
      'style',
      'display:grid; grid-auto-flow: column; user-select: none; align-items: center;'
    );
    // Checkbox
    if (this.options.isMultiSelect) {
      item.innerHTML = `
        <div class="item-selection" style="text-align:center;">
        <input type="checkbox"${
          this.selectedValues.some((sel) => sel.id === entry.id) ? ' checked="checked"' : ''
        }><span style="padding-left:21px;"></span>
      </div>`;
    }
    // Image
    if (entry.image) {
      const img = document.createElement('img');
      img.classList.add('circle');
      img.src = entry.image;
      item.appendChild(img);
    }

    // Text
    const inputText = this.el.value.toLocaleLowerCase();
    const parts = this._highlightPartialText(inputText, (entry.text || entry.id).toString());
    const div = document.createElement('div');
    div.setAttribute('style', 'line-height:1.2;font-weight:500;');
    if (this.options.allowUnsafeHTML) {
      div.innerHTML = parts[0] + '<span class="highlight">' + parts[1] + '</span>' + parts[2];
    } else {
      div.appendChild(document.createTextNode(parts[0]));
      if (parts[1]) {
        const highlight = document.createElement('span');
        highlight.textContent = parts[1];
        highlight.classList.add('highlight');
        div.appendChild(highlight);
        div.appendChild(document.createTextNode(parts[2]));
      }
    }

    const itemText = document.createElement('div');
    itemText.classList.add('item-text');
    itemText.setAttribute('style', 'padding:5px;overflow:hidden;');
    item.appendChild(itemText);
    item.querySelector('.item-text').appendChild(div);
    // Description
    if (typeof entry.description === 'string' || (typeof entry.description === 'number' && !isNaN(entry.description))) {
      const description = document.createElement('small');
      description.setAttribute(
        'style',
        'line-height:1.3;color:grey;white-space:nowrap;text-overflow:ellipsis;display:block;width:90%;overflow:hidden;'
      );
      description.innerText = entry.description;
      item.querySelector('.item-text').appendChild(description);
    }
    // Set Grid
    const getGridConfig = () => {
      if (this.options.isMultiSelect) {
        if (entry.image) return '40px min-content auto'; // cb-img-txt
        return '40px auto'; // cb-txt
      }
      if (entry.image) return 'min-content auto'; // img-txt
      return 'auto'; // txt
    };
    item.style.gridTemplateColumns = getGridConfig();
    return item;
  }

  _renderDropdown() {
    this._resetAutocomplete();
    // Check if Data is empty
    if (this.menuItems.length === 0) {
      this.menuItems = this.selectedValues; // Show selected Items
    }
    for (let i = 0; i < this.menuItems.length; i++) {
      const item = this._createDropdownItem(this.menuItems[i]);
      this.container.append(item);
    }
  }

  _setStatusLoading() {
    this.el.parentElement.querySelector(
      '.status-info'
    ).innerHTML = `<div style="height:100%;width:50px;"><svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
    <circle fill="#888c" stroke="none" cx="6" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/></circle>
    <circle fill="#888c" stroke="none" cx="26" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/></circle>
    <circle fill="#888c" stroke="none" cx="46" cy="50" r="6"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite"  begin="0.3"/></circle>
  </svg></div>`;
  }

  _updateSelectedInfo() {
    const statusElement = this.el.parentElement.querySelector('.status-info');
    if (statusElement) {
      if (this.options.isMultiSelect) statusElement.innerHTML = this.selectedValues.length.toString();
      else statusElement.innerHTML = '';
    }
  }

  _refreshInputText() {
    if (this.selectedValues.length === 1) {
      const entry = this.selectedValues[0];
      this.el.value = entry.text || <string>entry.id; // Write Text to Input
    }
  }

  _triggerChanged() {
    this.el.dispatchEvent(new Event('change'));
    // Trigger Autocomplete Event
    if (typeof this.options.onAutocomplete === 'function')
      this.options.onAutocomplete.call(this, this.selectedValues);
  }

  /**
   * Show autocomplete.
   */
  open = () => {
    const inputText = this.el.value.toLocaleLowerCase();
    this._resetAutocomplete();
    if (inputText.length >= this.options.minLength) {
      this.isOpen = true;
      this._renderDropdown();
    }
    // Open dropdown
    if (!this.dropdown.isOpen) {
      setTimeout(() => {
        this.dropdown.open();
      }, 0); // TODO: why?
    }
    else this.dropdown.recalculateDimensions(); // Recalculate dropdown when its already open
  }

  /**
   * Hide autocomplete.
   */
  close = () => {
    this.dropdown.close();
  }

  /**
   * Updates the visible or selectable items shown in the menu.
   * @param menuItems Items to be available.
   */
  setMenuItems(menuItems: AutocompleteData[]) {
    this.menuItems = menuItems;
    this.open();
    this._updateSelectedInfo();
  }

  /**
   * Sets selected values.
   * @param entries
   */
  setValues(entries: AutocompleteData[]) {
    this.selectedValues = entries;
    this._updateSelectedInfo();
    if (!this.options.isMultiSelect) {
      this._refreshInputText();
    }
    this._triggerChanged();
  }

  /**
   * Select a specific autocomplete option via id-property.
   * @param id The id of a data-entry.
   */
  selectOption(id: number | string) {
    const entry = this.menuItems.find((item) => item.id == id);
    if (!entry) return;
    // Toggle Checkbox
    const li = this.container.querySelector('li[data-id="'+id+'"]');
    if (!li) return;
    if (this.options.isMultiSelect) {
      const checkbox = <HTMLInputElement|null>li.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      if (checkbox.checked) this.selectedValues.push(entry);
      else
        this.selectedValues = this.selectedValues.filter(
          (selectedEntry) => selectedEntry.id !== entry.id
        );
      this.el.focus();
    } else {
      // Single-Select
      this.selectedValues = [entry];
      this._refreshInputText();
      this._resetAutocomplete();
      this.close();
    }
    this._updateSelectedInfo();
    this._triggerChanged();
  }
}
