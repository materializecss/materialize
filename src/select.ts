import { Utils } from "./utils";
import { Dropdown, DropdownOptions } from "./dropdown";
import { Component, BaseOptions, InitElements, MElement } from "./component";

export interface FormSelectOptions extends BaseOptions {
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

const _defaults: FormSelectOptions = {
  classes: '',
  dropdownOptions: {}
};

type ValueStruct = {
  el: HTMLOptionElement,
  optionEl: HTMLElement,
}

export class FormSelect extends Component<FormSelectOptions> {
  declare el: HTMLSelectElement;
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
  selectOptions: (HTMLOptionElement|HTMLOptGroupElement)[];
  private _values: ValueStruct[];

  constructor(el: HTMLSelectElement, options: FormSelectOptions) {
    super(el, options, FormSelect);
    if (this.el.classList.contains('browser-default')) return;
    (this.el as any).M_FormSelect = this;

    this.options = {
      ...FormSelect.defaults,
      ...options
    };
    
    this.isMultiple = this.el.multiple;
    this.el.tabIndex = -1;
    this._values = [];
    this._setupDropdown();
    this._setupEventHandlers();
  }

  static get defaults(): FormSelectOptions {
    return _defaults;
  }

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
  /**
   * Initializes instances of FormSelect.
   * @param els HTML elements.
   * @param options Component options.
   */
  static init(els: HTMLSelectElement | InitElements<HTMLSelectElement | MElement>, options: Partial<FormSelectOptions> = {}): FormSelect | FormSelect[] {
    return super.init(els, options, FormSelect);
  }

  static getInstance(el: HTMLElement): FormSelect {
    return (el as any).M_FormSelect;
  }

  destroy() {
    this._removeEventHandlers();
    this._removeDropdown();
    (this.el as any).M_FormSelect = undefined;
  }

