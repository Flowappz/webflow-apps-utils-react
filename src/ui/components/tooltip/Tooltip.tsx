import './Tooltip.css';

import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import * as React from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { cleanupTooltipMessage } from '../../../utils';
import { writable } from '../../stores/store';
import { Text } from '../text/Text';
import type { TooltipInstance, TooltipProps } from './types';

/** Module-level registry of currently active tooltip ids (shared across all instances). */
const activeTooltips = writable<string[]>([]);

export const Tooltip = ({
  message = '',
  listener = 'hover',
  listenerout = 'hover',
  placement = 'right',
  position = 'absolute',
  showArrow = true,
  offsetVal = 10,
  hidden = false,
  disabled = false,
  tooltipIcon = null,
  tooltipIconColor = '',
  width = '150px',
  padding = '6px',
  raw = false,
  onIsActiveChange,
  fallbackPlacements = [],
  stopPropagation = true,
  fontColor = 'var(--text2)',
  bgColor = 'var(--background3)',
  className = '',
  targetClassName = '',
  target,
  tooltip,
  onshow,
  onclose,
  ref,
}: TooltipProps) => {
  const tooltipInstanceRef = useRef<TooltipInstance | null>(null);
  const targetElementRef = useRef<HTMLDivElement | null>(null);
  const tooltipElementRef = useRef<HTMLDivElement | null>(null);
  const arrowElementRef = useRef<HTMLDivElement | null>(null);
  const documentClickListenerRef = useRef<((event: MouseEvent) => void) | null>(null);
  const ignoreNextClickRef = useRef(false);
  const [tooltipId] = useState(() => `tooltip-${uuidv4()}`);

  // Latest prop values, readable from the imperative handlers set up on mount
  // (mirrors Svelte 5's reactive prop reads inside closures).
  const propsRef = useRef({
    listener,
    listenerout,
    placement,
    showArrow,
    offsetVal,
    disabled,
    fallbackPlacements,
    stopPropagation,
    onshow,
    onclose,
    onIsActiveChange,
  });
  propsRef.current = {
    listener,
    listenerout,
    placement,
    showArrow,
    offsetVal,
    disabled,
    fallbackPlacements,
    stopPropagation,
    onshow,
    onclose,
    onIsActiveChange,
  };

  /**
   * Dismisses other tooltips based on trigger compatibility.
   * Dismissal rules:
   * - hover tooltips can dismiss other hover tooltips
   * - click tooltips can dismiss other click tooltips
   * - hover tooltips should NOT dismiss click tooltips (they're "sticky")
   * - click tooltips CAN dismiss hover tooltips (higher priority)
   */
  const dismissOtherTooltips = () => {
    const { listener, listenerout } = propsRef.current;
    const currentTriggerType = listener === 'click' && listenerout === 'click' ? 'click' : 'hover';

    activeTooltips.update(() => {
      document.querySelectorAll<HTMLDivElement>('.tooltip[role="tooltip"]').forEach((item) => {
        if (item.id !== tooltipId) {
          const existingTriggerType = item.getAttribute('data-trigger-type');

          const shouldDismiss =
            currentTriggerType === 'click' ||
            (currentTriggerType === 'hover' && existingTriggerType === 'hover'); // Hover only dismisses other hover

          if (shouldDismiss) {
            item.style.display = 'none';
            item.setAttribute('aria-hidden', 'true');
          }
        }
      });

      return [tooltipId];
    });
  };

  /**
   * Sets up the tooltip.
   * @param toggle
   * @param tooltip
   * @param arrowElement
   */
  const setupTooltip = (
    toggle: HTMLElement,
    tooltip: HTMLElement,
    arrowElement: HTMLElement | undefined = undefined
  ): TooltipInstance => {
    /**
     * Updates the tooltip position.
     */
    const update = () => {
      const { placement, offsetVal, fallbackPlacements, showArrow } = propsRef.current;
      computePosition(toggle, tooltip, {
        placement: placement,
        middleware: [
          offset(offsetVal),
          flip(
            fallbackPlacements?.length > 0
              ? {
                  fallbackPlacements,
                }
              : {
                  fallbackAxisSideDirection: 'start',
                  fallbackStrategy: 'bestFit',
                }
          ),
          shift({ padding: 5 }),
          showArrow && arrowElement ? arrow({ element: arrowElement }) : undefined,
        ].filter(Boolean),
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(tooltip.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        // Accessing the data
        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];

        if (propsRef.current.showArrow && arrowElement) {
          if (!middlewareData?.arrow) return;
          const { x: arrowX, y: arrowY } = middlewareData.arrow;

          Object.assign(arrowElement.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [`${staticSide}`]: '-4px',
          });
        }
      });
    };

    /**
     * Shows the tooltip.
     */
    const showTooltip = () => {
      const tooltipElement = tooltipElementRef.current;
      if (propsRef.current.disabled || !tooltipElement) return;

      dismissOtherTooltips();

      tooltipElement.style.display = 'flex';
      tooltipElement.setAttribute('aria-hidden', 'false');

      // Set trigger type for dismissal logic
      const { listener, listenerout } = propsRef.current;
      const triggerType = listener === 'click' && listenerout === 'click' ? 'click' : 'hover';
      tooltipElement.setAttribute('data-trigger-type', triggerType);

      propsRef.current.onIsActiveChange?.(true);

      activeTooltips.update((ids) => [...ids.filter((id) => id !== tooltipId), tooltipId]);

      update();
      propsRef.current.onshow?.(true);
    };

    /**
     * Hides the tooltip.
     */
    const hideTooltip = () => {
      setTimeout(() => {
        const tooltipElement = tooltipElementRef.current;
        if (!tooltipElement) return;

        tooltipElement.style.display = 'none';
        tooltipElement.setAttribute('aria-hidden', 'true');
        tooltipElement.removeAttribute('data-trigger-type');
        propsRef.current.onIsActiveChange?.(false);

        activeTooltips.update((ids) => ids.filter((id) => id !== tooltipId));

        propsRef.current.onclose?.(true);
      }, 50);
    };

    let opts;

    if (listener === 'click' && listenerout === 'click') {
      opts = [['click', showTooltip]];

      // Store reference to the click handler for cleanup
      documentClickListenerRef.current = (event: MouseEvent) => {
        // Ignore clicks that happen immediately after a drag operation
        if (ignoreNextClickRef.current) {
          ignoreNextClickRef.current = false;
          return;
        }

        const tooltipElement = tooltipElementRef.current;
        if (
          tooltipElement &&
          toggle &&
          !tooltipElement.contains(event.target as Node) &&
          !toggle.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('click', documentClickListenerRef.current);
    } else {
      opts = [
        listener === 'click' ? ['click', showTooltip] : undefined,
        listener === 'hover' ? ['mouseenter', showTooltip] : undefined,
        listener === 'hover' ? ['mouseleave', hideTooltip] : undefined,
        listener === 'hover' ? ['focus', showTooltip] : undefined,
        ['blur', hideTooltip],
      ];
    }

    type EventOption = [string, () => void];
    const options: EventOption[] = opts.filter(Boolean) as EventOption[];

    options.forEach(([event, listener]) => {
      toggle.addEventListener(event, (evt) => {
        if (propsRef.current.stopPropagation) {
          evt.stopPropagation();
          evt.preventDefault();
        }
        listener();
      });
    });

    const cleanup = () => {
      if (tooltipElementRef.current) {
        autoUpdate(toggle, tooltipElementRef.current, update)();
      }
      if (documentClickListenerRef.current) {
        document.removeEventListener('click', documentClickListenerRef.current);
        documentClickListenerRef.current = null;
      }
    };

    return {
      toggle,
      tooltip: tooltipElementRef.current!,
      arrowElement,
      cleanup,
      showTooltip,
      hideTooltip,
    };
  };

  useImperativeHandle(
    ref,
    () => ({
      show: () => tooltipInstanceRef.current?.showTooltip(),
      hide: () => tooltipInstanceRef.current?.hideTooltip(),
      ignoreNextClickEvent: () => {
        ignoreNextClickRef.current = true;
      },
    }),
    []
  );

  // Mount / unmount (Svelte onMount + onDestroy)
  useEffect(() => {
    const targetElement = targetElementRef.current;
    const tooltipElement = tooltipElementRef.current;
    const arrowElement = arrowElementRef.current ?? undefined;

    if (tooltipElement && !(propsRef.current.showArrow && !arrowElement) && targetElement) {
      tooltipInstanceRef.current = setupTooltip(targetElement, tooltipElement, arrowElement);
    }

    return () => {
      // Clean up document click listener
      if (documentClickListenerRef.current) {
        document.removeEventListener('click', documentClickListenerRef.current);
        documentClickListenerRef.current = null;
      }

      if (tooltipInstanceRef.current) {
        tooltipInstanceRef.current.cleanup();
        activeTooltips.update((ids) => ids.filter((id) => id !== tooltipId));
        tooltipInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once, mirroring the Svelte onMount
  }, []);

  // Effect for hidden prop (Svelte $effect)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (hidden) {
      timeoutId = setTimeout(() => {
        tooltipInstanceRef.current?.hideTooltip();
        const wrapper = document.querySelector<HTMLDivElement>('.finsweet-components');
        if (wrapper) {
          wrapper.click();
          wrapper.focus();
        }
      }, 10);
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [hidden]);

  const isClickTarget = listener === 'click' && listenerout === 'click';

  const formattedMessage = cleanupTooltipMessage(message);

  const TooltipIcon = tooltipIcon;

  return (
    <div
      className={`target ${targetClassName}`}
      ref={targetElementRef}
      aria-describedby={tooltipId}
    >
      {target ?? (
        // Default target for Demo only
        <Text link label={isClickTarget ? 'Click me' : 'Hover me'} />
      )}

      <div
        className={`tooltip ${className}`}
        ref={tooltipElementRef}
        role="tooltip"
        id={tooltipId}
        style={{
          position: position as React.CSSProperties['position'],
          width,
          padding,
          backgroundColor: bgColor,
        }}
      >
        {TooltipIcon ? (
          <div className="icon" style={{ color: tooltipIconColor }}>
            <TooltipIcon />
          </div>
        ) : null}

        {tooltip ? (
          tooltip
        ) : message && raw ? (
          <div
            className="message"
            style={{ color: fontColor, backgroundColor: bgColor }}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ) : message ? (
          <div className="message" style={{ color: fontColor, backgroundColor: bgColor }}>
            <Text label={formattedMessage} fontSize="11px" fontWeight="500" fontColor={fontColor} />
          </div>
        ) : null}

        {showArrow ? (
          <div
            className="arrow"
            id={`arrow_${tooltipId}`}
            ref={arrowElementRef}
            style={{ backgroundColor: bgColor }}
          ></div>
        ) : null}
      </div>
    </div>
  );
};
