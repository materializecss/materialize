import { Page } from '../../src/atomic/page.mjs';
import { Component } from '../../src/atomic/component.mjs';
import { Grid } from '../../src/grid/grid.js';
import { Button } from '../../src/button/button.mjs';
import { TextField } from '../../src/textfield/textfield.mjs';
//import { Button, TextField, Grid } from '../../src/index.mjs';

// Dynamic Content Generation on Serverside

const formTestPage = new Page({
  title: 'Test: Forms | MaterializeWeb',
  children: [
    new Component({
      children: [
        new Component('Some buttons').addClassname('mb-3'),
        new Grid({
          children: Array.from({ length: 6 }, (_, i) => {
            const x = new Button('Btn-' + (i + 1)).addClassname('outlined');
            return x.toHTML();
          })
        })
          .setColumns(6)
          .addClassname('g-1'),

        new Component('Many inputs').addClassname('mt-3'),
        new Grid({
          children: Array.from({ length: 33 }, (_, i) => {
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
  ]
}).addStyleUrl('/dist/css/materialize.css').addStyle(`:root {
    --mw-input-height: 42px;
    --mw-padding-left: 4px;
    --mw-border-radius: 4px;
  }`);

const html = formTestPage.toHTML();
console.log(html);
