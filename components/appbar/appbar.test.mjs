import { describe, expect, test } from 'vitest';
import { AppBar } from './appbar.mjs';

describe('appBar', () => {
  test('create html', () => {
    const appBar = new AppBar();
    expect(appBar.toHTML()).toContain('<nav');
  });
});
