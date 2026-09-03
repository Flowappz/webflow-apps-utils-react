export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressBarEasing = 'linear' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quartOut';

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  /**
   * Enable smooth animations (default: true)
   */
  animated?: boolean;
  /**
   * Animation duration in milliseconds (default: 400)
   */
  duration?: number;
  /**
   * Easing function (default: 'cubicOut')
   */
  easing?: ProgressBarEasing;
  /**
   * Show percentage text (default: true)
   */
  showPercentage?: boolean;
  /**
   * Show status text (default: false)
   */
  showStatus?: boolean;
  /**
   * Custom status text
   */
  statusText?: string;
  /**
   * Show loading spinner during progress (default: false)
   */
  showSpinner?: boolean;
  /**
   * Color scheme
   */
  variant?: ProgressBarVariant;
  /**
   * Height in pixels (default: 4)
   */
  height?: number;
  /**
   * Completed state - locks progress at final value
   */
  completed?: boolean;
  /**
   * Custom CSS class
   */
  className?: string;
  /**
   * Callback when progress completes
   */
  onComplete?: () => void;
}

export interface ProgressBarEvents {
  complete: CustomEvent<void>;
}
