import type { Meta, StoryObj } from '@storybook/html';

export default {
  title: 'Components/Checkbox'
} satisfies Meta;

export const Default: StoryObj = {
  render() {
    return `
<form action="#">
  <p>
    <label>
      <input type="checkbox" />
      <span>Unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" />
      <span>Checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" disabled="disabled" />
      <span>Disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" disabled="disabled" />
      <span>Checked & Disabled</span>
    </label>
  </p>
</form>
    `;
  }
};

export const FilledIn: StoryObj = {
  render() {
    return `
<form action="#">
  <p>
    <label>
      <input type="checkbox" class="filled-in"/>
      <span>Filled in unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked"/>
      <span>Filled in checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" disabled="disabled"/>
      <span>Filled in disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked" disabled="disabled"/>
      <span>Filled in checked & disabled</span>
    </label>
  </p>
</form>
    `;
  }
};

export const Indeterminate: StoryObj = {
  render() {
    return `
<form action="#">
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" />
      <span>Indeterminate Style</span>
    </label>
  </p>
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" disabled="disabled"/>
      <span>Indeterminate Disabled</span>
    </label>
  </p>
</form>

<script>
  // Set the indeterminate property on the checkbox elements
  const elements = document.querySelectorAll('.indeterminate-checkbox');
  elements.forEach((element) => {
    element.indeterminate = true;
  });
</script>
    `;
  }
};
