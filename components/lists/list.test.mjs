import { List, ListItem } from './list.mjs';

const data = ['HP Pavilion dv6-6013cl', 'Dell XPS 15 (Sandy Bridge)', 'Lenovo ThinkPad X220'];

const list = new List();
data.map((raw) => {
  const item = new ListItem().setText(raw);
  list.addItem(item);
});

console.log(list.toHTML());
