import { Component } from '../atomic/component.mjs';

class Dialog extends Component {
  /**
   *
   * @param {{ content?: string, header?: string, footer?: string }} options
   */
  constructor(options) {
    super(options);
    this.setTagName('dialog');
    this.addClassname('dialog');
  }

  toHTML() {
    let html = '';
    html += `<div class="dialog-header">${this.options?.header || ''}</div>
    <div class="dialog-content">${this.options?.content || ''}</div>
    <div class="dialog-footer">${this.options?.footer || ''}</div>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { Dialog };
