import { useEffect, useRef, useState } from 'react';

import { SubtractIcon } from '../../icons';

import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Tooltip } from '../tooltip';
import type { ExtendedRegionGroup, Region, RegionGroup, RegionSelectorProps } from './types';

import './RegionSelector.css';

const chevronSvg = (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const RegionSelector = ({
  regionGroups,
  selectedRegions = [],
  onRegionsChange,
  usedRegions = {
    regions: new Set(),
    isGlobalUsed: false,
    isEUGroupUsed: false,
    byInstance: new Map(),
  },
  isLoading = false,
  error,
  maxVisibleBadges = 2,
  searchPlaceholder = 'Search regions...',
  showSelectionDisplay = false,
  hide = [],
  className = '',
  ...restProps
}: RegionSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedRegions, setTempSelectedRegions] = useState<string[]>(() => [
    ...selectedRegions,
  ]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());
  const previousSelectedRegions = useRef<string[]>([...selectedRegions]);

  /**
   * Sync with prop changes and trigger callback
   */
  useEffect(() => {
    if (JSON.stringify(selectedRegions) !== JSON.stringify(previousSelectedRegions.current)) {
      setTempSelectedRegions([...selectedRegions]);
      previousSelectedRegions.current = [...selectedRegions];
      return;
    }

    if (JSON.stringify(tempSelectedRegions) !== JSON.stringify(selectedRegions)) {
      onRegionsChange?.(tempSelectedRegions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegions, tempSelectedRegions]);

  const restructuredGroups = ((): ExtendedRegionGroup[] => {
    const globalGroup = regionGroups.find((g) => g.regions.some((r) => r.code === 'Global'));
    const euGroup = regionGroups.find(
      (g) => g.key.toLowerCase().includes('eu') || g.name.toLowerCase().includes('european')
    );

    const usGroup = regionGroups.find(
      (g) => g.key === 'us' || g.name.toLowerCase() === 'united states'
    );
    const otherCountries = regionGroups.filter(
      (g) =>
        g !== globalGroup &&
        g !== euGroup &&
        g !== usGroup &&
        !g.regions.some((r) => r.code === 'Global')
    );

    const mainGroups: ExtendedRegionGroup[] = [];

    if (globalGroup) {
      mainGroups.push({
        ...globalGroup,
        isMainParent: true,
        parentKey: 'global-parent',
      });
    }

    if (euGroup) {
      mainGroups.push({
        ...euGroup,
        isMainParent: true,
        parentKey: 'eu-parent',
      });
    }

    if (otherCountries.length > 0 || usGroup) {
      const selectCountriesRegions: Region[] = [];
      const selectCountriesSubGroups: RegionGroup[] = [];

      if (usGroup) {
        selectCountriesSubGroups.push(usGroup);
      }

      otherCountries.forEach((group) => {
        selectCountriesRegions.push(...group.regions);
      });

      mainGroups.push({
        name: 'Select Countries',
        key: 'select-countries-parent',
        regions: selectCountriesRegions,
        total: selectCountriesRegions.length + (usGroup ? usGroup.total : 0),
        isMainParent: true,
        parentKey: 'select-countries-parent',
        subGroups: selectCountriesSubGroups,
      });
    }

    return mainGroups;
  })();

  const selectedMainParent = ((): string | null => {
    if (tempSelectedRegions.includes('Global')) return 'global-parent';

    if (tempSelectedRegions.includes('EU')) {
      return 'eu-parent';
    }

    const selectCountriesGroup = restructuredGroups.find(
      (g) => g.parentKey === 'select-countries-parent'
    );
    if (selectCountriesGroup) {
      const hasAnySelected =
        selectCountriesGroup.regions.some((r) => tempSelectedRegions.includes(r.code)) ||
        selectCountriesGroup.subGroups?.some((sg) =>
          sg.regions.some((r) => tempSelectedRegions.includes(r.code))
        );
      if (hasAnySelected) return 'select-countries-parent';
    }

    return null;
  })();

  const filteredGroups = (() => {
    if (!searchQuery) return restructuredGroups;

    const filtered = restructuredGroups
      .map((group) => {
        const filteredRegions = group.regions.filter(
          (region) =>
            region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            region.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const filteredSubGroups = group.subGroups
          ?.map((subGroup) => ({
            ...subGroup,
            regions: subGroup.regions.filter(
              (region) =>
                region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                region.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                subGroup.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((sg) => sg.regions.length > 0);

        return {
          ...group,
          regions: filteredRegions,
          subGroups: filteredSubGroups,
        };
      })
      .filter(
        (group) => group.regions.length > 0 || (group.subGroups && group.subGroups.length > 0)
      );

    return filtered;
  })();

  /**
   * Auto-expand groups when searching
   */
  useEffect(() => {
    if (searchQuery) {
      const next = new Set<string>();

      restructuredGroups.forEach((group) => {
        const hasMatchingRegions = group.regions.some(
          (region) =>
            region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            region.code.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const hasMatchingSubGroups = group.subGroups?.some((sg) =>
          sg.regions.some(
            (region) =>
              region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              region.code.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );

        if (hasMatchingRegions || hasMatchingSubGroups) {
          next.add(group.key);
          group.subGroups?.forEach((sg) => {
            const sgHasMatching = sg.regions.some(
              (region) =>
                region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                region.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (sgHasMatching) {
              next.add(sg.key);
            }
          });
        }
      });

      setExpandedGroups(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const tempSelectedRegionObjects = (() => {
    const selected: Region[] = [];

    if (tempSelectedRegions.includes('Global')) {
      const globalGroup = regionGroups.find((g) => g.regions.some((r) => r.code === 'Global'));
      const globalRegion = globalGroup?.regions.find((r) => r.code === 'Global');
      if (globalRegion) {
        selected.push(globalRegion);
      }
    } else if (tempSelectedRegions.includes('EU')) {
      const euGroup = regionGroups.find((g) => g.key === 'europe');
      if (euGroup) {
        selected.push({
          code: 'EU',
          name: euGroup.name,
        });
      }
    } else {
      const allRegions = regionGroups.flatMap((g) => g.regions);
      tempSelectedRegions.forEach((code) => {
        const region = allRegions.find((r) => r.code === code);
        if (region) {
          selected.push(region);
        }
      });
    }

    return selected;
  })();

  const visibleBadges = tempSelectedRegionObjects.slice(0, maxVisibleBadges);
  const remainingBadgesCount = Math.max(0, tempSelectedRegionObjects.length - maxVisibleBadges);

  /**
   * Toggle group expansion
   */
  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  /**
   * Check if group is expanded
   */
  const isGroupExpanded = (groupKey: string): boolean => {
    return expandedGroups.has(groupKey);
  };

  /**
   * Toggle region selection
   */
  const toggleRegion = (code: string) => {
    if (code === 'Global') {
      if (tempSelectedRegions.includes('Global')) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(['Global']);
      }
    } else if (code === 'EU') {
      if (tempSelectedRegions.includes('EU')) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(['EU']);
      }
    } else {
      const filteredRegions = tempSelectedRegions.filter((c) => c !== 'Global' && c !== 'EU');

      if (filteredRegions.includes(code)) {
        setTempSelectedRegions(filteredRegions.filter((c) => c !== code));
      } else {
        setTempSelectedRegions([...filteredRegions, code]);
      }
    }
  };

  /**
   * Remove region from selection
   */
  const removeRegion = (code: string) => {
    let next: string[];
    if (code === 'Global' || code === 'EU') {
      next = [];
    } else {
      next = tempSelectedRegions.filter((c) => c !== code && c !== 'Global' && c !== 'EU');
    }
    setTempSelectedRegions(next);
    onRegionsChange?.(next);
  };

  /**
   * Clear all selections
   */
  const clearAll = () => {
    setTempSelectedRegions([]);
    onRegionsChange?.([]);
  };

  /**
   * Check if all group regions are in use
   */
  const areAllGroupRegionsInUse = (group: RegionGroup): boolean => {
    return group.regions.every((region) => usedRegions.regions.has(region.code));
  };

  /**
   * Check if all group and sub-group regions are in use
   */
  const areAllGroupAndSubGroupRegionsInUse = (group: ExtendedRegionGroup): boolean => {
    const mainRegionsInUse = group.regions.every((region) => usedRegions.regions.has(region.code));

    if (!group.subGroups || group.subGroups.length === 0) {
      return mainRegionsInUse;
    }

    const allSubGroupsInUse = group.subGroups.every((subGroup) => areAllGroupRegionsInUse(subGroup));

    return mainRegionsInUse && allSubGroupsInUse;
  };

  /**
   * Check if all group regions are selected
   */
  const isGroupFullySelected = (group: RegionGroup): boolean => {
    return group.regions.every((region) => tempSelectedRegions.includes(region.code));
  };

  /**
   * Check if some group regions are selected
   */
  const isGroupPartiallySelected = (group: RegionGroup): boolean => {
    const selectedCount = group.regions.filter((region) =>
      tempSelectedRegions.includes(region.code)
    ).length;
    return selectedCount > 0 && selectedCount < group.regions.length;
  };

  /**
   * Check if extended group (with subgroups) is partially selected
   */
  const isExtendedGroupPartiallySelected = (group: ExtendedRegionGroup): boolean => {
    const allRegions = [...group.regions, ...(group.subGroups?.flatMap((sg) => sg.regions) || [])];

    const availableRegions = allRegions.filter((region) => !usedRegions.regions.has(region.code));
    const selectedCount = availableRegions.filter((region) =>
      tempSelectedRegions.includes(region.code)
    ).length;

    return selectedCount > 0 && selectedCount < availableRegions.length;
  };

  /**
   * Check if extended group (with subgroups) is fully selected
   */
  const isExtendedGroupFullySelected = (group: ExtendedRegionGroup): boolean => {
    const allRegions = [...group.regions, ...(group.subGroups?.flatMap((sg) => sg.regions) || [])];

    const availableRegions = allRegions.filter((region) => !usedRegions.regions.has(region.code));
    return (
      availableRegions.length > 0 &&
      availableRegions.every((region) => tempSelectedRegions.includes(region.code))
    );
  };

  /**
   * Get checkbox state for a group (none, partial, full)
   */
  const getGroupCheckboxState = (
    group: ExtendedRegionGroup | RegionGroup
  ): 'none' | 'partial' | 'full' => {
    if ('subGroups' in group && group.subGroups) {
      if (isExtendedGroupFullySelected(group)) return 'full';
      if (isExtendedGroupPartiallySelected(group)) return 'partial';
      return 'none';
    } else {
      if (isGroupFullySelected(group as RegionGroup)) return 'full';
      if (isGroupPartiallySelected(group as RegionGroup)) return 'partial';
      return 'none';
    }
  };

  /**
   * Toggle entire group selection
   */
  const toggleGroup = (group: ExtendedRegionGroup) => {
    const hasGlobal = group.regions.some((r) => r.code === 'Global');
    const isEUGroup = group.key === 'europe' || group.parentKey === 'eu-parent';

    if (hasGlobal) {
      if (tempSelectedRegions.includes('Global')) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(['Global']);
      }
      return;
    }

    if (isEUGroup && group.isMainParent) {
      if (tempSelectedRegions.includes('EU')) {
        setTempSelectedRegions([]);
      } else {
        setTempSelectedRegions(['EU']);
      }
      return;
    }

    if (group.isMainParent) {
      const allGroupAndSubGroupRegions = [
        ...group.regions.map((r) => r.code),
        ...(group.subGroups?.flatMap((sg) => sg.regions.map((r) => r.code)) || []),
      ];

      const availableRegions = allGroupAndSubGroupRegions.filter(
        (code) => !usedRegions.regions.has(code)
      );

      const currentCountrySelections = tempSelectedRegions.filter(
        (code) => code !== 'Global' && code !== 'EU'
      );

      const allAvailableSelected = availableRegions.every((code) =>
        currentCountrySelections.includes(code)
      );

      if (allAvailableSelected) {
        setTempSelectedRegions(
          currentCountrySelections.filter((code) => !availableRegions.includes(code))
        );
      } else {
        setTempSelectedRegions([...new Set([...currentCountrySelections, ...availableRegions])]);
      }
      return;
    }

    const isFullySelected = isGroupFullySelected(group);
    const groupCodes = group.regions.map((r) => r.code);

    const availableGroupCodes = groupCodes.filter((code) => !usedRegions.regions.has(code));

    const currentCountrySelections = tempSelectedRegions.filter(
      (code) => code !== 'Global' && code !== 'EU'
    );

    if (isFullySelected) {
      setTempSelectedRegions(currentCountrySelections.filter((code) => !groupCodes.includes(code)));
    } else {
      setTempSelectedRegions([...new Set([...currentCountrySelections, ...availableGroupCodes])]);
    }
  };

  /**
   * Gets the instance name for a region from the usedRegions mapping
   */
  const getInstanceName = (regionCode: string): string => {
    return usedRegions.instanceNames?.get(regionCode) || 'another Instance';
  };

  /**
   * Creates tooltip message for regions in use
   */
  const getInUseTooltipMessage = (regionCode: string | undefined = undefined): string => {
    if (!regionCode) return 'Currently in use on another instance';

    const instanceName = getInstanceName(regionCode);
    return `Currently in use on ${instanceName}`;
  };

  /**
   * Check if a group should be hidden based on hide prop
   */
  const shouldHideGroup = (group: ExtendedRegionGroup): boolean => {
    if (hide.length === 0) return false;

    if (hide.includes(group.key) || (group.parentKey && hide.includes(group.parentKey))) {
      return true;
    }

    const hasHiddenRegion = group.regions.some((region) => hide.includes(region.code));
    if (hasHiddenRegion) return true;

    return false;
  };

  /**
   * Check if a subgroup should be hidden based on hide prop
   */
  const shouldHideSubGroup = (subGroup: RegionGroup): boolean => {
    if (hide.length === 0) return false;

    if (hide.includes(subGroup.key)) {
      return true;
    }

    const hasHiddenRegion = subGroup.regions.some((region) => hide.includes(region.code));
    if (hasHiddenRegion) return true;

    return false;
  };

  /**
   * Custom three-state checkbox (Svelte snippet equivalent)
   */
  const renderCustomCheckbox = (state: 'none' | 'partial' | 'full', disabled: boolean = false) => {
    if (state === 'full') {
      return <Checkbox checked={true} disabled={disabled} />;
    }
    if (state === 'partial') {
      return (
        <div className={`partially-selected-box${disabled ? ' disabled' : ''}`}>
          <SubtractIcon />
        </div>
      );
    }
    return <Checkbox checked={false} disabled={disabled} />;
  };

  return (
    <div className={`region-selector ${className}`} {...restProps}>
      <div className="search-actions-row">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {tempSelectedRegions.length > 0 && (
          <Button text="Clear all" variant="secondary" onclick={clearAll} className="clear-btn" />
        )}
      </div>

      {showSelectionDisplay && tempSelectedRegions.length > 0 && (
        <div className="selection-display">
          <div className="selected-items">
            {visibleBadges.map((region) => (
              <span className="selected-badge" key={region.code}>
                {region.name}
                <span
                  role="button"
                  tabIndex={0}
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRegion(region.code);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRegion(region.code);
                    }
                  }}
                >
                  &times;
                </span>
              </span>
            ))}
            {remainingBadgesCount > 0 && (
              <span className="more-badge"> + {remainingBadgesCount} more </span>
            )}
          </div>
        </div>
      )}

      <div className="options-list">
        {isLoading ? (
          <div className="empty-state">
            <span className="empty-text">Loading regions...</span>
          </div>
        ) : error ? (
          <div className="empty-state">
            <span className="empty-text error">Failed to load regions</span>
            <span className="empty-text-sub">{error}</span>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="empty-state">
            <span className="empty-text">No regions found</span>
            {searchQuery && (
              <span className="empty-text-sub">Try searching with different terms</span>
            )}
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isMainParent = group.isMainParent;
            const isThisMainParentSelected = selectedMainParent === group.parentKey;
            const hasGlobal = group.regions.some((r) => r.code === 'Global');
            const isEUGroup = group.key === 'europe' || group.parentKey === 'eu-parent';
            const isNonExpandable = hasGlobal || isEUGroup;
            const isGlobalGroupUsed = hasGlobal && usedRegions.isGlobalUsed;
            const isEUGroupUsed = isEUGroup && usedRegions.isEUGroupUsed;
            const allGroupRegionsInUse = areAllGroupAndSubGroupRegionsInUse(group);
            const isGroupUsedByOther = isGlobalGroupUsed || isEUGroupUsed || allGroupRegionsInUse;
            const isGroupDisabled = isGroupUsedByOther;

            const groupClasses = [
              'option-group',
              isGroupDisabled ? 'disabled' : '',
              isMainParent ? 'main-parent' : '',
              shouldHideGroup(group) ? 'hidden' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div className={groupClasses} key={group.key}>
                {isMainParent && (
                  <button
                    type="button"
                    className={[
                      'group-label',
                      'main-parent-label',
                      isThisMainParentSelected ? 'fully-selected' : '',
                      isGroupExpanded(group.key) ? 'expanded' : '',
                      isGroupDisabled ? 'disabled' : '',
                      isGroupUsedByOther ? 'in-use' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (isGroupDisabled) return;

                      if (isNonExpandable) {
                        toggleGroup(group);
                      } else {
                        toggleGroupExpansion(group.key);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isGroupDisabled) return;

                        if (isNonExpandable) {
                          toggleGroup(group);
                        } else {
                          toggleGroupExpansion(group.key);
                        }
                      }
                    }}
                    disabled={isGroupDisabled}
                  >
                    <div
                      role="radio"
                      tabIndex={-1}
                      aria-checked={isThisMainParentSelected}
                      onClick={(e) => {
                        if (!isNonExpandable) {
                          e.stopPropagation();
                          if (!isGroupDisabled) {
                            toggleGroup(group);
                            if (!isGroupExpanded(group.key)) {
                              toggleGroupExpansion(group.key);
                            }
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!isNonExpandable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isGroupDisabled) {
                            toggleGroup(group);
                            if (!isGroupExpanded(group.key)) {
                              toggleGroupExpansion(group.key);
                            }
                          }
                        }
                      }}
                    >
                      <Tooltip
                        message={getInUseTooltipMessage()}
                        placement="top"
                        listener="hover"
                        offsetVal={6}
                        width="auto"
                        position="fixed"
                        padding="6px 8px"
                        disabled={!isGroupDisabled}
                        target={renderCustomCheckbox(getGroupCheckboxState(group), isGroupDisabled)}
                      />
                    </div>
                    <div className="group-label-text-wrapper">
                      <span
                        className={`group-label-text${isGroupUsedByOther ? ' in-use' : ''}`}
                      >
                        <span className="group-name">{group.name}</span>
                        {isGroupUsedByOther && <span className="in-use-badge">In use</span>}
                      </span>
                    </div>
                    {!isNonExpandable && <span className="group-chevron">{chevronSvg}</span>}
                  </button>
                )}

                {(!isMainParent || isGroupExpanded(group.key)) && (
                  <>
                    {group.subGroups &&
                      group.subGroups.length > 0 &&
                      group.subGroups.map((subGroup) => {
                        const allSubGroupRegionsInUse = areAllGroupRegionsInUse(subGroup);
                        const isSubGroupDisabled = allSubGroupRegionsInUse;
                        const isSubGroupFullySelected = isGroupFullySelected(subGroup);
                        const isSubGroupPartiallySelected = isGroupPartiallySelected(subGroup);
                        const isSubGroupExpanded = isGroupExpanded(subGroup.key);

                        return (
                          <div
                            className={`sub-group${shouldHideSubGroup(subGroup) ? ' hidden' : ''}`}
                            key={subGroup.key}
                          >
                            <button
                              type="button"
                              className={[
                                'group-label',
                                'sub-group-label',
                                isSubGroupFullySelected ? 'fully-selected' : '',
                                isSubGroupPartiallySelected ? 'partially-selected' : '',
                                isSubGroupExpanded ? 'expanded' : '',
                                isSubGroupDisabled ? 'disabled' : '',
                                allSubGroupRegionsInUse ? 'in-use' : '',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              onClick={() => {
                                if (!isSubGroupDisabled) {
                                  toggleGroupExpansion(subGroup.key);
                                }
                              }}
                              disabled={isSubGroupDisabled}
                            >
                              <div
                                role="checkbox"
                                tabIndex={0}
                                aria-checked={
                                  isSubGroupFullySelected
                                    ? 'true'
                                    : isSubGroupPartiallySelected
                                      ? 'mixed'
                                      : 'false'
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isSubGroupDisabled) {
                                    toggleGroup(subGroup);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isSubGroupDisabled) {
                                      toggleGroup(subGroup);
                                    }
                                  }
                                }}
                              >
                                {renderCustomCheckbox(
                                  getGroupCheckboxState(subGroup),
                                  isSubGroupDisabled
                                )}
                              </div>
                              <div className="group-label-text-wrapper">
                                <span
                                  className={`group-label-text sub-group-text${allSubGroupRegionsInUse ? ' in-use' : ''}`}
                                >
                                  <span className="group-name">{subGroup.name}</span>
                                  {allSubGroupRegionsInUse && (
                                    <span className="in-use-badge">In use</span>
                                  )}
                                </span>
                              </div>
                              <span className="group-chevron">{chevronSvg}</span>
                            </button>

                            {isSubGroupExpanded &&
                              subGroup.regions.map((region) => {
                                const isRegionInUse = usedRegions.regions.has(region.code);
                                const isRegionDisabled = isRegionInUse;

                                if (isRegionDisabled) {
                                  return (
                                    <button
                                      type="button"
                                      className="option-item sub-group-item disabled in-use"
                                      style={{ cursor: 'not-allowed' }}
                                      key={region.code}
                                    >
                                      <Tooltip
                                        message={getInUseTooltipMessage(region.code)}
                                        placement="top"
                                        listener="hover"
                                        offsetVal={6}
                                        width="auto"
                                        position="fixed"
                                        padding="6px 8px"
                                        target={
                                          <Checkbox
                                            checked={tempSelectedRegions.includes(region.code)}
                                            disabled={isRegionDisabled}
                                          />
                                        }
                                      />
                                      <span className="option-label in-use disabled">
                                        <span className="region-name">{region.name}</span>
                                        <span className="in-use-badge">In use</span>
                                      </span>
                                    </button>
                                  );
                                }

                                return (
                                  <button
                                    type="button"
                                    className="option-item sub-group-item"
                                    onClick={() => toggleRegion(region.code)}
                                    key={region.code}
                                  >
                                    <Checkbox
                                      checked={tempSelectedRegions.includes(region.code)}
                                    />
                                    <span className="option-label">
                                      <span className="region-name">{region.name}</span>
                                    </span>
                                  </button>
                                );
                              })}
                          </div>
                        );
                      })}

                    {(!isMainParent || group.regions.length > 0) &&
                      group.regions.map((region) => {
                        const isRegionInUse = usedRegions.regions.has(region.code);
                        const isRegionDisabled = isRegionInUse;

                        if (isRegionDisabled) {
                          return (
                            <button
                              type="button"
                              className={[
                                'option-item',
                                isMainParent ? 'indented' : '',
                                'disabled',
                                'in-use',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              style={{ cursor: 'not-allowed' }}
                              disabled={true}
                              key={region.code}
                            >
                              <Tooltip
                                message={getInUseTooltipMessage(region.code)}
                                placement="top"
                                listener="hover"
                                offsetVal={6}
                                width="auto"
                                padding="6px 8px"
                                target={
                                  <Checkbox
                                    checked={tempSelectedRegions.includes(region.code)}
                                    disabled={isRegionDisabled}
                                  />
                                }
                              />
                              <span className="option-label disabled in-use">
                                <span className="region-name">{region.name}</span>
                                <span className="in-use-badge">In use</span>
                              </span>
                            </button>
                          );
                        }

                        return (
                          <button
                            type="button"
                            className={`option-item${isMainParent ? ' indented' : ''}`}
                            onClick={() => toggleRegion(region.code)}
                            key={region.code}
                          >
                            <Checkbox checked={tempSelectedRegions.includes(region.code)} />
                            <span className="option-label">
                              <span className="region-name">{region.name}</span>
                            </span>
                          </button>
                        );
                      })}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RegionSelector;
