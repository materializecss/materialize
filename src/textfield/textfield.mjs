import { Component } from '../atomic/component.mjs';

class TextField extends Component {
  #labelText;
  #isReadOnly;
  #isRequired;

  constructor(options) {
    super(options);
    this.#labelText = '';
    this.#isRequired = false;
    this.#isReadOnly = false;
    this.setTagName('fieldset');
    this.addClassname('form-field animated');
  }

  setLabel(label) {
    this.#labelText = label;
    return this;
  }

  toHTML() {
    const elemId = 'textfield-' + 100000 * Math.random();
    const hasLabel = this.#labelText !== '';
    const html = `${hasLabel ? `<legend>${this.#labelText}</legend>` : ''}
      <input type="text" id="${elemId}" name="" placeholder="${this.#labelText}"/>
      ${hasLabel ? `<label for="${elemId}">${this.#labelText}</label>` : ''}`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { TextField };
