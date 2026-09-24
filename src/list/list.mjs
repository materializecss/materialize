import { Component } from '../atomic/component.mjs';

class ListItem extends Component {
  #id;
  #text;
  #supportingText;
  #image;
  #trailingContent;
  #lines = 1; // Default to 1 line

  constructor(options) {
    super(options);
    this.addClassname('mw-list-item');
  }

  setId(id) {
    this.#id = id;
    return this;
  }

  setText(text) {
    this.#text = text;
    return this;
  }

  setSupportingText(text) {
    this.#supportingText = text;
    return this;
  }

  setImage(image) {
    this.#image = image;
    return this;
  }

  setTrailingContent(content) {
    this.#trailingContent = content;
    return this;
  }

  /**
   * Manually set line count (1, 2, or 3) or let it auto-calculate
   */
  setLines(lines) {
    if (![1, 2, 3].includes(lines)) {
      throw new Error('Lines must be 1, 2, or 3');
    }
    this.#lines = lines;
    return this;
  }

  /**
   * Helper to determine line variant if not explicitly set
   */
  #getLineClass() {
    if (this.#lines) {
      return `mw-list-item--${this.#lines}-line`;
    }

    // Auto-detection logic if lines property isn't explicitly set:
    if (this.#text && this.#supportingText) {
      // Check if supportingText contains line breaks or longer text
      return this.#supportingText.includes('\n') ? 'mw-list-item--3-line' : 'mw-list-item--2-line';
    }

    return 'mw-list-item--1-line';
  }

  toHTML() {
    // Add modifier class according to line height (e.g., mw-list-item--2-line)
    const lineClass = this.#getLineClass();
    this.addClassname(lineClass);

    let html = '';

    // Leading slot for media/avatar
    if (this.#image) {
      html += `<div class="mw-list-item__start"><img src="${this.#image}" class="mw-list-item__image" alt="" /></div>`;
    }

    // Body content slot (headline + supporting text)
    html += '<div class="mw-list-item__body">';
    if (this.#text) {
      html += `<span class="mw-list-item__headline">${this.#text}</span>`;
    }
    if (this.#supportingText) {
      html += `<span class="mw-list-item__supporting-text">${this.#supportingText}</span>`;
    }
    html += '</div>';

    // Trailing slot for metadata, icons, or actions
    if (this.#trailingContent) {
      html += `<div class="mw-list-item__end">${this.#trailingContent}</div>`;
    }

    this.setChildren(html);
    return super.toHTML();
  }
}

class List extends Component {
  #items = [];
  #lines;

  constructor(options) {
    super(options);
    this.addClassname('mw-list');
  }

  /**
   * Set line count across all current and future items
   */
  setLines(lines) {
    this.#lines = lines;
    this.#items.forEach((item) => item.setLines(lines));
    return this;
  }

  addItem(item) {
    if (!(item instanceof ListItem)) {
      throw new Error('item has to be of type ListItem');
    }
    // Apply list-level line count if it has been set
    if (this.#lines !== undefined) {
      item.setLines(this.#lines);
    }
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
