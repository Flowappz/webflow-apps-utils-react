import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Cross-scope modules created by parallel agents — mocked here.
vi.mock('../../icons', () => ({
  CheckCircleOutlinedIcon: () => <svg data-testid="check-circle-icon" />,
  WarningCircleIcon: () => <svg data-testid="warning-circle-icon" />,
  WarningCircleOutlineIcon: () => <svg data-testid="warning-circle-outline-icon" />,
  Pencil: () => <svg data-testid="pencil-icon" />,
  WarningTriangleOutlineIcon: () => <svg data-testid="warning-triangle-icon" />,
}));

vi.mock('../section', () => ({
  Section: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="section">{children}</div>
  ),
}));

vi.mock('../tooltip', () => ({
  Tooltip: ({ target, message }: { target?: React.ReactNode; message?: string }) => (
    <span data-testid="tooltip" data-message={message}>
      {target}
    </span>
  ),
}));

vi.mock('../button', () => ({
  Button: ({
    children,
    text,
    onclick,
  }: {
    children?: React.ReactNode;
    text?: string;
    onclick?: () => void;
  }) => (
    <button type="button" onClick={onclick}>
      {text ?? children}
    </button>
  ),
}));

const appContextState: { data: Record<string, unknown> } = {
  data: { editMode: true, repairMode: false, title: 'Example' },
};

vi.mock('../../providers', () => ({
  useAppContext: () => ({
    get: () => appContextState.data,
    set: (value: Record<string, unknown>) => {
      appContextState.data = value;
    },
    subscribe: () => () => {},
  }),
}));

vi.mock('../notification', () => ({
  Notification: ({ title, message }: { title?: string; message?: string }) => (
    <div className="wrapper" data-testid="notification">
      <span>{title}</span>
      <span>{message}</span>
    </div>
  ),
}));

import { SettingsIcon } from './__test-icons';
import { Layout } from './Layout';
import { TestLayoutWithFooter } from './test-helpers/TestLayoutWithFooter';
import type { LayoutTab } from './types';

const tabs: LayoutTab[] = [
  { path: 'settings', name: 'Settings', icon: SettingsIcon, isActive: true },
  { path: 'code', name: 'Code', icon: SettingsIcon, isActive: false },
];

const baseProps = {
  activeTab: 'settings',
  tabs,
  switchTab: () => {},
  formKey: 'test-form',
};

describe('Layout', () => {
  it('renders tabs and switches tab on click', async () => {
    const switchTab = vi.fn();
    const user = userEvent.setup();
    render(<Layout {...baseProps} switchTab={switchTab} />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Settings').closest('button')).toHaveClass('isActive');

    await user.click(screen.getByText('Code'));
    expect(switchTab).toHaveBeenCalledWith('code');
  });

  it('renders placeholder content when no main/sidebar provided', () => {
    render(<Layout {...baseProps} />);

    expect(screen.getByText('Main Content Area')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    expect(screen.getByText('Preview: settings tab content')).toBeInTheDocument();
  });

  it('renders provided main, sidebar, previewBar and footer content', () => {
    render(
      <Layout
        {...baseProps}
        main={<p>Main slot</p>}
        sidebar={<p>Sidebar slot</p>}
        previewBar={<p>Preview slot</p>}
        footer={<p>Footer slot</p>}
      />
    );

    expect(screen.getByText('Main slot')).toBeInTheDocument();
    expect(screen.getByText('Sidebar slot')).toBeInTheDocument();
    expect(screen.getByText('Preview slot')).toBeInTheDocument();
    expect(screen.getByText('Footer slot')).toBeInTheDocument();
    expect(screen.queryByText('Main Content Area')).not.toBeInTheDocument();
  });

  it('hides sidebar, tabs and footer based on visibility flags', () => {
    const { container } = render(
      <Layout
        {...baseProps}
        showSidebar={false}
        showTabs={false}
        showFooter={false}
        footer={<p>Footer slot</p>}
      />
    );

    expect(container.querySelector('.sidebar')).not.toBeInTheDocument();
    expect(container.querySelector('.navbar')).not.toBeInTheDocument();
    expect(container.querySelector('.footer')).not.toBeInTheDocument();
  });

  it('sets grid template CSS variables and container mode dimensions', () => {
    const { container } = render(<Layout {...baseProps} containerMode footer={<p>f</p>} />);

    const grid = container.querySelector('.layout-grid') as HTMLElement;
    expect(grid.style.height).toBe('100%');
    expect(grid.style.width).toBe('100%');
    expect(grid.style.getPropertyValue('--grid-template-areas')).toBe(
      '"navbar preview-bar" "sidebar main" "sidebar footer"'
    );
    expect(grid.style.getPropertyValue('--grid-template-columns')).toBe('274px 1fr');
    expect(grid.style.getPropertyValue('--grid-template-rows')).toBe('40px 1fr 40px');
  });

  it('renders the edit mode message when enabled and context is in edit mode', () => {
    appContextState.data = { editMode: true, repairMode: false, title: 'Example' };
    render(<Layout {...baseProps} main={<p>Main slot</p>} showEditModeMessage />);

    expect(screen.getByTestId('notification')).toBeInTheDocument();
    expect(screen.getByText('You are in edit mode for Example Component.')).toBeInTheDocument();
  });

  it('does not render the edit mode message when disabled', () => {
    render(<Layout {...baseProps} main={<p>Main slot</p>} />);
    expect(screen.queryByTestId('notification')).not.toBeInTheDocument();
  });

  it('renders the repair mode message when the context is in repair mode', () => {
    appContextState.data = { editMode: false, repairMode: true, title: 'Example' };
    render(<Layout {...baseProps} main={<p>Main slot</p>} showEditModeMessage />);

    expect(screen.getByText('Component instance not found')).toBeInTheDocument();
  });

  it('shows tab notification pills for success and warning states', () => {
    render(
      <Layout
        {...baseProps}
        notifications={[
          { path: 'settings', success: true, message: 'Saved', showNotification: true },
          { path: 'code', success: false, message: 'Broken', showNotification: true },
        ]}
      />
    );

    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    expect(screen.getByTestId('warning-circle-outline-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toHaveAttribute('data-message', 'Broken');
    expect(screen.getByText('Settings').closest('button')).toHaveClass('success');
    expect(screen.getByText('Code').closest('button')).toHaveClass('warning');
  });

  it('wraps main content in a scrollable Section when mainContentScrollableAt is set', () => {
    render(<Layout {...baseProps} main={<p>Main slot</p>} mainContentScrollableAt={400} />);

    expect(screen.getByTestId('section')).toBeInTheDocument();
    expect(screen.getByText('Main slot')).toBeInTheDocument();
  });

  it('renders custom tabs instead of the default tab buttons', () => {
    render(<Layout {...baseProps} customTabs={<div>My custom tabs</div>} />);

    expect(screen.getByText('My custom tabs')).toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });
});

describe('TestLayoutWithFooter', () => {
  it('renders the layout with a footer button', () => {
    render(<TestLayoutWithFooter {...baseProps} footerText="Save it" />);
    expect(screen.getByText('Save it')).toBeInTheDocument();
  });
});
