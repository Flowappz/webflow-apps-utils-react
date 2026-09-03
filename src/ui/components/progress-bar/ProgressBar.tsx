import './ProgressBar.css';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { CheckCircleOutlinedIcon, WarningTriangleOutlineIcon } from '../../icons';
import Loader from '../Loader';
import { Text } from '../text';
import type { ProgressBarEasing, ProgressBarProps } from './types';

/**
 * Easing functions matching `svelte/easing`.
 */
const easingFunctions: Record<ProgressBarEasing, (t: number) => number> = {
  linear: (t) => t,
  cubicIn: (t) => t * t * t,
  cubicOut: (t) => {
    const f = t - 1.0;
    return f * f * f + 1.0;
  },
  cubicInOut: (t) => (t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0),
  quartOut: (t) => Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0,
};

export const ProgressBar = ({
  value = 0,
  max = 100,
  animated = true,
  duration = 400,
  easing = 'cubicOut',
  showPercentage = true,
  showStatus = false,
  statusText = '',
  showSpinner = false,
  variant = 'default',
  height = 4,
  completed = false,
  className = '',
  onComplete,
  ...restProps
}: ProgressBarProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedValue, setCompletedValue] = useState<number | null>(null);

  const percentage = Math.min(100, Math.round((Math.max(0, value) / Math.max(1, max)) * 100));

  // Tweened progress (React equivalent of svelte/motion `tweened`)
  const [tweenedProgress, setTweenedProgress] = useState(0);
  const tweenedProgressRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const setProgress = (val: number) => {
    tweenedProgressRef.current = val;
    setTweenedProgress(val);
  };

  useEffect(() => {
    if (completed) return;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const target = percentage;
    const from = tweenedProgressRef.current;

    if (!animated || duration <= 0 || from === target) {
      setProgress(target);
      return;
    }

    const ease = easingFunctions[easing];
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      setProgress(from + (target - from) * ease(t));

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, completed, animated, duration, easing]);

  useEffect(() => {
    if (completed && !isCompleted) {
      setCompletedValue(tweenedProgressRef.current);
      setIsCompleted(true);

      onComplete?.();
    }

    if (!completed && isCompleted) {
      setIsCompleted(false);
      setCompletedValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, isCompleted]);

  const displayWidth = isCompleted && completedValue !== null ? completedValue : tweenedProgress;

  const displayPercentage =
    isCompleted && completedValue !== null ? Math.round(completedValue) : Math.round(tweenedProgress);

  const containerClasses = (() => {
    const classes = ['progress-container'];
    if (className) classes.push(className);
    return classes.join(' ');
  })();

  const progressClasses = (() => {
    const classes = ['progress-fill'];
    if (isCompleted) classes.push('completed');
    if (variant !== 'default') classes.push(`progress-fill--${variant}`);
    return classes.join(' ');
  })();

  const displayStatusText = (() => {
    if (isCompleted) {
      return 'Completed successfully';
    }
    return statusText || `${displayPercentage}%`;
  })();

  const StatusIcon = isCompleted ? CheckCircleOutlinedIcon : WarningTriangleOutlineIcon;

  const statusColor = (() => {
    if (isCompleted) return 'var(--greenText)';

    switch (variant) {
      case 'success':
        return 'var(--greenText)';
      case 'warning':
        return 'var(--yellowText)';
      case 'error':
        return 'var(--redText)';
      default:
        return 'var(--text1)';
    }
  })();

  const progressFillColor = (() => {
    if (isCompleted) return 'var(--greenText)';

    switch (variant) {
      case 'success':
        return 'var(--greenText)';
      case 'warning':
        return 'var(--yellowText)';
      case 'error':
        return 'var(--redText)';
      default:
        return 'var(--actionPrimaryBackground)';
    }
  })();

  return (
    <div
      className={containerClasses}
      role="progressbar"
      aria-valuenow={displayPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={displayStatusText}
      aria-live="polite"
      {...restProps}
    >
      {(showStatus || showPercentage || showSpinner) && (
        <div className="progress-header">
          <div className="status-info">
            {showSpinner && !isCompleted && (
              <div className="progress-spinner">
                <Loader size={12} margin="0" />
              </div>
            )}

            <div className={`status-icon${isCompleted ? ' success' : ''}`}>
              <StatusIcon />
            </div>

            {showStatus && (
              <Text
                label={displayStatusText}
                fontColor={statusColor}
                fontSize="normal"
                className="progress-status"
              />
            )}
          </div>

          <div className="progress-details">
            {showPercentage && (
              <Text
                label={`${displayPercentage}%`}
                fontColor={statusColor}
                fontSize="normal"
                className="progress-percentage"
              />
            )}
          </div>
        </div>
      )}

      <div className="progress-track" style={{ height: `${height}px` }}>
        <div
          className={progressClasses}
          style={{
            width: `${displayWidth}%`,
            height: `${height}px`,
            backgroundColor: progressFillColor,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