  _setupEventHandlers() {
    this.dropdownOptions.querySelectorAll('li:not(.optgroup)').forEach((el) => {
      el.addEventListener('click', this._handleOptionClick);
      el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === " " || e.key === "Enter") this._handleOptionClick(e);
      });
    });
    this.el.addEventListener('change', this._handleSelectChange);
    this.input.addEventListener('click', this._handleInputClick);
  }

  _removeEventHandlers() {
    this.dropdownOptions.querySelectorAll('li:not(.optgroup)').forEach((el) => {
      el.removeEventListener('click', this._handleOptionClick);
    });
    this.el.removeEventListener('change', this._handleSelectChange);
    this.input.removeEventListener('click', this._handleInputClick);
  }

  _handleSelectChange = () => {
    this._setValueToInput();
  }

  _handleOptionClick = (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault();
    const virtualOption = (e.target as HTMLLIElement).closest('li');
    this._selectOptionElement(virtualOption);
    e.stopPropagation();
  }

  _arraysEqual<T, E>(a: T[], b: (E|T)[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) if (a[i] !== b[i]) return false;
    return true;
  }

  _selectOptionElement(virtualOption: HTMLElement) {
    if (!virtualOption.classList.contains('disabled') && !virtualOption.classList.contains('optgroup')) {
      const value = this._values.find((value) => value.optionEl === virtualOption);
      const previousSelectedValues = this.getSelectedValues();
      if (this.isMultiple) {
        // Multi-Select
        this._toggleEntryFromArray(value);
      }
      else {
        // Single-Select
        this._deselectAll();
        this._selectValue(value);
      }
      // Refresh Input-Text
      this._setValueToInput();
      // Trigger Change-Event only when data is different
      const actualSelectedValues = this.getSelectedValues();
      const selectionHasChanged = !this._arraysEqual(
        previousSelectedValues,
        actualSelectedValues
      );
      if (selectionHasChanged) this.el.dispatchEvent(new Event('change',{bubbles:true, cancelable:true, composed:true})); // trigger('change');
    }
    if (!this.isMultiple) this.dropdown.close();
  }

  _handleInputClick = () => {
    if (this.dropdown && this.dropdown.isOpen) {
      this._setValueToInput();
      this._setSelectedStates();
    }
  }

  _setupDropdown() {
    this.labelEl = document.querySelector('[for="'+this.el.id+'"]');
    if (this.labelEl) this.labelEl.style.display = 'none';

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('select-wrapper', 'input-field');
    if (this.options.classes.length > 0) {
      this.wrapper.classList.add(...this.options.classes.split(' '));
    }
    this.el.before(this.wrapper);

    // Move actual select element into overflow hidden wrapper
    const hiddenDiv = document.createElement('div');
    hiddenDiv.classList.add('hide-select');
    this.wrapper.append(hiddenDiv);
    hiddenDiv.appendChild(this.el);

    if (this.el.disabled) this.wrapper.classList.add('disabled');

    this.selectOptions = <(HTMLOptGroupElement|HTMLOptionElement)[]>Array.from(this.el.children).filter(el => ['OPTION','OPTGROUP'].includes(el.tagName));

    // Create dropdown
    this.dropdownOptions = document.createElement('ul');
    this.dropdownOptions.id = `select-options-${Utils.guid()}`;
    this.dropdownOptions.classList.add('dropdown-content', 'select-dropdown');
    this.dropdownOptions.setAttribute('role', 'listbox');
    this.dropdownOptions.ariaMultiSelectable = this.isMultiple.toString();
    if (this.isMultiple) this.dropdownOptions.classList.add('multiple-select-dropdown');

    // Create dropdown structure
    if (this.selectOptions.length > 0) {
      this.selectOptions.forEach((realOption) => {
        if (realOption.tagName === 'OPTION') {
          // Option
          const virtualOption = this._createAndAppendOptionWithIcon(realOption, this.isMultiple ? 'multiple' : undefined);
          this._addOptionToValues(realOption as HTMLOptionElement, virtualOption);
        }
        else if (realOption.tagName === 'OPTGROUP') {
          // Optgroup
          const groupId = "opt-group-"+Utils.guid();
          const groupParent = document.createElement('li');
          groupParent.classList.add('optgroup');
          groupParent.tabIndex = -1;
          groupParent.setAttribute('role', 'group');
          groupParent.setAttribute('aria-labelledby', groupId);
          groupParent.innerHTML = `<span id="${groupId}" role="presentation">${realOption.getAttribute('label')}</span>`;
          this.dropdownOptions.append(groupParent);

          const groupChildren = [];
          const selectOptions = <HTMLOptionElement[]>Array.from(realOption.children).filter(el => el.tagName === 'OPTION');
          selectOptions.forEach(realOption => {
            const virtualOption = this._createAndAppendOptionWithIcon(realOption, 'optgroup-option');
            const childId = "opt-child-"+Utils.guid();
            virtualOption.id = childId;
            groupChildren.push(childId);
            this._addOptionToValues(realOption, virtualOption);
          });
          groupParent.setAttribute("aria-owns", groupChildren.join(" "));
        }
      });
    }
    this.wrapper.append(this.dropdownOptions);

    // Add input dropdown
    this.input = document.createElement('input');
    this.input.id = "m_select-input-" + Utils.guid();
    this.input.classList.add('select-dropdown', 'dropdown-trigger');
    this.input.type = 'text';
    this.input.readOnly = true;
    this.input.setAttribute('data-target', this.dropdownOptions.id);
    this.input.ariaReadOnly = 'true';
    this.input.ariaRequired = this.el.hasAttribute("required").toString(); //setAttribute("aria-required", this.el.hasAttribute("required"));
    if (this.el.disabled) this.input.disabled = true; // 'true');

    const attrs = this.el.attributes;
    for (let i = 0; i < attrs.length; ++i){
      const attr = attrs[i];
      if (attr.name.startsWith("aria-"))
        this.input.setAttribute(attr.name, attr.value);
    }

    // Adds aria-attributes to input element
    this.input.setAttribute('role', 'combobox');
    this.input.ariaExpanded = 'false';
    this.input.setAttribute("aria-owns", this.dropdownOptions.id);
    this.input.setAttribute("aria-controls", this.dropdownOptions.id);
    this.input.placeholder = " ";

    this.wrapper.prepend(this.input);
    this._setValueToInput();

    // Add caret
    const dropdownIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //document.createElement('svg')
    dropdownIcon.classList.add('caret');
    dropdownIcon.setAttribute('height', '24');
    dropdownIcon.setAttribute('width', '24');
    dropdownIcon.setAttribute('viewBox', '0 0 24 24');
    dropdownIcon.ariaHidden = 'true';
    dropdownIcon.innerHTML = `<path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/>`;
    this.wrapper.prepend(dropdownIcon);

    // Initialize dropdown
    if (!this.el.disabled) {
      const dropdownOptions = {...this.options.dropdownOptions}; // TODO:
      dropdownOptions.coverTrigger = false;
      const userOnOpenEnd = dropdownOptions.onOpenEnd;
      const userOnCloseEnd = dropdownOptions.onCloseEnd;
      // Add callback for centering selected option when dropdown content is scrollable
      dropdownOptions.onOpenEnd = (el) => {
        const selectedOption = this.dropdownOptions.querySelector('.selected');
        if (selectedOption) {
          // Focus selected option in dropdown
          Utils.keyDown = true;
          this.dropdown.focusedIndex = [...selectedOption.parentNode.children].indexOf(selectedOption);
          this.dropdown._focusFocusedItem();
          Utils.keyDown = false;
          // Handle scrolling to selected option
          if (this.dropdown.isScrollable) {
            let scrollOffset =
              selectedOption.getBoundingClientRect().top -
              (this.dropdownOptions as HTMLElement).getBoundingClientRect().top; // scroll to selected option
            scrollOffset -= this.dropdownOptions.clientHeight / 2; // center in dropdown
            this.dropdownOptions.scrollTop = scrollOffset;
          }
        }
        this.input.ariaExpanded = 'true';
        // Handle user declared onOpenEnd if needed
        if (userOnOpenEnd && typeof userOnOpenEnd === 'function')
          userOnOpenEnd.call(this.dropdown, this.el);
      };
      // Add callback for reseting "expanded" state
      dropdownOptions.onCloseEnd = (el) => {
        this.input.ariaExpanded = 'false';
        // Handle user declared onOpenEnd if needed
        if (userOnCloseEnd && typeof userOnCloseEnd === 'function')
          userOnCloseEnd.call(this.dropdown, this.el);
      };
      // Prevent dropdown from closing too early
      dropdownOptions.closeOnClick = false;
      this.dropdown = Dropdown.init(this.input, dropdownOptions);
    }
    // Add initial selections
    this._setSelectedStates();

    // Add Label
    if (this.labelEl) {
      const label = document.createElement('label');
      label.htmlFor = this.input.id;
      label.innerText = this.labelEl.innerText;
      this.input.after(label);
    }
  }

  _addOptionToValues(realOption: HTMLOptionElement, virtualOption: HTMLElement) {
    this._values.push({ el: realOption, optionEl: virtualOption });
  }

  _removeDropdown() {
    this.wrapper.querySelector('.caret').remove();
    this.input.remove();
    this.dropdownOptions.remove();
    this.wrapper.before(this.el);
    this.wrapper.remove();
  }

  _createAndAppendOptionWithIcon(realOption: HTMLOptionElement|HTMLOptGroupElement, type: string) {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    if (realOption.disabled){
      li.classList.add('disabled');
      li.ariaDisabled = 'true';
    }
    if (type === 'optgroup-option') li.classList.add(type);

    // Text / Checkbox
    const span = document.createElement('span');
    span.innerHTML = realOption.innerHTML;
    if (this.isMultiple && !realOption.disabled) {
      span.innerHTML = `<label><input type="checkbox"><span>${realOption.innerHTML}</span></label>`;
    }
    li.appendChild(span);

    // add Icon
    const iconUrl = realOption.getAttribute('data-icon');
    const classes = realOption.getAttribute('class')?.split(' ');
    if (iconUrl) {
      const img = document.createElement('img');
      if (classes) img.classList.add(...classes);
      img.src = iconUrl;
      img.ariaHidden = 'true';
      li.prepend(img);
    }
    // Check for multiple type
    this.dropdownOptions.append(li);
    return li;
  }

  _selectValue(value: ValueStruct) {
    value.el.selected = true;
    value.optionEl.classList.add('selected');
    value.optionEl.ariaSelected = 'true'; // setAttribute("aria-selected", true);
    const checkbox = <HTMLInputElement>value.optionEl.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.checked = true;
  }

  _deselectValue(value: ValueStruct) {
    value.el.selected = false;
    value.optionEl.classList.remove('selected');
    value.optionEl.ariaSelected = 'false'; //setAttribute("aria-selected", false);
    const checkbox = <HTMLInputElement>value.optionEl.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.checked = false;
  }

  _deselectAll() {
    this._values.forEach(value => this._deselectValue(value));
  }

  _isValueSelected(value: ValueStruct) {
    const realValues = this.getSelectedValues();
    return realValues.some((realValue) => realValue === value.el.value);
  }

  _toggleEntryFromArray(value: ValueStruct) {
    if (this._isValueSelected(value))
      this._deselectValue(value);
    else
      this._selectValue(value);
  }

  _getSelectedOptions(): HTMLOptionElement[] {
    // remove null, false, ... values
    return Array.prototype.filter.call(this.el.selectedOptions, (realOption: HTMLOptionElement) => realOption);
  }

  _setValueToInput() {
    const selectedRealOptions = this._getSelectedOptions();
    const selectedOptionPairs = this._values.filter((value) => selectedRealOptions.indexOf(value.el) >= 0);
    // Filter not disabled
    const notDisabledOptionPairs = selectedOptionPairs.filter(op => !op.el.disabled);
    const texts = notDisabledOptionPairs.map((value) => value.optionEl.querySelector('span').innerText.trim());
    // Set input-text to first Option with empty value which indicates a description like "choose your option"
    if (texts.length === 0) {
      const firstDisabledOption = <HTMLOptionElement>this.el.querySelector('option:disabled');
      if (firstDisabledOption && firstDisabledOption.value === '') {
        this.input.value = firstDisabledOption.innerText;
        return;
      }
    }
    this.input.value = texts.join(', ');
  }

  _setSelectedStates() {
    this._values.forEach((value) => {
      const optionIsSelected = value.el.selected;
      const cb = <HTMLInputElement>value.optionEl.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = optionIsSelected;
      if (optionIsSelected) {
        this._activateOption(this.dropdownOptions, value.optionEl);
      }
      else {
        value.optionEl.classList.remove('selected');
        value.optionEl.ariaSelected = 'false'; // attr("aria-selected", 'false');
      }
    });
  }

  _activateOption(ul: HTMLElement, li: HTMLElement) {
    if (!li) return;
    if (!this.isMultiple) ul.querySelectorAll('li.selected').forEach(li => li.classList.remove('selected'));
    li.classList.add('selected');
    li.ariaSelected = 'true';
  }

  getSelectedValues() {
    return this._getSelectedOptions().map((realOption) => realOption.value);
  }
}
