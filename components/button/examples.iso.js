import { Number, Text } from '../atomic/atomic.mjs';
import { Card } from '../card/card.mjs';
import { Button } from './button.mjs';

// Example App (isomorphic javascript)

function createCounterApp() {
  return new Card({
    children: [
      new Text('Counter Example').setTagName('div'),
      new Number(9),
      new Button('➕'),
      new Button('➖')
    ]
  }).addClassname('p-3');
}

export { createCounterApp };
