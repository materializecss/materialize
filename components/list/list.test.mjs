import { describe, expect, test } from 'vitest';
import { List, ListItem } from './list.mjs';

describe('list', () => {
  const testData = ['HP Pavilion dv6-6013cl', 'Dell XPS 15 (Sandy Bridge)', 'Lenovo ThinkPad X220'];

  test('create html', () => {
    const list = new List();
    testData.map((raw) => {
      const item = new ListItem().setText(raw);
      list.addItem(item);
    });
    //console.log(list.toHTML());
    expect(list.toHTML()).toContain('Pavilion');
  });
});
