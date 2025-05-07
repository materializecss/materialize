import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  "stories": [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  "addons": [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false, // 👈 disable the backgrounds addon to avoid confusing it with themes
      },
    },
    "@storybook/addon-interactions",
    "@storybook/addon-themes"
  ],
  "framework": {
    "name": "@storybook/html-vite",
    "options": {}
  }
};
export default config;
