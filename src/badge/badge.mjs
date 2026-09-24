import { Component } from '../atomic/component.mjs';

class Badge extends Component {
  constructor(options) {
    super(options);
    //this.setTagName('button');
    this.addClassname('badge');
  }
}

export { Badge };
