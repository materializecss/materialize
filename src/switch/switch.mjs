import { Component } from '../atomic/component.mjs';

class Switch extends Component {
  constructor(options) {
    super(options);
    this.addClassname('switch');
  }

  toHTML() {
    const html = `<label>
      <input type="checkbox" tabindex="0"/>
      <span class="lever"></span>
    </label>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Switch };
