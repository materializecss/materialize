import { Component } from '../atomic/component.mjs';

class Chip extends Component {
  #id;
  #text;
  #image;

  constructor(options) {
    super(options);
    this.addClassname('chip');
    this.setAttribute('tabindex', '0');
    if (options.name) this.#text = options.name;
    if (options.href) {
      this.setTagName('a');
      this.setAttribute('href', options.href);
    }
  }

  setId(id) {
    this.#id = id;
    return this;
  }

  setText(text) {
    this.#text = text;
    return this;
  }

  setImage(image) {
    this.#image = image;
    return this;
  }

  toHTML() {
    let html = '';
    if (this.#image) html += `<img src="${this.#image}" alt=""/>`;
    html += this.#text;
    this.setChildren(html);
    return super.toHTML();
  }
}

class AssistChip extends Chip {
  constructor(options) {
    super(options);
    this.addClassname('assist-chip'); // TODO: remove classname chip
  }
}

export { Chip, AssistChip };
