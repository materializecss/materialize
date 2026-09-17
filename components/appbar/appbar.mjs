import { Component } from '../atomic/component.mjs';

// AppBar is the old "Navbar"

class AppBar extends Component {
  #title;
  #items;

  /**
   *
   * @param {{isFixed: Boolean = false, hasContainer: Boolean = true, content: any}} options
   */
  constructor(options) {
    super(options);
    this.#title = '';
    this.#items = [];
    this.addClassname('appbar');
    if (typeof options === 'object' && options.isFixed) {
      this.addClassname('navbar-fixed');
    }
  }

  addItem(item) {
    this.#items.push(item);
    return this;
  }

  //////////////////////// unstable api atm

  setTitle(title) {
    this.#title = title;
    return this;
  }
  setSearch() {
    return this;
  }
  setLogo() {
    return this;
  }
  addLeftIcon() {
    return this;
  }
  addRightIcon() {
    return this;
  }

  //

  toHTML() {
    const html = `<nav class="nav navbar ${this.options.hasContainer ? 'container' : ''}">
      <div class="nav-wrapper">
        ${this.#title}
        <ul class="hide-on-med-and-down">
          ${this.#items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        ${this.options.content || ''}
      </div>
    </nav>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { AppBar };
