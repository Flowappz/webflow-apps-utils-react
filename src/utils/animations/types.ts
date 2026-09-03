import type { easings } from '.';

/**
 * A minimal keyframes definition, API-compatible with the subset of Motion One's
 * `MotionKeyframesDefinition` used by this package. Numeric `x`/`y` values are
 * treated as `px`, `rotate` as `deg` and `scale`/`opacity` as unitless.
 */
export type MotionKeyframesDefinition = {
  opacity?: Array<number | string>;
  x?: Array<number | string>;
  y?: Array<number | string>;
  scale?: Array<number | string>;
  rotate?: Array<number | string>;
};

/**
 * A minimal animation options definition, API-compatible with the subset of
 * Motion One's `AnimationOptions` used by this package.
 */
export type AnimationOptions = {
  /** Duration in milliseconds (as consumed by the public animation API). */
  duration?: number;
  easing?: string;
};

export interface AnimationProps {
  keyframes: MotionKeyframesDefinition;
  initialStyles: {
    [key: string]: string;
  };
}

type FilteredAnimationOptions = Pick<AnimationOptions, 'duration' | 'easing'> & {
  stagger?: number;
};

type AnimationPrepare<T> = (element: HTMLElement | HTMLElement[], options?: T) => void;
type AnimationBase<T> = (element: HTMLElement | HTMLElement[], options?: T & FilteredAnimationOptions) => Promise<void>;

type PrepareProps = {
  target?: Element;
  insertAfter?: Node | null;
  display?: string;
};

type AnimationInProps = PrepareProps & {
  prepared?: true;
};

type AnimationOutProps = PrepareProps & {
  remove?: boolean;
};

type PrepareIn = AnimationPrepare<PrepareProps>;
type AnimationIn = AnimationBase<AnimationInProps>;
type AnimationOut = AnimationBase<AnimationOutProps>;

export type AnimationFunctions = {
  prepareIn: PrepareIn;
  animateIn: AnimationIn;
  animateOut: AnimationOut;
};

export type Animation = AnimationFunctions & {
  options?: FilteredAnimationOptions;
};

export type AnimationsObject = Readonly<
  Record<'fade' | 'slide-up' | 'slide-down' | 'slide-right' | 'slide-left' | 'grow' | 'shrink' | 'spin', AnimationFunctions>
>;

export type Easings = typeof easings;

export type AnimationOptionsCustom = Readonly<
  Record<'fade' | 'slide-up' | 'slide-down' | 'slide-right' | 'slide-left' | 'grow' | 'shrink' | 'spin', string>
>;
