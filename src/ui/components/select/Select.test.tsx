import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { vi } from 'vitest';

import { Select } from './Select';
import type { SelectOption } from './types';

vi.mock('../tooltip', () => ({
  Tooltip: ({ target, message }: { target?: React.ReactNode; message?: string }) => (
    <div data-testid="tooltip-mock" data-message={message}>
      {target}
    </div>
  ),
}));

vi.mock('../text', () => ({
  Text: ({ label, className }: { label?: string; className?: string }) => (
    <span className={className}>{label}</span>
  ),
}));

// floating-ui's autoUpdate relies on observers jsdom doesn't implement
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ObserverStub);
  vi.stubGlobal('IntersectionObserver', ObserverStub);
});

const basicOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

// The toggle is the div with class "dropdown" (role="button"); queried via class
// because stories/footers can add extra native buttons.
const getToggle = () => document.querySelector('.dropdown') as HTMLElement;
// Queried via class: role queries exclude the list once it is aria-hidden.
const getList = () => document.querySelector('.dropdown-list') as HTMLElement;
const getItem = (value: string) =>
  document.querySelector(`.dropdown-item[data-value="${value}"]`) as HTMLButtonElement;

describe('Select', () => {
  it('renders the default text when nothing is selected', () => {
    render(<Select options={basicOptions} defaultText="Select an option" />);
    expect(getToggle().querySelector('.dropdown-header .label')).toHaveTextContent(
      'Select an option'
    );
  });

  it('opens the dropdown on click and fires onOpen', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<Select options={basicOptions} onOpen={onOpen} />);

    await user.click(getToggle());

    const list = getList();
    expect(list.style.display).toBe('flex');
    expect(list).toHaveAttribute('aria-hidden', 'false');
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('selects an option, updates the label and fires callbacks', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    const onSelectedChange = vi.fn();
    render(
      <Select options={basicOptions} onchange={onchange} onSelectedChange={onSelectedChange} />
    );

    await user.click(getToggle());
    await user.click(getItem('option2'));

    expect(onchange).toHaveBeenCalledWith({ value: 'option2' });
    expect(onSelectedChange).toHaveBeenCalledWith('option2');
    expect(getToggle().querySelector('.dropdown-header .label')).toHaveTextContent('Option 2');
    // dropdown closed after selection
    expect(getList().style.display).toBe('none');
  });

  it('deselects when clicking the selected option again', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(
      <Select options={basicOptions} selected="option1" defaultText="Pick" onchange={onchange} />
    );

    await user.click(getToggle());
    await user.click(getItem('option1'));

    expect(onchange).toHaveBeenCalledWith({ value: null });
    expect(getToggle().querySelector('.dropdown-header .label')).toHaveTextContent('Pick');
  });

  it('keeps the selection when preventNoSelection is true', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(
      <Select options={basicOptions} selected="option1" preventNoSelection onchange={onchange} />
    );

    await user.click(getToggle());
    await user.click(getItem('option1'));

    expect(onchange).toHaveBeenCalledWith({ value: 'option1' });
  });

  it('marks the selected option with aria-selected and a check icon', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} selected="option3" />);

    await user.click(getToggle());

    expect(getItem('option3')).toHaveAttribute('aria-selected', 'true');
    expect(getItem('option1')).toHaveAttribute('aria-selected', 'false');
    expect(getItem('option3').querySelector('.icon svg')).toBeInTheDocument();
    expect(getItem('option1').querySelector('.icon svg')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation and selection with Enter', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(<Select options={basicOptions} onchange={onchange} />);

    await user.click(getToggle());
    const list = getList();

    // opening focused the first item, so ArrowDown moves to the second one
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(getItem('option2')).toHaveClass('hover-state');

    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(getItem('option1')).toHaveClass('hover-state');

    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: 'Enter' });

    expect(onchange).toHaveBeenCalledWith({ value: 'option2' });
    expect(list.style.display).toBe('none');
  });

  it('closes on Escape by default', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} />);

    await user.click(getToggle());
    expect(getList().style.display).toBe('flex');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getList().style.display).toBe('none');
  });

  it('stays open on Escape when closeOnEscape is false', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} closeOnEscape={false} />);

    await user.click(getToggle());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(getList().style.display).toBe('flex');
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} />);

    await user.click(getToggle());
    expect(getList().style.display).toBe('flex');

    fireEvent.click(document.body);
    expect(getList().style.display).toBe('none');
  });

  it('stays open on outside clicks when closeOnClickOutside is false', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} closeOnClickOutside={false} />);

    await user.click(getToggle());
    fireEvent.click(document.body);
    expect(getList().style.display).toBe('flex');
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} disabled />);

    const toggle = getToggle();
    expect(toggle).toHaveAttribute('aria-disabled', 'true');
    expect(toggle).toHaveClass('disabled');

    await user.click(toggle);
    expect(getList().style.display).not.toBe('flex');
  });

  it('filters options through the search input', async () => {
    const user = userEvent.setup();
    render(<Select options={basicOptions} enableSearch />);

    await user.click(getToggle());
    const search = screen.getByPlaceholderText('Search');
    await user.type(search, 'Option 2');

    await waitFor(() => {
      expect(document.querySelectorAll('.dropdown-item')).toHaveLength(1);
    });
    expect(getItem('option2')).toBeInTheDocument();
  });

  it('blocks selection and shows overlay message when itemsDisabled', async () => {
    const user = userEvent.setup();
    const onchange = vi.fn();
    render(
      <Select
        options={basicOptions}
        itemsDisabled
        itemsDisabledMessage="Refreshing items..."
        onchange={onchange}
      />
    );

    await user.click(getToggle());
    expect(screen.getByRole('status')).toHaveTextContent('Refreshing items...');

    const item = getItem('option1');
    expect(item).toHaveClass('disabled', 'items-disabled');
    await user.click(item);
    expect(onchange).not.toHaveBeenCalled();
  });

  it('renders a footer with a working close function', async () => {
    const user = userEvent.setup();
    render(
      <Select
        options={basicOptions}
        footer={({ close }) => (
          <button type="button" data-testid="footer-action" onClick={close}>
            + Add manually
          </button>
        )}
      />
    );

    expect(getList()).toHaveClass('has-footer');

    await user.click(getToggle());
    expect(getList().style.display).toBe('flex');

    await user.click(screen.getByTestId('footer-action'));
    expect(getList().style.display).toBe('none');
  });

  it('passes the alert message to the tooltip', () => {
    render(
      <Select options={basicOptions} alert={{ type: 'error', message: 'Field is required' }} />
    );
    expect(screen.getByTestId('tooltip-mock')).toHaveAttribute(
      'data-message',
      'Field is required'
    );
  });

  it('hides the wrapper when hide is true', () => {
    render(<Select options={basicOptions} hide />);
    const wrapper = document.querySelector('.dropdown-wrapper') as HTMLElement;
    expect(wrapper.style.display).toBe('none');
  });
});
