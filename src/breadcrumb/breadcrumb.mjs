import { Component } from '../atomic/component.mjs';

class Breadcrumb extends Component {
  #parts = [];

  constructor(options) {
    super(options);
    this.setTagName('nav');
    this.addClassname('breadcrumb-wrapper');
  }

  setCrumbs(parts) {
    this.#parts = parts;
    // todo: generate html
    return this;
  }

  toHTML() {
    let html = '';
    html = this.#parts
      .map((p, i) => `<a class="breadcrumb" tabindex="0" href="#${i}">${p}</a>`)
      .join('');
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Breadcrumb };
