// function escapeHTML(str) {
//   return str
//     .replaceAll('&', '&amp;')
//     .replaceAll('<', '&lt;')
//     .replaceAll('>', '&gt;')
//     .replaceAll('"', '&quot;')
//     .replaceAll("'", '&#039;');
// }

class Component {
  #tagname;
  #children;
  #classnames;

  constructor(options) {
    this.#tagname = 'div';
    this.#children = [];
    this.#classnames = [];
    if (typeof options === 'object' && options.children) {
      // Tree Nodes
      options.children.forEach((c) => this.addChild(c));
      return;
    }
    // Text or numeric
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

  addClassname(name) {
    this.#classnames.push(name);
    return this;
  }

  toHTML() {
    const classAttr =
      this.#classnames.length === 0 ? '' : ' class="' + this.#classnames.join(' ') + '"';
    if (typeof this.#children === 'object')
      return `<${this.#tagname}${classAttr}>${this.#children.map((child) => child.toHTML()).join('')}</${this.#tagname}>`;
    // string or number
    return `<${this.#tagname}${classAttr}>${this.#children}</${this.#tagname}>`;
  }

  // TODO: remove here
  toDOM() {
    const template = document.createElement('template');
    template.innerHTML = this.toHTML();
    return template.content.firstElementChild;
  }
}

export { Component };
