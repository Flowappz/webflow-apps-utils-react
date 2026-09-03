import type * as React from 'react';

export interface Region {
  code: string;
  name: string;
}

export interface RegionGroup {
  key: string;
  name: string;
  regions: Region[];
  total: number;
}

export interface ExtendedRegionGroup extends RegionGroup {
  isMainParent?: boolean;
  parentKey?: string;
  subGroups?: RegionGroup[];
}

export interface UsedRegions {
  regions: Set<string>;
  isGlobalUsed: boolean;
  isEUGroupUsed: boolean;
  byInstance: Map<string, Set<string>>;
  instanceNames?: Map<string, string>;
}

export interface RegionSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  regionGroups: RegionGroup[];
  selectedRegions?: string[];
  onRegionsChange?: (regions: string[]) => void;
  usedRegions?: UsedRegions;
  isLoading?: boolean;
  showSelectionDisplay?: boolean;
  error?: string;
  maxVisibleBadges?: number;
  searchPlaceholder?: string;
  hide?: string[];
  className?: string;
}
