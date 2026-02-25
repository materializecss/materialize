import { Component } from '../component.mjs';

class Chip extends Component {
  #id;
  #text;
  #image;

  constructor(options) {
    super(options);
    this.addClassname('chip');
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

export { Chip };
