import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../icons', () => ({
  BodyIcon: () => <svg data-testid="body-icon" />,
  DivBlock: () => <svg data-testid="div-block-icon" />,
  SelectIcon: () => <svg data-testid="select-icon" />,
}));

import { SelectBodyOrDivBlock } from './SelectBodyOrDivBlock';

describe('SelectBodyOrDivBlock', () => {
  it('renders the select message with its icons', () => {
    const { container } = render(<SelectBodyOrDivBlock />);

    expect(container.querySelector('.select-msg-wrap')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Body or')).toBeInTheDocument();
    expect(screen.getByText('Div Block')).toBeInTheDocument();
    expect(screen.getByTestId('select-icon')).toBeInTheDocument();
    expect(screen.getByTestId('body-icon')).toBeInTheDocument();
    expect(screen.getByTestId('div-block-icon')).toBeInTheDocument();
  });
});
