import { Component } from '../component.mjs';

class LoadingIndicator extends Component {
  constructor(options) {
    super(options);
    this.addClassname('preloader-wrapper active');
  }

  toHTML() {
    const html = `<div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>`;
    this.setChildren(html);
    return super.toHTML();
  }
}

export { LoadingIndicator };
