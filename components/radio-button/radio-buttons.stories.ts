import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/RadioButtons'
} satisfies Meta;

export const Default: StoryObj = {
  render() {
    return `
<form action="#">
  <p>
    <label>
      <input name="group1" type="radio" checked />
      <span>Red</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" />
      <span>Yellow</span>
    </label>
  </p>
  <p>
    <label>
      <input class="with-gap" name="group1" type="radio"  />
      <span>Green</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" disabled="disabled" />
      <span>Brown</span>
    </label>
  </p>
</form>
    `;
  }
};

export const WithGap: StoryObj = {
  render() {
    return `
<p>
  <label>
    <input class="with-gap" name="group3" type="radio" checked />
    <span>Red</span>
  </label>
</p>
    `;
  }
};
