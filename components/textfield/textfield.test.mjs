import { describe, expect, test } from 'vitest';
import { TextField } from './textfield.mjs';

describe('textfields', () => {
  test('create html', () => {
    const textfield = new TextField().setLabel('Name');
    //console.log(list.toHTML());
    expect(textfield.toHTML()).toContain('<input');
  });
});
