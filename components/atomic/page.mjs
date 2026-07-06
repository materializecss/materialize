import { Component } from './component.mjs';

class Page extends Component {
  #title;
  #metaDescription;
  #styleList = [];

  constructor(options) {
    super(options);
    this.setTagName('html');
    if (options.title) this.setTitle(options.title);
  }

  addStyleUrl(url) {
    this.#styleList.push(url);
    return this;
  }
  addJavascriptUrl() {
    return this;
  }
  setTitle(title) {
    this.#title = title;
    return this;
  }
  setMetaDescription(descr) {
    this.#metaDescription = descr;
    return this;
  }
  // override
  toHTML() {
    return `<head>
        <title>${this.#title}</title>
        ${this.#styleList
          .map(
            (s) => `<link type="text/css" rel="stylesheet" href="${s}" media="screen,projection"/>`
          )
          .join('')}
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body>
        <main class="container">
          ${super.toHTML()}
        </main>
      </body>`;
  }
}

class Container extends Component {}

export { Page, Container };
