import { Component } from '../atomic/component.mjs';

class Divider extends Component {
  constructor(options) {
    super(options);
    this.addClassname('divider');
  }
}

export { Divider };
