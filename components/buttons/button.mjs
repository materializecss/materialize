import { Component } from '../component.mjs';

class Card extends Component {
  constructor(options) {
    super(options);
    this.addClassname('card');
  }
}

class Button extends Component {
  constructor(options) {
    super(options);
    this.setTagName('button');
    this.addClassname('btn');
  }
}

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

export { Component, Card, Button, Text, Number };
