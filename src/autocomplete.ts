import { Component } from "./component";
import { DropdownOptions } from "./dropdown";
import { M } from "./global";

export interface AutocompleteOptions {
  data?: any[];
  onAutocomplete?(selectedValue: any): void;
  maxDropDownHeight?: string;
  dropdownOptions?: DropdownOptions;
  minLength?: number;
  isMultiSelect?: boolean;
  onSearch?(text: string, autocomplete: Autocomplete, options: AutocompleteOptions):void;
  allowUnsafeHTML?: boolean;
}

const _defaults: AutocompleteOptions = {
  data: [], // Autocomplete data set
  dropdownOptions: {
    // Default dropdown options
    autoFocus: false,
    closeOnClick: false,
    coverTrigger: false
  },
  onAutocomplete: null,
  minLength: 1, // Min characters before autocomplete starts
  isMultiSelect: false,
  onSearch: (text, autocomplete, options) => {
    const filteredData = options.data.filter(item => {
      return Object.keys(item)
        .map(key => item[key].toString().toLowerCase().indexOf(text.toLowerCase()) >= 0)
        .some(isMatch => isMatch);
    });
    autocomplete.setMenuItems(filteredData);
  },
  maxDropDownHeight: '300px',
  allowUnsafeHTML: false
};


export class Autocomplete extends Component {
  el: HTMLInputElement;
  isOpen: boolean;
  count: number;
  activeIndex: number;
  private oldVal: any;
  private $inputField: any;
  private $active: HTMLElement|null;
  private _mousedown: boolean;
  private _handleInputBlurBound: any;
  private _handleInputKeyupAndFocusBound: any;
  private _handleInputKeydownBound: any;
  private _handleInputClickBound: any;
  private _handleContainerMousedownAndTouchstartBound: any;
  private _handleContainerMouseupAndTouchendBound: any;
  container: HTMLElement;
  dropdown: any;
  static _keydown: boolean;
  selectedValues: any[];
  menuItems: any[];


  constructor(el, protected options: AutocompleteOptions) {
    super(Autocomplete, el, options);
    (this.el as any).M_Autocomplete = this;
    this.options = {...Autocomplete.defaults, ...options};
    this.isOpen = false;
    this.count = 0;
    this.activeIndex = -1;
    this.oldVal;
    this.selectedValues = [];
    this.menuItems = [];
    this.$active = null;
    this._mousedown = false;
    this._setupDropdown();
    this._setupEventHandlers();
  }
  static get defaults() {
    return _defaults;
  }
  static init(els, options: AutocompleteOptions) {
    return super.init(this, els, options);
  }
  static getInstance(el) {
    let domElem = el.jquery ? el[0] : el;
    return domElem.M_Autocomplete;
  }

  destroy() {
    this._removeEventHandlers();
    this._removeDropdown();
    (this.el as any).M_Autocomplete = undefined;
  }

  _setupEventHandlers() {
    this._handleInputBlurBound = this._handleInputBlur.bind(this);
    this._handleInputKeyupAndFocusBound = this._handleInputKeyupAndFocus.bind(this);
    this._handleInputKeydownBound = this._handleInputKeydown.bind(this);
    this._handleInputClickBound = this._handleInputClick.bind(this);
    this._handleContainerMousedownAndTouchstartBound = this._handleContainerMousedownAndTouchstart.bind(
      this
    );
    this._handleContainerMouseupAndTouchendBound = this._handleContainerMouseupAndTouchend.bind(
      this
    );
    this.el.addEventListener('blur', this._handleInputBlurBound);
    this.el.addEventListener('keyup', this._handleInputKeyupAndFocusBound);
    this.el.addEventListener('focus', this._handleInputKeyupAndFocusBound);
    this.el.addEventListener('keydown', this._handleInputKeydownBound);
    this.el.addEventListener('click', this._handleInputClickBound);
    this.container.addEventListener(
      'mousedown',
      this._handleContainerMousedownAndTouchstartBound
    );
    this.container.addEventListener('mouseup', this._handleContainerMouseupAndTouchendBound);
    if (typeof window.ontouchstart !== 'undefined') {
      this.container.addEventListener(
        'touchstart',
        this._handleContainerMousedownAndTouchstartBound
      );
      this.container.addEventListener('touchend', this._handleContainerMouseupAndTouchendBound);
    }
  }

  _removeEventHandlers() {
    this.el.removeEventListener('blur', this._handleInputBlurBound);
    this.el.removeEventListener('keyup', this._handleInputKeyupAndFocusBound);
    this.el.removeEventListener('focus', this._handleInputKeyupAndFocusBound);
    this.el.removeEventListener('keydown', this._handleInputKeydownBound);
    this.el.removeEventListener('click', this._handleInputClickBound);
    this.container.removeEventListener(
      'mousedown',
      this._handleContainerMousedownAndTouchstartBound
    );
    this.container.removeEventListener('mouseup', this._handleContainerMouseupAndTouchendBound);

    if (typeof window.ontouchstart !== 'undefined') {
      this.container.removeEventListener(
        'touchstart',
        this._handleContainerMousedownAndTouchstartBound
      );
      this.container.removeEventListener(
        'touchend',
        this._handleContainerMouseupAndTouchendBound
      );
    }
  }

