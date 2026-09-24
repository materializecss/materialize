import { Component } from '../atomic/component.mjs';

class Checkbox extends Component {
  /**
   *
   * @param {{ isChecked: boolean = false, isDisabled: boolean = false, text?: string }} options
   */
  constructor(options) {
    super(options);
    this.setTagName('label');
    this.addClassname('checkbox-container');
  }

  toHTML() {
    const text = typeof this.options === 'object' ? this.options.text || '' : this.options || '';
    const html = `
      <input type="checkbox"
        ${this.options?.isChecked ? ' checked="checked" ' : ''}
        ${this.options?.isDisabled ? ' disabled ' : ''} />
      <span>${text}</span>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Checkbox };
