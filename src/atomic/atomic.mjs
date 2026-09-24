import { Component } from './component.mjs';

class Text extends Component {
  constructor(options) {
    super(options);
    this.setTagName('span');
    this.addClassname('mw-text');
  }
}

class Number extends Component {
  constructor(options) {
    super(options);
    this.setTagName('span');
    this.addClassname('mw-number');
  }
}

export { Text, Number };
