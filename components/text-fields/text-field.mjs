import { Component } from '../component.mjs';

/*
<fieldset class="form-field animated s12 m4">
  <legend>Given Name</legend>
  <input type="text" id="my-input-1" placeholder="Given Name">
  <label for="my-input-1">Given Name</label>
</fieldset>
*/

class TextField extends Component {
  #labelText;
  #isReadOnly = false;
  #isRequired = false;

  constructor(options) {
    super(options);
    this.setTagName('fieldset');
    this.addClassname('form-field animated');
  }

  setLabel(label) {
    this.#labelText = label;
    return this;
  }

  toHTML() {
    const elemId = 'elem-' + 100000 * Math.random();
    const html = `<legend>${this.#labelText}</legend>
      <input type="text" id="${elemId}" name="" placeholder="${this.#labelText}"/>
      <label for="${elemId}">${this.#labelText}</label>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { TextField };
