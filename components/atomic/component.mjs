class Component {
  #tagname;
  #children;
  #classNames;
  #attributes;

  constructor(options) {
    this.#tagname = 'div';
    this.#attributes = {};
    this.#children = [];
    this.#classNames = [];

    if (typeof options === 'object' && options !== null && options.children) {
      if (typeof options.children === 'string') {
        this.#children = options.children;
        return;
      }
      const kids = Array.isArray(options.children) ? options.children : [options.children];
      kids.forEach((c) => this.addChild(c));
      return;
    }
    this.#children = options;
  }

  setChildren(children) {
    this.#children = children;
    return this;
  }

  setTagName(tagname) {
    if (typeof tagname !== 'string') throw new Error('tagname needs to be string');
    this.#tagname = tagname;
    return this;
  }

  addChild(child) {
    if (!(child instanceof Component)) throw new Error('child is no valid component');
    this.#children.push(child);
    return this;
  }

  setAttribute(key, value) {
    this.#attributes[key] = value;
    return this;
  }

  addClassname(name) {
    this.#classNames.push(name);
    return this;
  }

  toHTML() {
    const classAttr =
      this.#classNames.length === 0 ? '' : ' class="' + this.#classNames.join(' ') + '"';

    const attrEntries = Object.entries(this.#attributes);
    const otherAttrs =
      attrEntries.length === 0
        ? ''
        : ' ' + attrEntries.map(([key, val]) => `${key}="${val}"`).join(' ');

    if (Array.isArray(this.#children)) {
      const innerHTML = this.#children.map((child) => child.toHTML()).join('');
      return `<${this.#tagname}${classAttr}${otherAttrs}>${innerHTML}</${this.#tagname}>`;
    }

    return `<${this.#tagname}${classAttr}${otherAttrs}>${this.#children ?? ''}</${this.#tagname}>`;
  }

  toDOM() {
    const template = document.createElement('template');
    template.innerHTML = this.toHTML();
    return template.content.firstElementChild;
  }
}

export { Component };
