import { Component } from '../atomic/component.mjs';

class Grid extends Component {
  #numberOfRows;
  #numberOfColumns;
  #children;

  constructor(options) {
    const x = options.children;
    delete options.children;
    super(options);
    this.#children = x;
    this.setTagName('button');
    this.addClassname('btn');
  }

  setColumns(number) {
    this.#numberOfColumns = number;
    return this;
  }
  // setRows(number) {
  //   this.#numberOfRows = number;
  //   return this;
  // }

  toHTML() {
    const childs = this.#children;
    const rows = childs.map((c) => `<div class="s12 m6">${c}</div>`);
    return `<div class="row">${rows.join('')}</div>`;
  }
}

export { Grid };
