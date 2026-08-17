import { Component } from '../atomic/component.mjs';

// AppBar is the old "Navbar"

class AppBar extends Component {
  #title;
  #items;

  /**
   *
   * @param {{isFixed: Boolean = false}} options
   */
  constructor(options) {
    super(options);
    this.#title = '';
    this.#items = [];
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
    /*
    <li><a href="sass.html"><i class="material-icons">search</i></a></li>
    <li><a href="badges.html"><i class="material-icons">view_module</i></a></li>
    <li><a href="collapsible.html"><i class="material-icons">refresh</i></a></li>
    <li><a href="mobile.html"><i class="material-icons">more_vert</i></a></li>
    */
    const html = `<nav class="nav navbar">
      <div class="nav-wrapper">
        ${this.#title}
        <ul class="right hide-on-med-and-down">
          ${this.#items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </nav>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { AppBar };
