import { Component } from '../atomic/component.mjs';

class Card extends Component {
  constructor(options) {
    super(options);
    this.addClassname('card');
  }
}

export { Card };
