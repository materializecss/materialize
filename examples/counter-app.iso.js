import { Number, Text } from '../components/atomic/atomic.mjs';
import { Card } from '../components/card/card.mjs';
import { Button } from '../components/button/button.mjs';

function createCounterApp() {
  return new Card({
    children: [
      new Text('My Counter').setTagName('div'),
      new Number(9),
      new Button('➕'),
      new Button('➖')
    ]
  }).addClassname('p-3');
}

//====== Client Side Logic

function count(input) {
  const value = input.value + input.increment;
  return { value };
}

function hydrate(domElement, initState = { value: 12 }) {
  const state = initState;

  const btns = domElement.querySelectorAll('.btn'); // input
  const numberEl = domElement.querySelector('.mw-number'); // output

  numberEl.innerHTML = state.value;

  btns[0].addEventListener('click', (e) => {
    state.value = count({ value: state.value, increment: 1 }).value;
    numberEl.innerHTML = state.value;
  });
  btns[1].addEventListener('click', (e) => {
    state.value = count({ value: state.value, increment: -1 }).value;
    numberEl.innerHTML = state.value;
  });
}

class CounterApp extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
  }

  connectedCallback() {
    // Da das Template via DSD geladen wurde, existiert shadowRoot bereits!
    if (this.shadowRoot) {
      this.btn = this.shadowRoot.querySelector('#btn');
      this.output = this.shadowRoot.querySelector('#output');

      // Event-Listener hinzufügen
      this.btn.addEventListener('click', () => this.increment());
    }
  }

  increment() {
    this.count++;
    this.output.textContent = this.count;
  }
}

export { createCounterApp, hydrate, CounterApp };
