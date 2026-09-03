import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RegionSelector from './RegionSelector';
import type { RegionGroup, UsedRegions } from './types';

// Dummy data that mimics real region structure
const dummyRegionGroups: RegionGroup[] = [
  {
    key: 'global',
    name: 'Global',
    regions: [
      {
        code: 'Global',
        name: 'Global',
      },
    ],
    total: 1,
  },
  {
    key: 'europe',
    name: 'European Union',
    regions: [
      {
        code: 'EU',
        name: 'European Union',
      },
    ],
    total: 1,
  },
  {
    key: 'us',
    name: 'United States',
    regions: [
      { code: 'US-AL', name: 'Alabama' },
      { code: 'US-AK', name: 'Alaska' },
      { code: 'US-AZ', name: 'Arizona' },
      { code: 'US-CA', name: 'California' },
      { code: 'US-CO', name: 'Colorado' },
      { code: 'US-CT', name: 'Connecticut' },
      { code: 'US-DE', name: 'Delaware' },
      { code: 'US-FL', name: 'Florida' },
      { code: 'US-GA', name: 'Georgia' },
      { code: 'US-HI', name: 'Hawaii' },
    ],
    total: 10,
  },
  {
    key: 'countries',
    name: 'Countries',
    regions: [
      { code: 'CA', name: 'Canada' },
      { code: 'MX', name: 'Mexico' },
      { code: 'BR', name: 'Brazil' },
      { code: 'AR', name: 'Argentina' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'FR', name: 'France' },
      { code: 'DE', name: 'Germany' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'JP', name: 'Japan' },
      { code: 'CN', name: 'China' },
      { code: 'IN', name: 'India' },
      { code: 'AU', name: 'Australia' },
      { code: 'NZ', name: 'New Zealand' },
    ],
    total: 14,
  },
];

const emptyUsedRegions: UsedRegions = {
  regions: new Set(),
  isGlobalUsed: false,
  isEUGroupUsed: false,
  byInstance: new Map(),
};

const someUsedRegions: UsedRegions = {
  regions: new Set(['US-CA', 'US-CO', 'CA', 'GB']),
  isGlobalUsed: false,
  isEUGroupUsed: false,
  byInstance: new Map(),
};

const globalUsedRegions: UsedRegions = {
  regions: new Set(['Global']),
  isGlobalUsed: true,
  isEUGroupUsed: false,
  byInstance: new Map(),
};

const meta = {
  title: 'UI/RegionSelector',
  component: RegionSelector,
  tags: ['autodocs'],
  argTypes: {
    regionGroups: {
      control: 'object',
      description: 'Array of region groups containing regions',
    },
    selectedRegions: {
      control: 'object',
      description: 'Array of selected region codes',
    },
    onRegionsChange: {
      action: 'onRegionsChange',
      description: 'Callback fired when region selection changes',
    },
    usedRegions: {
      control: 'object',
      description: 'Object containing regions that are already in use',
    },
    isLoading: {
      control: 'boolean',
      description: 'If true, shows loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    maxVisibleBadges: {
      control: 'number',
      description: 'Maximum number of selected region badges to show before "more" indicator',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for search input',
    },
    hide: {
      control: 'object',
      description: 'Array of group keys or region codes to hide from display',
    },
  },
  args: {
    onRegionsChange: fn(),
  },
} satisfies Meta<typeof RegionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
  },
};

export const WithPreSelectedRegions: Story = {
  name: 'With Pre-selected Regions',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-FL', 'CA', 'MX'],
    usedRegions: emptyUsedRegions,
  },
};

export const GlobalSelected: Story = {
  name: 'Global Selected',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['Global'],
    usedRegions: emptyUsedRegions,
  },
};

export const EUSelected: Story = {
  name: 'EU Selected',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['EU'],
    usedRegions: emptyUsedRegions,
  },
};

export const MultipleUSStatesSelected: Story = {
  name: 'Multiple US States Selected',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-CO', 'US-FL', 'US-GA', 'US-HI'],
    usedRegions: emptyUsedRegions,
  },
};

export const WithUsedRegions: Story = {
  name: 'With Used Regions',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-FL', 'MX'],
    usedRegions: someUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Regions marked as "in-use" (California, Colorado, Canada, UK) are disabled and cannot be selected.',
      },
    },
  },
};

export const GlobalInUse: Story = {
  name: 'Global In Use',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: globalUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story: 'When Global is in use, the Global option is disabled.',
      },
    },
  },
};

