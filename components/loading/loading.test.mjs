import { describe, expect, test } from 'vitest';
import { LoadingIndicator } from './loading.mjs';

describe('loading', () => {
  test('create html', () => {
    const loading = new LoadingIndicator();
    //console.log(list.toHTML());
    expect(loading.toHTML()).toContain('circle');
  });
});
