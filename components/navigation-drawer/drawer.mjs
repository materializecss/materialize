import { Component } from '../atomic/component.mjs';

// Drawer = old Sidenav

class Drawer extends Component {
  #items;

  constructor(options) {
    super(options);
    this.#items = [];
    this.setTagName('ul').addClassname('sidenav');
    this.setAttribute('id', 'slide-out');
  }

  addItem(item) {
    this.#items = item;
    return this;
  }

  toHTML() {
    const html = `<li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
      <li><a href="#!">Second Link</a></li>
      <li><div class="divider"></div></li>
      <li><a class="subheader">Subheader</a></li>
      <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>`;
    // <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Drawer };
