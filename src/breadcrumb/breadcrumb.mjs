import { Component } from '../atomic/component.mjs';

class Breadcrumb extends Component {
  #parts;

  constructor(options) {
    super(options);
    this.#parts = [];
    this.setTagName('nav');
    this.addClassname('breadcrumb-wrapper');
    this.setAttribute('aria-label', 'Breadcrumb');
  }

  setCrumbs(parts) {
    this.#parts = parts;
    return this;
  }

  toHTML() {
    const seperatorHtml = '<span class="mw-breadcrumb-separator" aria-hidden="true"></span>';

    const itemsHtml = this.#parts
      .map(
        (p) =>
          `<li class="mw-breadcrumb-item"><a class="mw-breadcrumb-link" tabindex="0" href="#${p}">${p}</a></li>`
      )
      .join(seperatorHtml);

    const html = `<ol class="mw-breadcrumb">${itemsHtml}</ol>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Breadcrumb };
