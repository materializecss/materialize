import { Page } from '../../src/atomic/page.mjs';
import { Component } from '../../src/atomic/component.mjs';
import { Grid } from '../../src/grid/grid.mjs';
import { Button } from '../../src/button/button.mjs';
import { TextField } from '../../src/textfield/textfield.mjs';
import { Dialog } from '../../src/dialog/dialog.mjs';
import { Divider } from '../../src/divider/divider.mjs';
import { RadioButton } from '../../src/radiobutton/radiobutton.mjs';
import { Switch } from '../../src/switch/switch.mjs';
import { AssistChip } from '../../src/chip/chip.mjs';
import { Breadcrumb } from '../../src/breadcrumb/breadcrumb.mjs';

// Dynamic Content Generation on Serverside

const formTestPage = new Page({
  title: 'Test: Forms | MaterializeWeb',
  children: [
    new Component({
      children: [
        new Component('Modals').addClassname('my-3'),
        // new Dialog({ header: 'Question of the day', content: 'Wazz up?' }),
        new Dialog({
          header: 'How old are you?',
          content:
            new Component('Please enter your age:').addClassname('my-3').toHTML() +
            new TextField().setLabel('Age').toHTML(),
          footer: new Button('Confirm').addClassname('text').toHTML()
        }),
        new Button('Show').addClassname('tonal').addClassname('btn-modal-1'),

        new Divider().addClassname('my-3'), //----------------------
        new Component('Buttons').addClassname('my-3'),
        new Grid({
          children: [
            ...Array.from({ length: 6 }, (_, i) => new Button('Default-' + (i + 1)).toHTML()),
            ...Array.from({ length: 6 }, (_, i) =>
              new Button('Tonal-' + (i + 1)).addClassname('tonal').toHTML()
            ),
            ...Array.from({ length: 6 }, (_, i) =>
              new Button('Outl-' + (i + 1)).addClassname('outlined').toHTML()
            ),
            ...Array.from({ length: 6 }, (_, i) =>
              new Button('Text-' + (i + 1)).addClassname('text').toHTML()
            )
          ]
        })
          .setColumns(6)
          .addClassname('g-1')
          .addClassname('mb-3'),

        new Divider().addClassname('my-3'), //----------------------
        new Component('Chips : Assist (for States)').addClassname('my-3'),
        new AssistChip('Ready'),
        new AssistChip('Active').setAttribute('style', 'color: orange; outline-color: orange;'),
        new AssistChip('Completed').setAttribute('style', 'color: green; outline-color: green;'),
        new AssistChip('Failed').setAttribute('style', 'color: red; outline-color: red;'),

        new Divider().addClassname('my-3'), //----------------------
        new Component('Radio Buttons &amp; Switch').addClassname('my-3'),
        new RadioButton({ group: 'group1', text: 'Red' }), // todo: checked
        new RadioButton({ group: 'group1', text: 'Green' }),
        new RadioButton({ group: 'group1', text: 'Blue' }),
        new RadioButton({ group: 'group1', text: 'Brown' }), // todo: disabled
        new Switch(),

        new Divider().addClassname('my-3'), //----------------------
        new Component('Breadcrumbs').addClassname('my-3'),
        new Breadcrumb().setCrumbs(['Home', 'Chillaxing', 'Living Room']),

        new Divider().addClassname('my-3'), //----------------------
        new Component('Many inputs').addClassname('my-3'),
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
})
  .addStyleUrl('/dist/css/materialize.css')
  .addStyleUrl('/src/breadcrumb/breadcrumb.css') // client-side custom theming
  .addStyle(`:root {
    --mw-chip-height: 20px;
    --mw-input-height: 42px;
    --mw-padding-left: 4px;
    --mw-border-radius: 4px;
  }`) // client-side JS
  .addJavascript(`
document.querySelector('.btn-modal-1').addEventListener('click', () => {
  document.querySelector('dialog').showModal();
});
`);

const html = formTestPage.toHTML();
console.log(html);
