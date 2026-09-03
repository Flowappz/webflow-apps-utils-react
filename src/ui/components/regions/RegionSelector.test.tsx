import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Cross-scope components are created by parallel agents — provide light mocks.
vi.mock('../../icons', () => ({
  SubtractIcon: () => <svg data-testid="subtract-icon" />,
}));

vi.mock('../button', () => ({
  Button: ({
    text,
    onclick,
    className,
  }: {
    text?: string;
    onclick?: () => void;
    className?: string;
  }) => (
    <button type="button" className={className} onClick={onclick}>
      {text}
    </button>
  ),
}));

vi.mock('../checkbox', () => ({
  Checkbox: ({ checked, disabled }: { checked?: boolean; disabled?: boolean }) => (
    <span
      className="checkbox"
      data-testid="checkbox"
      data-checked={checked ? 'true' : 'false'}
      data-disabled={disabled ? 'true' : 'false'}
    />
  ),
}));

vi.mock('../tooltip', () => ({
  Tooltip: ({ target }: { target?: React.ReactNode }) => <span>{target}</span>,
}));

import { RegionSelector } from './RegionSelector';
import type { RegionGroup, UsedRegions } from './types';

const regionGroups: RegionGroup[] = [
  {
    key: 'global',
    name: 'Global',
    regions: [{ code: 'Global', name: 'Global' }],
    total: 1,
  },
  {
    key: 'europe',
    name: 'European Union',
    regions: [{ code: 'EU', name: 'European Union' }],
    total: 1,
  },
  {
    key: 'us',
    name: 'United States',
    regions: [
      { code: 'US-CA', name: 'California' },
      { code: 'US-FL', name: 'Florida' },
    ],
    total: 2,
  },
  {
    key: 'countries',
    name: 'Countries',
    regions: [
      { code: 'CA', name: 'Canada' },
      { code: 'MX', name: 'Mexico' },
    ],
    total: 2,
  },
];

const emptyUsedRegions: UsedRegions = {
  regions: new Set(),
  isGlobalUsed: false,
  isEUGroupUsed: false,
  byInstance: new Map(),
};

describe('RegionSelector', () => {
  it('renders the restructured main groups', () => {
    render(<RegionSelector regionGroups={regionGroups} usedRegions={emptyUsedRegions} />);

    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('European Union')).toBeInTheDocument();
    expect(screen.getByText('Select Countries')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search regions...')).toBeInTheDocument();
  });

  it('selects Global and calls onRegionsChange', async () => {
    const onRegionsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        onRegionsChange={onRegionsChange}
      />
    );

    await user.click(screen.getByText('Global'));

    expect(onRegionsChange).toHaveBeenLastCalledWith(['Global']);
  });

  it('selects individual regions after expanding Select Countries', async () => {
    const onRegionsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        onRegionsChange={onRegionsChange}
      />
    );

    // Expand the "Select Countries" main parent
    await user.click(screen.getByText('Select Countries'));
    expect(screen.getByText('Canada')).toBeInTheDocument();

    await user.click(screen.getByText('Canada'));
    expect(onRegionsChange).toHaveBeenLastCalledWith(['CA']);

    await user.click(screen.getByText('Mexico'));
    expect(onRegionsChange).toHaveBeenLastCalledWith(['CA', 'MX']);
  });

  it('selecting EU replaces individual selections', async () => {
    const onRegionsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        selectedRegions={['CA']}
        onRegionsChange={onRegionsChange}
      />
    );

    await user.click(screen.getByText('European Union'));

    expect(onRegionsChange).toHaveBeenLastCalledWith(['EU']);
  });

  it('clears all selections via the Clear all button', async () => {
    const onRegionsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        selectedRegions={['CA', 'MX']}
        onRegionsChange={onRegionsChange}
      />
    );

    await user.click(screen.getByText('Clear all'));

    expect(onRegionsChange).toHaveBeenLastCalledWith([]);
  });

  it('filters groups when searching and shows empty state for no matches', async () => {
    const user = userEvent.setup();
    render(<RegionSelector regionGroups={regionGroups} usedRegions={emptyUsedRegions} />);

    const search = screen.getByPlaceholderText('Search regions...');
    await user.type(search, 'Canada');

    // Auto-expanded search results include Canada, Global group is filtered out
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.queryByText('Global')).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'xyz123');
    expect(screen.getByText('No regions found')).toBeInTheDocument();
    expect(screen.getByText('Try searching with different terms')).toBeInTheDocument();
  });

  it('shows selection badges with overflow indicator when showSelectionDisplay is set', () => {
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        selectedRegions={['CA', 'MX', 'US-CA']}
        maxVisibleBadges={2}
        showSelectionDisplay
      />
    );

    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('+ 1 more')).toBeInTheDocument();
  });

  it('disables groups whose regions are all in use', () => {
    const usedRegions: UsedRegions = {
      regions: new Set(['Global']),
      isGlobalUsed: true,
      isEUGroupUsed: false,
      byInstance: new Map(),
    };

    render(<RegionSelector regionGroups={regionGroups} usedRegions={usedRegions} />);

    const globalButton = screen.getByText('Global').closest('button');
    expect(globalButton).toBeDisabled();
    expect(screen.getByText('In use')).toBeInTheDocument();
  });

  it('hides groups listed in the hide prop', () => {
    render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        hide={['global-parent']}
      />
    );

    const globalGroup = screen.getByText('Global').closest('.option-group');
    expect(globalGroup).toHaveClass('hidden');
  });

  it('shows the loading state', () => {
    render(<RegionSelector regionGroups={[]} usedRegions={emptyUsedRegions} isLoading />);
    expect(screen.getByText('Loading regions...')).toBeInTheDocument();
  });

  it('shows the error state', () => {
    render(
      <RegionSelector regionGroups={[]} usedRegions={emptyUsedRegions} error="Server exploded" />
    );
    expect(screen.getByText('Failed to load regions')).toBeInTheDocument();
    expect(screen.getByText('Server exploded')).toBeInTheDocument();
  });

  it('syncs when the selectedRegions prop changes without emitting a callback', () => {
    const onRegionsChange = vi.fn();
    const { rerender } = render(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        selectedRegions={[]}
        onRegionsChange={onRegionsChange}
        showSelectionDisplay
      />
    );

    rerender(
      <RegionSelector
        regionGroups={regionGroups}
        usedRegions={emptyUsedRegions}
        selectedRegions={['CA']}
        onRegionsChange={onRegionsChange}
        showSelectionDisplay
      />
    );

    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(onRegionsChange).not.toHaveBeenCalled();
  });
});
