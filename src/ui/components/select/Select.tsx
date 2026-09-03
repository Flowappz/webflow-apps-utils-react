import './Select.css';

import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import debounce from 'just-debounce';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CheckIcon, ChevronIcon } from '../../icons';
import { Text } from '../text';
import { Tooltip } from '../tooltip';
import type { SelectOption, SelectProps } from './types';

export const Select = ({
  id: idProp,
  defaultText = 'Select',
  hide = false,
  enableSearch = false,
  ref = '',
  width = '200px',
  dropdownWidth = '200px',
  dropdownHeight = '200px',
  options,
  selected: selectedProp = null,
  onSelectedChange,
  preventNoSelection = false,
  disabled = false,
  placement = 'bottom',
  alert = null,
  invalid = false,
  className = '',
  closeOnEscape = true,
  closeOnClickOutside = true,
  onOpen,
  itemsDisabled = false,
  itemsDisabledMessage = '',
  onchange,
  footer,
}: SelectProps) => {
  // Stable auto-generated id fallback (source: `id = uuidv4()`)
  const reactId = React.useId();
  const id = idProp ?? reactId.replace(/[^a-zA-Z0-9_-]/g, '');

  // State variables
  const [optionsStore, setOptionsStore] = useState<SelectOption[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError] = useState(false);

  // `selected` was `$bindable` in the source — controlled prop with internal fallback
  const [selectedState, setSelectedState] = useState<string | null>(selectedProp);
  useEffect(() => {
    setSelectedState(selectedProp);
  }, [selectedProp]);
  const selected = selectedState;

  const setSelected = (value: string | null) => {
    setSelectedState(value);
    onSelectedChange?.(value);
  };

  // Element bindings
  const lastHoveredItemRef = useRef<HTMLElement | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const dropdownWrapper = useRef<HTMLDivElement | null>(null);
  const target = useRef<HTMLDivElement | null>(null);
  const dropdownItems = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(false);

  // Reactive updates
  useEffect(() => {
    setOptionsStore(options);
  }, [options]);

  // Selected label is derived from the current selection
  const selectedOption = options?.find((option) => option?.value === selected);
  const selectedLabel = selectedOption ? selectedOption.label : defaultText;

  // Computed states
  const hasAlert = alert?.message;

  // Computed styles based on state
  const dropdownStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--border-radius, 4px)',
      background: 'var(--actionSecondaryBackground)',
      boxShadow:
        'var(--boxShadows-action-secondary, 0px 0.5px 1px 0px #000, 0px 0.5px 0.5px 0px rgba(255, 255, 255, 0.12) inset)',
    };

    if (disabled) {
      return {
        ...base,
        opacity: '0.4',
      };
    }

    if (hasError || hasAlert || invalid) {
      return {
        ...base,
        outline: '1px solid var(--redBorder)',
      };
    }

    if (isFocused) {
      return {
        ...base,
        outline: '1px solid var(--blueBorder)',
      };
    }

    if (isHovered) {
      return {
        ...base,
        background: 'var(--actionSecondaryBackground)',
      };
    }

    return base;
  };

  /**
   * Closes the dropdown.
   */
  const closeDropdown = () => {
    setIsOpen(false);
    setIsFocused(false);
    isOpenRef.current = false;

    if (!dropdownItems.current) return;

    dropdownItems.current.style.display = 'none';
    dropdownItems.current.setAttribute('aria-hidden', 'true');
  };

  /**
   * Resets the dropdown.
   */
  const resetDropdown = (): void => {
    setSelected(null);
    closeDropdown();
    setShowConfirmDialog(false);

    onchange?.({ value: null });
  };

  /**
   * Handles the option selection.
   */
  const handleSelect = (value: string, label = defaultText, element: HTMLButtonElement) => {
    if (disabled || itemsDisabled) return;
    void label;
    updateActiveElement(element);

    if (selected === value && !preventNoSelection) {
      resetDropdown();
      return;
    }

    setSelected(value);
    closeDropdown();

    onchange?.({ value });
  };

  /**
   * Updates the active element.
   */
  const updateActiveElement = (newActiveElement: HTMLButtonElement) => {
    if (activeElementRef.current) {
      activeElementRef.current.setAttribute('aria-hidden', 'true');
    }

    if (newActiveElement) {
      newActiveElement.setAttribute('aria-hidden', 'false');
    }

    activeElementRef.current = newActiveElement;
  };

  /**
   * Handles keyboard navigation for the dropdown.
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (!isOpenRef.current || !dropdownItems.current) return;

    const items = Array.from(
      dropdownItems.current.querySelectorAll('.dropdown-item:not(.items-disabled)')
    );
    const currentIndex = lastHoveredItemRef.current ? items.indexOf(lastHoveredItemRef.current) : -1;
    let newIndex = -1;

    switch (event.key) {
      case 'ArrowDown':
        if (itemsDisabled) break;
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        if (itemsDisabled) break;
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Enter': {
        if (itemsDisabled) break;
        const selectedItem = items[currentIndex] as HTMLButtonElement;
        selectedItem.click();
        break;
      }
      case 'Escape':
        if (closeOnEscape) {
          closeDropdown();
          // Remove focus to prevent focus ring after closing
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
        break;
    }

    if (newIndex > -1) {
      if (lastHoveredItemRef.current) {
        lastHoveredItemRef.current.classList.remove('hover-state');
        lastHoveredItemRef.current.setAttribute('tabindex', '-1');
      }
      lastHoveredItemRef.current = items[newIndex] as HTMLElement;
      lastHoveredItemRef.current.classList.add('hover-state');
      lastHoveredItemRef.current.setAttribute('tabindex', '0');
      lastHoveredItemRef.current.focus();
      event.preventDefault();
    }
  };

  /**
   * Sets focus to the hovered dropdown item.
   */
  const handleMouseEnter = (event: React.MouseEvent): void => {
    const currentTarget = event.currentTarget as HTMLElement;

    if (lastHoveredItemRef.current && lastHoveredItemRef.current !== currentTarget) {
      lastHoveredItemRef.current.classList.remove('hover-state');
      lastHoveredItemRef.current.setAttribute('tabindex', '-1');
    }

    currentTarget.classList.add('hover-state');
    currentTarget.setAttribute('tabindex', '0');
    lastHoveredItemRef.current = currentTarget;
  };

  /**
   * Clears the hover state when mouse leaves the items area.
   */
  const clearHoverState = (): void => {
    if (lastHoveredItemRef.current) {
      lastHoveredItemRef.current.classList.remove('hover-state');
      lastHoveredItemRef.current.setAttribute('tabindex', '-1');
      lastHoveredItemRef.current = null;
    }
  };

  /**
   * Positions the dropdown relative to the toggle via floating-ui.
   */
  const updatePosition = () => {
    const toggle = target.current;
    const tooltip = dropdownItems.current;
    if (!toggle || !tooltip) return;

    computePosition(toggle, tooltip, {
      placement,
      middleware: [offset(-24), flip(), shift({ padding: 5 })],
    }).then(({ x, y }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  };

  /**
   * Shows the dropdown.
   */
  const showDropdown = () => {
    if (disabled) return;
    if (isOpenRef.current) return;

    const tooltip = dropdownItems.current;
    if (!tooltip) return;

    // Show the dropdown FIRST so elements are focusable before calling focus()
    tooltip.setAttribute('aria-hidden', 'false');
    tooltip.style.display = 'flex';
    setIsOpen(true);
    setIsFocused(true);
    isOpenRef.current = true;
    updatePosition();

    onOpen?.();

    const selectedItemButton = tooltip.querySelector(
      `.dropdown-item[aria-selected="true"]`
    ) as HTMLElement;
    const firstItemButton = tooltip.querySelector('.dropdown-item') as HTMLElement;

    const searchInput = tooltip?.querySelector<HTMLInputElement>('input[type="text"]');
    if (selectedItemButton) {
      selectedItemButton.focus();
      if (lastHoveredItemRef.current) {
        lastHoveredItemRef.current.classList.remove('hover-state');
        lastHoveredItemRef.current.setAttribute('tabindex', '-1');
      }
      lastHoveredItemRef.current = selectedItemButton;
      lastHoveredItemRef.current.classList.add('hover-state');
      lastHoveredItemRef.current.setAttribute('tabindex', '0');
    } else if (searchInput && enableSearch) {
      searchInput.focus();
    } else if (firstItemButton) {
      firstItemButton.focus();
      if (lastHoveredItemRef.current) {
        lastHoveredItemRef.current.classList.remove('hover-state');
        lastHoveredItemRef.current.setAttribute('tabindex', '-1');
      }
      lastHoveredItemRef.current = firstItemButton;
      lastHoveredItemRef.current.classList.add('hover-state');
      lastHoveredItemRef.current.setAttribute('tabindex', '0');
    }
  };

  /**
   * Dropdown setup: outside-click dismissal + floating-ui auto positioning.
   * (The source registered these in an `$effect` via `init()`; here they get
   * proper cleanup.)
   */
  useEffect(() => {
    if (disabled) return;

    const toggle = target.current;
    const tooltip = dropdownItems.current;
    if (!toggle || !tooltip) return;

    /**
     * Dismiss dropdown when clicking outside of it.
     */
    const dismissTooltip = (event: Event): void => {
      if (!closeOnClickOutside) return;

      const isClickInside = dropdownWrapper.current?.contains(event.target as Node);

      if (!isClickInside) {
        closeDropdown();
      }
    };

    if (closeOnClickOutside) {
      document?.addEventListener('click', dismissTooltip, true);
    }

    const cleanup = autoUpdate(toggle, tooltip, updatePosition);

    return () => {
      cleanup();
      if (closeOnClickOutside) {
        document?.removeEventListener('click', dismissTooltip, true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, closeOnClickOutside, placement]);

  // Confirm-dialog outside click dismissal (ported from source)
  useEffect(() => {
    /**
     * Dismiss dropdown confirm dialog when clicking outside of it.
     */
    const dismissPopupDialog = (event: Event): void => {
      const { target: eventTarget } = event;
      const popups = document?.querySelectorAll<HTMLDivElement>(`.dropdown-wrapper .popup`);

      if (popups && popups.length > 0) {
        popups.forEach((popup) => {
          if (popup && !popup.contains(eventTarget as Node)) {
            popup.style.display = 'none';
          }
        });

        setShowConfirmDialog(false);
      }
    };

    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (showConfirmDialog) {
      timeout = setTimeout(() => {
        document?.addEventListener('click', dismissPopupDialog);
      }, 300);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      document?.removeEventListener('click', dismissPopupDialog);
    };
  }, [showConfirmDialog]);

  // Handle global Escape key when dropdown is open
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isOpenRef.current) {
        event.preventDefault();
        event.stopPropagation();
        closeDropdown();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    if (isOpen) {
      document?.addEventListener('keydown', handleGlobalKeyDown);
    }

    return () => {
      document?.removeEventListener('keydown', handleGlobalKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeOnEscape]);

  /**
   * Debounces the filter options.
   */
  const debouncedFilterOptions = useMemo(
    () =>
      debounce((searchValue: string, data: SelectOption[]) => {
        const filteredOptions = data.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        );
        setOptionsStore(filteredOptions);
      }, 50),
    []
  );

  /**
   * Handles the search input.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    if (!options) {
      return;
    }

    debouncedFilterOptions(searchValue, options);
  };

  /**
   * Gets the tooltip background color based on alert type
   */
  const getTooltipColor = (alertType: string) => {
    switch (alertType) {
      case 'error':
        return 'var(--redBackground)';
      case 'warning':
        return 'var(--orangeBackground)';
      case 'success':
        return 'var(--greenBackground)';
      case 'info':
      default:
        return 'var(--actionPrimaryBackground)';
    }
  };

  const renderedOptions = optionsStore?.length > 0 ? optionsStore : options;
  const itemId = ref ? ref.replace(' ', '-') : 'dropdown';

  const selectWrapper = (
    <div
      className={`dropdown-wrapper ${className}`}
      ref={dropdownWrapper}
      style={{ ...(hide ? { display: 'none' } : {}), width }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`dropdown${disabled ? ' disabled' : ''}`}
        id={id}
        style={{ width, ...dropdownStyles() }}
        aria-disabled={disabled}
        tabIndex={disabled || isOpen ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-labelledby={id}
        ref={target}
        onClick={showDropdown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div className="dropdown-header" aria-disabled={disabled}>
          <div className="label">{selected ? selectedLabel || defaultText : defaultText}</div>
          <div className="arrow" style={{ transform: `rotate(${isOpen ? '270deg' : '90deg'})` }}>
            <ChevronIcon />
          </div>
        </div>

        <div
          tabIndex={disabled || isOpen ? -1 : 0}
          className={`dropdown-list${footer ? ' has-footer' : ''}`}
          role="listbox"
          style={{ width: dropdownWidth }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleKeyDown(e);
          }}
          ref={dropdownItems}
        >
          <div
            className={`dropdown-items-scroll${itemsDisabled ? ' disabled' : ''}`}
            style={{ maxHeight: dropdownHeight }}
            onMouseLeave={clearHoverState}
          >
            {itemsDisabled && itemsDisabledMessage && (
              <div className="items-disabled-overlay" role="status">
                <Text
                  loading
                  className="items-disabled-text"
                  label={itemsDisabledMessage}
                  fontSize="normal"
                  fontColor="var(--text2)"
                />
              </div>
            )}
            {selectedLabel && (
              <div className="selected">
                <div className="label">
                  <Text label={selectedLabel} fontSize="normal" fontColor="var(--text1)" />
                </div>
              </div>
            )}

            {enableSearch && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search"
                  disabled={itemsDisabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSearch(e);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {renderedOptions.map(
              (
                {
                  label,
                  value,
                  className: optionClassName = undefined,
                  description = undefined,
                  labelIcon: LabelIcon = undefined,
                  descriptionTitle = undefined,
                  isDisabled = false,
                },
                index
              ) => {
                const indexId = index + 1;
                return (
                  <button
                    key={index}
                    aria-posinset={indexId}
                    aria-selected={
                      value === selected && selected?.trim() !== '' ? 'true' : 'false'
                    }
                    id={`${itemId}-list-${indexId}-${id}`}
                    data-value={value}
                    className={`dropdown-item ${isDisabled || itemsDisabled ? 'disabled' : ''} ${
                      itemsDisabled ? 'items-disabled' : ''
                    } ${optionClassName ?? ''}`}
                    role="option"
                    aria-disabled={isDisabled || itemsDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDisabled || itemsDisabled) return;
                      handleSelect(value, label, e.currentTarget);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (e.key === 'Escape' && closeOnEscape) {
                        closeDropdown();
                      }
                    }}
                    onMouseEnter={handleMouseEnter}
                    aria-hidden={!isOpen}
                    tabIndex={value === selected ? 0 : -1}
                    style={description ? { alignItems: 'start' } : undefined}
                  >
                    <div className="icon" aria-label={label}>
                      {value === selected && selected?.trim() !== '' && <CheckIcon />}
                    </div>
                    <div className="label">
                      {description || descriptionTitle || LabelIcon ? (
                        <div className="label-content">
                          <div className="label-name">
                            <Text label={label} />
                            {LabelIcon && <LabelIcon />}
                          </div>
                          <div className="label-description-title">
                            <Text
                              label={descriptionTitle || ''}
                              fontColor="var(--greenText)"
                              fontSize="10px"
                            />
                          </div>
                          <div className="label-description">
                            <Text
                              label={description || ''}
                              fontColor="var(--text2)"
                              fontSize="10px"
                            />
                          </div>
                        </div>
                      ) : (
                        <Text label={label} fontSize="normal" />
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {footer && <div className="dropdown-footer">{footer({ close: closeDropdown })}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip
      message={hasAlert ? alert?.message || '' : ''}
      placement="top"
      listener="hover"
      listenerout="hover"
      showArrow={true}
      hidden={!hasAlert}
      disabled={!hasAlert || !alert?.message}
      fontColor="var(--actionPrimaryText)"
      width="max-content"
      padding="6px"
      bgColor={getTooltipColor(alert?.type || 'info')}
      className="select-tooltip"
      target={selectWrapper}
    />
  );
};

export default Select;
