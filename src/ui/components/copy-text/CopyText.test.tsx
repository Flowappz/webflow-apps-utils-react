import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { CopyText } from './CopyText';

const copyMock = vi.hoisted(() => vi.fn(() => true));

vi.mock('copy-text-to-clipboard', () => ({
  default: copyMock,
}));

describe('CopyText', () => {
  beforeEach(() => {
    copyMock.mockClear();
    copyMock.mockReturnValue(true);
  });

  it('renders the processed (trimmed) content', () => {
    render(<CopyText content="  hello    world  " />);
    expect(screen.getByRole('button')).toHaveTextContent('hello world');
  });

  it('renders a title above the copy area', () => {
    render(<CopyText content="npm install" title="Installation Command" />);
    expect(
      screen.getByRole('heading', { name: 'Installation Command' })
    ).toBeInTheDocument();
  });

  it('copies content to the clipboard on click', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const onNotify = vi.fn();
    render(<CopyText content="copy me" onCopy={onCopy} onNotify={onNotify} />);

    await user.click(screen.getByRole('button'));

    expect(copyMock).toHaveBeenCalledWith('copy me');
    expect(onCopy).toHaveBeenCalledWith('copy me');
    expect(onNotify).toHaveBeenCalledWith({
      type: 'Success',
      message: 'Copied to clipboard!',
    });
  });

  it('copies raw content with a prepended comment', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <CopyText content="<script></script>" raw comment="Add to your site" onCopy={onCopy} />
    );

    await user.click(screen.getByRole('button'));

    expect(copyMock).toHaveBeenCalledWith('<!-- Add to your site -->\n<script></script>');
  });

  it('supports keyboard activation with Enter', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<CopyText content="keyboard" onCopy={onCopy} />);

    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(copyMock).toHaveBeenCalledWith('keyboard');
    expect(onCopy).toHaveBeenCalled();
  });

  it('does not copy when disabled and reports an error', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    const onNotify = vi.fn();
    render(<CopyText content="secret" disabled onError={onError} onNotify={onNotify} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button--disabled');
    expect(button).toHaveAttribute('aria-label', 'Copy disabled');

    await user.click(button);

    expect(copyMock).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Copy is disabled');
    expect(onNotify).toHaveBeenCalledWith({ type: 'Error', message: 'Copy is disabled' });
  });

  it('reports an error when the copy fails', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    copyMock.mockReturnValue(false);
    render(<CopyText content="fails" onError={onError} />);

    await user.click(screen.getByRole('button'));

    expect(onError).toHaveBeenCalledWith('Failed to copy. Please try again.');
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<CopyText content="invisible" hidden />);
    expect(container).toBeEmptyDOMElement();
  });

  it('uses the custom tooltip as title attribute and aria-label', () => {
    render(<CopyText content="api-key" tooltip="Click to copy your API key" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Click to copy your API key');
    expect(button).toHaveAttribute('aria-label', 'Click to copy your API key');
  });

  it('renders custom header and footer content', () => {
    render(
      <CopyText
        content="body"
        header={<span>Custom header</span>}
        footer={<span>Custom footer</span>}
      />
    );
    expect(screen.getByText('Custom header')).toBeInTheDocument();
    expect(screen.getByText('Custom footer')).toBeInTheDocument();
  });
});
