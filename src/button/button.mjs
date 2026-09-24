import { Component } from '../atomic/component.mjs';

class Button extends Component {
  constructor(options) {
    super(options);
    this.setTagName('button');
    this.addClassname('btn');
  }
}

export { Button };
