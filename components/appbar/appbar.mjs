import { Component } from '../atomic/component.mjs';

// AppBar is the old *Navbar*

class AppBar extends Component {
  #title = '';

  constructor(options) {
    super(options);
    this.setTagName('nav').addClassname('nav navbar');
  }

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

  toHTML() {
    const html = `<div class="nav-wrapper">
      <a href="#" class="brand-logo">${this.#title}</a>
      <ul class="right hide-on-med-and-down">
        <li><a href="sass.html"><i class="material-icons">search</i></a></li>
        <li><a href="badges.html"><i class="material-icons">view_module</i></a></li>
        <li><a href="collapsible.html"><i class="material-icons">refresh</i></a></li>
        <li><a href="mobile.html"><i class="material-icons">more_vert</i></a></li>
      </ul>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="sass.html">Sass</a></li>
        <li><a href="badges.html">Components</a></li>
        <li><a href="collapsible.html">JavaScript</a></li>
      </ul>
    </div>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { AppBar };
