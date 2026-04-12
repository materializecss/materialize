import { Number, Text } from '../atomic/atomic.mjs';
import { Button, Card } from './button.mjs';

// Example App (isomorphic javascript)
const app = new Card({
  children: [
    new Text('Example App').setTagName('div'), //
    new Number(9),
    new Button('➕'),
    new Button('➖')
  ]
}).addClassname('p-3');

// Html
const html = app.toHTML();
console.log(html);
