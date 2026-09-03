import { Button } from '../../button';
import Layout from '../Layout';
import type { LayoutProps } from '../types';

export interface TestLayoutWithFooterProps extends Omit<LayoutProps, 'footer'> {
  footerText?: string;
}

export const TestLayoutWithFooter = ({
  footerText = 'Test Button',
  ...layoutProps
}: TestLayoutWithFooterProps) => (
  <Layout
    {...layoutProps}
    footer={
      <Button variant="primary" onclick={() => {}}>
        {footerText}
      </Button>
    }
  />
);

export default TestLayoutWithFooter;
