import { Component } from './component.mjs';

class Page extends Component {
  #title;
  #metaDescription;
  #css;
  #cssUrls;
  #scripts;
  #scriptUrls;

  constructor(options) {
    super(options);
    this.setTagName('html');
    if (options.title) this.setTitle(options.title);
    this.#cssUrls = [];
    this.#scriptUrls = [];
    this.#css = [];
    this.#scripts = [];
  }

  addStyleUrl(url) {
    this.#cssUrls.push(url);
    return this;
  }
  addStyle(css) {
    this.#css.push(css);
    return this;
  }
  addJavascriptUrl(url) {
    this.#scriptUrls.push(url);
    return this;
  }
  addJavascript(script) {
    this.#scripts.push(script);
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
        ${this.#cssUrls
          .map(
            (url) =>
              `<link type="text/css" rel="stylesheet" href="${url}" media="screen,projection"/>`
          )
          .join('\n')}
        ${this.#css.map((s) => `<style>${s}</style>`).join('\n')}
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body>
        <main class="container">
          ${super.toHTML()}
        </main>
        ${this.#scriptUrls.map((url) => `<script src="${url}"></script>`).join('\n')}
        ${this.#scripts.map((s) => `<script>${s}</script>`).join('\n')}
      </body>`;
  }
}

class Container extends Component {}

export { Page, Container };
