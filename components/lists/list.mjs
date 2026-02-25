import { Component } from '../component.mjs';

class ListItem extends Component {
  constructor(options) {
    super(options);
    //this.setTagName('div');
    this.addClassname('list-item');
  }
}

export { ListItem };
