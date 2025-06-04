import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.mdx', '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    //👇 See the table below for the list of supported options
    defaultName: 'Documentation'
  }
};
export default config;
