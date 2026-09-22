import { Page } from '../../src/atomic/page.mjs';
import { Grid } from '../../src/grid/grid.js';
import { Component } from '../../src/atomic/component.mjs';
import { Button } from '../../src/button/button.mjs';
import { TextField } from '../../src/textfield/textfield.mjs';

// Dynamic Content Generation on Serverside

const formTestPage = new Page({
  title: 'Test: Forms | MaterializeWeb',
  children: [
    new Component({
      children: [
        new Component('Many inputs test').addClassname('mb-3'),
        new Grid({
          children: Array.from({ length: 333 }, (_, i) => {
            //const x = new Component('cell_' + (i + 1));
            //const x = new Button(i + 1).addClassname('outlined');
            const x = new TextField().setLabel(i + 1);
            return x.toHTML();
          })
        })
          .setColumns(6)
          .addClassname('g-1')
      ]
    })
      .addClassname('p-2')
      .addClassname('container')
      .addClassname('my-5')
    // .setAttribute('style', 'border: 1px solid red;')
  ]
}).addStyleUrl('/dist/css/materialize.css').addStyle(`:root {
    --mw-input-height: 42px;
    --mw-padding-left: 4px;
    --mw-border-radius: 4px;
  }`);

const html = formTestPage.toHTML();
console.log(html);
