import type { Preview } from '@storybook/html'
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import './material-icons.css';
import '../sass/materialize.scss';

const preview: Preview = {
  decorators: [
    // Decorator to be able to switch between light and dark themes
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'theme',
    }),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
