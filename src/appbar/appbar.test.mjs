import { describe, expect, it } from 'vitest';
import { AppBar } from './appbar.mjs';

describe('appBar', () => {
  it('should create the html', () => {
    const appBar = new AppBar();
    expect(appBar.toHTML()).toContain('<nav');
  });
});
