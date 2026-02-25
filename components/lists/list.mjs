import { Component } from '../component.mjs';

class ListItem extends Component {
  #id;
  #text;
  #image;

  constructor(options) {
    super(options);
    this.addClassname('list-item');
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

class List extends Component {
  #items = [];

  constructor(options) {
    super(options);
    this.addClassname('list');
  }

  addItem(item) {
    if (!(item instanceof ListItem)) throw new Error('item has to be of type ListItem');
    this.#items.push(item);
    return this;
  }

  toHTML() {
    const html = this.#items.map((item) => item.toHTML()).join('');
    this.setChildren(html);
    return super.toHTML();
  }
}

export { ListItem, List };