export const LoadingState: Story = {
  name: 'Loading State',
  args: {
    regionGroups: [],
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
    isLoading: true,
  },
};

export const ErrorState: Story = {
  name: 'Error State',
  args: {
    regionGroups: [],
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
    error: 'Failed to load regions. Please try again.',
  },
};

export const CustomMaxVisibleBadges: Story = {
  name: 'Custom Max Visible Badges',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-CO', 'US-FL', 'US-GA', 'CA', 'MX', 'BR'],
    usedRegions: emptyUsedRegions,
    maxVisibleBadges: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows 3 region badges before displaying "+N more" indicator.',
      },
    },
  },
};

export const CustomSearchPlaceholder: Story = {
  name: 'Custom Search Placeholder',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
    searchPlaceholder: 'Find your region...',
  },
};

export const InteractiveClearSelections: Story = {
  name: 'Interactive - Clear Selections',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-FL', 'CA'],
    usedRegions: emptyUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test the "Clear all" functionality. Select some regions and click "Clear all" button.',
      },
    },
  },
};

export const InteractiveSearchFunctionality: Story = {
  name: 'Interactive - Search Functionality',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Test search functionality. Try searching for "California", "CA", "United", etc.',
      },
    },
  },
};

export const InteractiveNestedGroups: Story = {
  name: 'Interactive - Nested Groups',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test expanding/collapsing groups. Select "Select Countries" to see US States nested inside.',
      },
    },
  },
};

export const ManySelectedRegions: Story = {
  name: 'Many Selected Regions',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [
      'US-CA',
      'US-CO',
      'US-FL',
      'US-GA',
      'US-HI',
      'CA',
      'MX',
      'BR',
      'AR',
      'GB',
      'FR',
      'DE',
    ],
    usedRegions: emptyUsedRegions,
    maxVisibleBadges: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component handles many selected regions with badge overflow.',
      },
    },
  },
};

export const EmptySearchResults: Story = {
  name: 'Empty Search Results',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Type a search term that yields no results (like "xyz123") to see empty search state.',
      },
    },
  },
};

export const AccessibilityTest: Story = {
  name: 'Accessibility Test',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA'],
    usedRegions: emptyUsedRegions,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test keyboard navigation: Tab to focus elements, Space/Enter to select, Arrow keys for navigation.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'button-name', enabled: true },
          { id: 'aria-allowed-attr', enabled: true },
          { id: 'aria-valid-attr', enabled: true },
        ],
      },
    },
  },
};

export const HideGlobalGroup: Story = {
  name: 'Hide Global Group',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
    hide: ['global-parent'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates hiding the Global group using the parent key. The Global option will not be visible.',
      },
    },
  },
};

export const HideByRegionCode: Story = {
  name: 'Hide by Region Code',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: [],
    usedRegions: emptyUsedRegions,
    hide: ['Global', 'EU'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows hiding multiple groups by their region codes. Both Global and EU groups are hidden.',
      },
    },
  },
};

export const HideMultipleGroups: Story = {
  name: 'Hide Multiple Groups',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['CA', 'MX'],
    usedRegions: emptyUsedRegions,
    hide: ['global-parent', 'europe', 'us'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates hiding multiple groups at once. Only the Countries group remains visible, with some regions pre-selected.',
      },
    },
  },
};

export const ThreeStateCheckboxes: Story = {
  name: 'Three State Checkboxes',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-AZ'],
    usedRegions: emptyUsedRegions,
    showSelectionDisplay: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the three-state checkbox system: empty (no selections), minus icon (partial selections), and checkmark (all selections). The United States group shows a minus icon because only some states are selected (California and Arizona). Try selecting more states to see how the checkbox changes.',
      },
    },
  },
};

export const ThreeStateWithMixedGroups: Story = {
  name: 'Three State with Mixed Groups',
  args: {
    regionGroups: dummyRegionGroups,
    selectedRegions: ['US-CA', 'US-AZ', 'US-FL', 'CA', 'MX'],
    usedRegions: emptyUsedRegions,
    showSelectionDisplay: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows three-state checkboxes with mixed selections across multiple groups. The "Select Countries" parent group shows a minus icon because it contains both the US subgroup (partially selected) and individual countries (Canada, Mexico). This demonstrates how parent groups intelligently show partial selection state when their children have mixed selection states.',
      },
    },
  },
};
