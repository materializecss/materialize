import type { Meta, StoryObj } from '@storybook/html';

export default {
  title: 'Components/Navigation-Bar'
} satisfies Meta;

export const RightAligned: StoryObj = {
  render() {
    return `
<nav class="nav navbar">
  <div class="nav-wrapper">
    <a href="#" class="brand-logo">Logo</a>
    <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li><a href="sass.html">Sass</a></li>
      <li><a href="badges.html">Components</a></li>
      <li><a href="collapsible.html">JavaScript</a></li>
    </ul>
  </div>
</nav>
    `;
  }
};

export const LeftAligned: StoryObj = {
  render() {
    return `
<nav class="nav navbar">
  <div class="nav-wrapper">
    <a href="#" class="brand-logo right">Logo</a>
    <ul id="nav-mobile" class="left hide-on-med-and-down">
      <li><a href="sass.html">Sass</a></li>
      <li><a href="badges.html">Components</a></li>
      <li><a href="collapsible.html">JavaScript</a></li>
    </ul>
  </div>
</nav>
    `;
  }
};
