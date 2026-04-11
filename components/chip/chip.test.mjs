import { describe, expect, test } from 'vitest';
import { Chip } from './chip.mjs';

describe('chip', () => {
  test('create html', () => {
    const chip = new Chip().setText('John Doe');
    //console.log(list.toHTML());
    expect(chip.toHTML()).toContain('John');
  });
});
