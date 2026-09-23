import { Component } from '../atomic/component.mjs';

class RadioButton extends Component {
  /**
   *
   * @param {{ group?: string, text?: string, value?: string }} options
   */
  constructor(options) {
    super(options);
    this.addClassname('div');
  }

  toHTML() {
    const group = this.options?.group || '';
    const value = this.options?.value || '';
    const text = this.options?.text || '';
    const html = `<label>
      <input class="with-gap" name="${group}" value="${value}" type="radio" tabindex="0" />
      <span>${text}</span>
    </label>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { RadioButton };