  _setupDropdown() {      
    this.container = document.createElement('ul');
    this.container.style.maxHeight = this.options.maxDropDownHeight;
    this.container.id = `autocomplete-options-${M.guid()}`;
    this.container.classList.add('autocomplete-content', 'dropdown-content');
    this.el.setAttribute('data-target', this.container.id);

    // ! Issue in Component Dropdown: _placeDropdown moves dom-position
    this.el.parentElement.appendChild(this.container); 

    // Initialize dropdown
    let dropdownOptions = {
      ...Autocomplete.defaults.dropdownOptions,
      ...this.options.dropdownOptions
    };
    let userOnItemClick = dropdownOptions.onItemClick;
    // Ensuring the select Option call when user passes custom onItemClick function to dropdown
    dropdownOptions.onItemClick = (li) => {
      if (!li) return;
      const entryID = li.getAttribute('data-id');
      this.selectOption(entryID);
      // Handle user declared onItemClick if needed
      if (userOnItemClick && typeof userOnItemClick === 'function')
        userOnItemClick.call(this.dropdown, this.el);
    };
    this.dropdown = M.Dropdown.init(this.el, dropdownOptions);

    // ! Workaround for Label: move label up again
    // TODO: Just use PopperJS in future!
    const label = this.el.parentElement.querySelector('label');
    if (label) this.el.after(label);

    // Sketchy removal of dropdown click handler
    this.el.removeEventListener('click', this.dropdown._handleClickBound);
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

  _handleInputBlur() {
    if (!this._mousedown) {
      this.close();
      this._resetAutocomplete();
    }
  }

  _handleInputKeyupAndFocus(e) {
    if (e.type === 'keyup') Autocomplete._keydown = false;
    this.count = 0;
    const actualValue = this.el.value.toLowerCase();
    // Don't capture enter or arrow key usage.
    if (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) return;
    // Check if the input isn't empty
    // Check if focus triggered by tab
    if (this.oldVal !== actualValue && (M.tabPressed || e.type !== 'focus')) {
      this.open();
    }
    // Value has changed!
    if (this.oldVal !== actualValue) {
      this._setStatusLoading();
      this.options.onSearch(this.el.value, this, this.options);
    }
    // Reset Single-Select when Input cleared
    if (!this.options.isMultiSelect && this.el.value.length === 0) {
      this.selectedValues = [];
      this._triggerChanged();
    }
    this.oldVal = actualValue;
  }

  _handleInputKeydown(e) {
    Autocomplete._keydown = true;
    // Arrow keys and enter key usage
    const keyCode = e.keyCode;
    const numItems = this.container.querySelectorAll('li').length;
    // select element on Enter
    if (keyCode === M.keys.ENTER && this.activeIndex >= 0) {
      const liElement = this.container.querySelectorAll('li')[this.activeIndex];
      if (liElement) {
        this.selectOption(liElement.getAttribute('data-id'));
        e.preventDefault();
      }
      return;
    }
    // Capture up and down key
    if (keyCode === M.keys.ARROW_UP || keyCode === M.keys.ARROW_DOWN) {
      e.preventDefault();
      if (keyCode === M.keys.ARROW_UP && this.activeIndex > 0) this.activeIndex--;
      if (keyCode === M.keys.ARROW_DOWN && this.activeIndex < numItems - 1) this.activeIndex++;
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

  _handleInputClick(e) {
    this.open();
  }

  _handleContainerMousedownAndTouchstart(e) {
    this._mousedown = true;
  }

  _handleContainerMouseupAndTouchend(e) {
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

  _highlightPartialText(input, label) {
    const start = label.toLowerCase().indexOf('' + input.toLowerCase() + '');
    const end = start + input.length - 1;
    //custom filters may return results where the string does not match any part
    if (start == -1 || end == -1) {
      return [label, '', ''];
    }
    return [label.slice(0, start), label.slice(start, end + 1), label.slice(end + 1)];
  }

  _createDropdownItem(entry) {
    const item = document.createElement('li');
    item.setAttribute('data-id', entry.id);
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
    const inputText = this.el.value.toLowerCase();
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
      this.el.value = entry.text || entry.id; // Write Text to Input
    }
  }

  _triggerChanged() {
    this.$el.trigger('change');
    // Trigger Autocomplete Event
    if (typeof this.options.onAutocomplete === 'function')
      this.options.onAutocomplete.call(this, this.selectedValues);
  }

  open() {
    const inputText = this.el.value.toLowerCase();
    this._resetAutocomplete();
    if (inputText.length >= this.options.minLength) {
      this.isOpen = true;
      this._renderDropdown();
    }
    // Open dropdown
    if (!this.dropdown.isOpen) {
      setTimeout(() => {
        this.dropdown.open();
      }, 100);
    }
    else this.dropdown.recalculateDimensions(); // Recalculate dropdown when its already open
  }

  close() {
    this.dropdown.close();
  }

  setMenuItems(menuItems) {
    this.menuItems = menuItems;
    this.open();
    this._updateSelectedInfo();
  }

  setValues(entries) {
    this.selectedValues = entries;
    this._updateSelectedInfo();
    if (!this.options.isMultiSelect) {
      this._refreshInputText();
    }
    this._triggerChanged();
  }

  selectOption(id) {
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
   
