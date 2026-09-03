import type { Meta, StoryObj } from '@storybook/react-vite';

import { Iframe } from './Iframe';

const meta = {
  title: 'Ui/Iframe',
  component: Iframe,
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'The URL to load in the iframe',
    },
    title: {
      control: 'text',
      description: 'Accessible title for the iframe content',
    },
    width: {
      control: 'text',
      description: 'Width of the iframe',
    },
    height: {
      control: 'text',
      description: 'Height of the iframe',
    },
    useProxy: {
      control: 'boolean',
      description: 'Whether to use the Finsweet reverse proxy for CORS',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class name',
    },
    id: {
      control: 'text',
      description: 'HTML id attribute',
    },
    onLoadSuccess: {
      action: 'loadSuccess',
      description: 'Called when iframe loads successfully',
    },
    onLoadError: {
      action: 'loadError',
      description: 'Called when iframe fails to load',
    },
  },
} satisfies Meta<typeof Iframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: 'https://example.com',
    title: 'Example Website',
    width: '100%',
    height: '400px',
  },
};

export const WithProxy: Story = {
  name: 'With Proxy',
  args: {
    url: 'https://httpbin.org/html',
    title: 'HTTPBin HTML Page',
    width: '100%',
    height: '400px',
    useProxy: true,
  },
};

export const WithoutProxy: Story = {
  name: 'Without Proxy',
  args: {
    url: 'https://example.com',
    title: 'Direct URL Load',
    width: '100%',
    height: '400px',
    useProxy: false,
  },
};

export const CustomDimensions: Story = {
  name: 'Custom Dimensions',
  args: {
    url: 'https://httpbin.org/html',
    title: 'Custom Size Iframe',
    width: '800px',
    height: '600px',
  },
};

export const SmallIframe: Story = {
  name: 'Small Iframe',
  args: {
    url: 'https://httpbin.org/html',
    title: 'Small Iframe',
    width: '400px',
    height: '300px',
  },
};

export const WithCustomClass: Story = {
  name: 'With Custom Class',
  args: {
    url: 'https://httpbin.org/html',
    title: 'Styled Iframe',
    width: '100%',
    height: '400px',
    className: 'custom-styled-iframe',
  },
};

export const ResponsiveIframe: Story = {
  name: 'Responsive Iframe',
  args: {
    url: 'https://httpbin.org/html',
    title: 'Responsive Iframe',
    width: '100%',
    height: '50vh',
  },
};
