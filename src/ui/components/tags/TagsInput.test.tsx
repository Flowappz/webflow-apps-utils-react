import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { vi } from 'vitest';

import { TagsInput } from './TagsInput';

vi.mock('../tooltip', () => ({
  Tooltip: ({ target, message }: { target?: React.ReactNode; message?: string }) => (
    <div data-testid="tooltip-mock" data-message={message}>
      {target}
    </div>
  ),
}));

const getInput = () => screen.getByLabelText('Add new tag') as HTMLInputElement;

describe('TagsInput', () => {
  it('renders initial tags', () => {
    render(<TagsInput value={['JavaScript', 'TypeScript']} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('adds a tag on Enter', async () => {
    const user = userEvent.setup();
    const onTagAdd = vi.fn();
    const onValueChange = vi.fn();
    render(<TagsInput onTagAdd={onTagAdd} onValueChange={onValueChange} />);

    await user.type(getInput(), 'react{Enter}');

    expect(screen.getByText('react')).toBeInTheDocument();
    expect(onTagAdd).toHaveBeenCalledWith('react');
    expect(onValueChange).toHaveBeenCalledWith(['react']);
    expect(getInput().value).toBe('');
  });

  it('adds tags when a comma separator is typed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TagsInput onValueChange={onValueChange} />);

    await user.type(getInput(), 'one,two,');

    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two']);
  });

  it('removes a tag via its remove button', async () => {
    const user = userEvent.setup();
    const onTagRemove = vi.fn();
    const onValueChange = vi.fn();
    render(
      <TagsInput value={['alpha', 'beta']} onTagRemove={onTagRemove} onValueChange={onValueChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Remove tag alpha' }));

    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
    expect(onTagRemove).toHaveBeenCalledWith('alpha', 0);
    expect(onValueChange).toHaveBeenCalledWith(['beta']);
  });

  it('removes the last tag with Backspace when input is empty', async () => {
    const user = userEvent.setup();
    const onTagRemove = vi.fn();
    render(<TagsInput value={['first', 'last']} onTagRemove={onTagRemove} />);

    await user.click(getInput());
    await user.keyboard('{Backspace}');

    expect(onTagRemove).toHaveBeenCalledWith('last', 1);
    expect(screen.queryByText('last')).not.toBeInTheDocument();
  });

  it('rejects duplicate tags by default', async () => {
    const user = userEvent.setup();
    const onInvalidTag = vi.fn();
    render(<TagsInput value={['unique']} onInvalidTag={onInvalidTag} />);

    await user.type(getInput(), 'unique{Enter}');

    expect(onInvalidTag).toHaveBeenCalledWith('unique', 'Duplicate tag');
    expect(screen.getAllByText('unique')).toHaveLength(1);
  });

  it('allows duplicates when allowDuplicates is true', async () => {
    const user = userEvent.setup();
    render(<TagsInput value={['dup']} allowDuplicates />);

    await user.type(getInput(), 'dup{Enter}');

    expect(screen.getAllByText('dup')).toHaveLength(2);
  });

  it('enforces maxTagLength', async () => {
    const user = userEvent.setup();
    const onInvalidTag = vi.fn();
    render(<TagsInput maxTagLength={3} onInvalidTag={onInvalidTag} />);

    await user.type(getInput(), 'toolong{Enter}');

    expect(onInvalidTag).toHaveBeenCalledWith('toolong', 'Tag exceeds maximum length of 3');
  });

  it('disables the input when maxTags is reached', () => {
    render(<TagsInput value={['a', 'b']} maxTags={2} />);
    expect(getInput()).toBeDisabled();
  });

  it('runs custom validateTag and reports the reason', async () => {
    const user = userEvent.setup();
    const onInvalidTag = vi.fn();
    render(
      <TagsInput
        validateTag={(tag) => (tag.startsWith('#') ? true : 'Tags must start with #')}
        onInvalidTag={onInvalidTag}
      />
    );

    await user.type(getInput(), 'nohash{Enter}');
    expect(onInvalidTag).toHaveBeenCalledWith('nohash', 'Tags must start with #');

    // invalid input is kept in the field (source behavior) — clear before retrying
    await user.clear(getInput());
    await user.type(getInput(), '#ok{Enter}');
    expect(screen.getByText('#ok')).toBeInTheDocument();
  });

  it('adds pending input as a tag on blur', async () => {
    const user = userEvent.setup();
    render(<TagsInput />);

    await user.type(getInput(), 'pending');
    await user.tab();

    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('does not render the input when readonly', () => {
    render(<TagsInput value={['ro']} readonly />);
    expect(screen.queryByLabelText('Add new tag')).not.toBeInTheDocument();
    // no remove buttons either
    expect(screen.queryByRole('button', { name: /Remove tag/ })).not.toBeInTheDocument();
  });

  it('applies state classes to the wrapper', () => {
    const { container } = render(
      <TagsInput value={['x']} invalid loading className="extra" showRemoveIcon />
    );
    const wrapper = container.querySelector('.tags-input-wrapper') as HTMLElement;
    expect(wrapper).toHaveClass('invalid', 'loading', 'disabled', 'show-remove-icon', 'extra');
  });

  it('flags invalid when below minTags', () => {
    const { container } = render(<TagsInput value={['only']} minTags={2} />);
    expect(container.querySelector('.tags-input-wrapper')).toHaveClass('invalid');
  });

  it('extracts src urls from pasted HTML when parseSrcFromHtmlPaste is on', () => {
    const onValueChange = vi.fn();
    render(<TagsInput parseSrcFromHtmlPaste onValueChange={onValueChange} />);

    fireEvent.paste(getInput(), {
      clipboardData: {
        getData: (type: string) =>
          type === 'text/html'
            ? '<script src="https://cdn.example.com/lib.js"></script><img src="javascript:alert(1)"/><iframe src="/embed/1"></iframe>'
            : '',
      },
    });

    expect(screen.getByText('https://cdn.example.com/lib.js')).toBeInTheDocument();
    expect(screen.getByText('/embed/1')).toBeInTheDocument();
    expect(screen.queryByText('javascript:alert(1)')).not.toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith([
      'https://cdn.example.com/lib.js',
      '/embed/1',
    ]);
  });

  it('falls back to onpaste when no urls are found', () => {
    const onpaste = vi.fn();
    render(<TagsInput parseSrcFromHtmlPaste onpaste={onpaste} />);

    fireEvent.paste(getInput(), {
      clipboardData: { getData: () => 'plain text with no markup' },
    });

    expect(onpaste).toHaveBeenCalledTimes(1);
  });

  it('expands and collapses tags when expandOnClick is enabled', async () => {
    const user = userEvent.setup();
    render(<TagsInput value={['expandable-tag']} expandOnClick />);

    const tag = screen.getByText('expandable-tag').closest('.tag') as HTMLElement;
    expect(tag).toHaveClass('expandable');
    expect(tag).not.toHaveClass('expanded');

    await user.click(tag);
    expect(tag).toHaveClass('expanded');

    await user.click(tag);
    expect(tag).not.toHaveClass('expanded');
  });

  it('shows alert message through the tooltip', () => {
    render(<TagsInput alert={{ type: 'error', message: 'Please add at least 3 tags' }} />);
    expect(screen.getByTestId('tooltip-mock')).toHaveAttribute(
      'data-message',
      'Please add at least 3 tags'
    );
  });
});
