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
    this.addClassname('row');
  }

  /**
   *
   * @param {number} number can be: 1, 2, 3, 4, 6 or 12
   * @returns
   */
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
    const mediumCols = this.#numberOfColumns;
    const classMed =
      mediumCols === 1
        ? 'm12'
        : mediumCols === 2
          ? 'm6'
          : mediumCols === 3
            ? 'm4'
            : mediumCols === 4
              ? 'm3'
              : mediumCols === 6
                ? 'm2'
                : mediumCols === 12
                  ? 'm1'
                  : '';
    const rows = childs.map((child) => `<div class="s12 ${classMed}">${child}</div>`);
    this.setChildren(rows.join(''));
    const wrapper = super.toHTML();
    return wrapper;
  }
}

export { Grid };
