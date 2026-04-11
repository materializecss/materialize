import { Component } from '../atomic/component.mjs';

// AppBar is the old *Navbar*

/*
<nav class="nav navbar">
  <div class="nav-wrapper">
    <a href="#" class="brand-logo">Logo</a>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a href="sass.html">Sass</a></li>
      <li><a href="badges.html">Components</a></li>
      <li><a href="collapsible.html">JavaScript</a></li>
    </ul>
  </div>
</nav>
*/

class AppBar extends Component {
  constructor(options) {
    super(options);
    this.setTagName('nav').addClassname('nav navbar');
  }

  toHTML() {
    const html = `<div class="nav-wrapper">
      <a href="#" class="brand-logo">Logo</a>
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
