import type { Preview } from '@storybook/react-vite';

import '../src/ui/styles/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        webflow: { name: 'Webflow Designer', value: '#1e1e1e' },
        light: { name: 'Light', value: '#ffffff' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'webflow' },
  },
};

export default preview;
