import type { AnimationFunctions, AnimationProps, MotionKeyframesDefinition } from './types';

/**
 * Motion One's default duration (0.3s) and easing, kept for parity after the
 * `motion` dependency was replaced with the native Web Animations API.
 */
const DEFAULT_DURATION_MS = 300;
const DEFAULT_EASING = 'ease';

/**
 * Converts a Motion One-style keyframes definition (`{ opacity: [0, 1], y: [100, 0] }`)
 * into an array of Web Animations API keyframes.
 */
const buildWaapiKeyframes = (keyframes: MotionKeyframesDefinition): Keyframe[] => {
  const { opacity, x, y, scale, rotate } = keyframes;

  const frameCount = Math.max(
    2,
    ...[opacity, x, y, scale, rotate].filter((values): values is Array<number | string> => !!values).map((values) => values.length)
  );

  const valueAt = (values: Array<number | string> | undefined, index: number) => {
    if (!values || !values.length) return undefined;
    return values[Math.min(index, values.length - 1)];
  };

  const frames: Keyframe[] = [];

  for (let index = 0; index < frameCount; index++) {
    const frame: Keyframe = {};

    const opacityValue = valueAt(opacity, index);
    if (opacityValue !== undefined) frame.opacity = opacityValue;

    const transforms: string[] = [];

    const xValue = valueAt(x, index);
    if (xValue !== undefined) transforms.push(`translateX(${typeof xValue === 'number' ? `${xValue}px` : xValue})`);

    const yValue = valueAt(y, index);
    if (yValue !== undefined) transforms.push(`translateY(${typeof yValue === 'number' ? `${yValue}px` : yValue})`);

    const scaleValue = valueAt(scale, index);
    if (scaleValue !== undefined) transforms.push(`scale(${scaleValue})`);

    const rotateValue = valueAt(rotate, index);
    if (rotateValue !== undefined)
      transforms.push(`rotate(${typeof rotateValue === 'number' ? `${rotateValue}deg` : rotateValue})`);

    if (transforms.length) frame.transform = transforms.join(' ');

    frames.push(frame);
  }

  return frames;
};

/**
 * Animates the given elements with the Web Animations API, applying an optional
 * per-element stagger delay (in milliseconds).
 */
const runAnimation = async (
  elements: HTMLElement[],
  keyframes: Keyframe[],
  options: {
    duration?: number;
    easing?: string;
    stagger?: number;
    direction?: PlaybackDirection;
  }
): Promise<void> => {
  const { duration, easing, stagger, direction } = options;

  const animations = elements.map((element, index) =>
    element.animate(keyframes, {
      duration: duration ?? DEFAULT_DURATION_MS,
      easing: easing ?? DEFAULT_EASING,
      delay: stagger ? index * stagger : 0,
      direction,
      fill: 'both'
    })
  );

  await Promise.all(animations.map((animation) => animation.finished));

  // Commit the final styles and release the animations so they don't hold
  // the elements' styles forever (mirrors Motion One's behavior).
  for (const animation of animations) {
    try {
      animation.commitStyles();
    } catch {
      // commitStyles throws for elements that are not rendered — safe to ignore.
    }
    animation.cancel();
  }
};

/**
 * Creates a new Animation.
 * @param props The animaiton props.
 * @returns A new `in` and `out` Animation functions.
 */
export const createAnimation = ({ initialStyles, keyframes }: AnimationProps): AnimationFunctions => {
  const isBrowser = typeof window !== 'undefined';

  const waapiKeyframes = buildWaapiKeyframes(keyframes);

  /**
   * Prepares the {@link animateIn} elements by setting the initial styles and rendering them to the DOM.
   * @param elements The elements to prepare.
   * @param options.target If defined, the element will be appended to the target.
   * @param options.insertAfter A child of the target. If defined, the element will be appended right after this anchor element.
   */
  const prepareIn: AnimationFunctions['prepareIn'] = (elements, options = {}) => {
    const { target, insertAfter, display = '' } = options;

    if (!Array.isArray(elements)) elements = [elements];

    for (const element of elements) {
      element.style.display = display;
      Object.assign(element.style, initialStyles);

      if (target && insertAfter !== undefined) {
        if (insertAfter) target.insertBefore(element, insertAfter.nextSibling);
        else {
          if (isBrowser && target instanceof HTMLElement) {
            target.insertBefore(element, target.firstChild);
          }
        }
      } else if (target) target.appendChild(element);
    }
  };

  /**
   * In animation.
   * @param elements The elements to animate.
   * @param options.target If defined, the element will be appended to the target.
   * @param options.insertAfter A child of the target. If defined, the element will be appended right after this anchor element.
   * @param options.prepared Defines if the animation has been prepared beforehand, useful to avoid performing double preparation.
   * @param options.stagger If defined, the animation will be staggered using this time value.
   * @param options.animationOptions The main options of the animation.
   * @returns An awaitable promise.
   */
  const animateIn: AnimationFunctions['animateIn'] = async (elements, options = {}) => {
    const { prepared, stagger, duration, easing } = options;

    if (!prepared) prepareIn(elements, options);

    if (!Array.isArray(elements)) elements = [elements];

    await runAnimation(elements, waapiKeyframes, {
      duration,
      easing,
      stagger
    });
  };

  /**
   * Out animation.
   * @param elements The elements to animate.
   * @param options.remove If defined, the element will be removed from the DOM after the animation ends.
   * @param options.stagger If defined, the animation will be staggered using this time value.
   * @param options.animationOptions The main options of the animation.
   * @returns An awaitable promise.
   */
  const animateOut: AnimationFunctions['animateOut'] = async (elements, options = {}) => {
    const { remove, stagger, target, insertAfter, display = 'none', duration, easing } = options;

    if (!Array.isArray(elements)) elements = [elements];

    elements = elements.filter((element) => document.body.contains(element));
    if (!elements.length) return;

    await runAnimation(elements, waapiKeyframes, {
      duration,
      easing,
      stagger,
      direction: 'reverse'
    });

    for (const element of elements) {
      if (target && insertAfter !== undefined) {
        if (insertAfter) target.insertBefore(element, insertAfter.nextSibling);
        else {
          if (isBrowser && target instanceof HTMLElement) {
            target.insertBefore(element, target.firstChild);
          }
        }
      } else if (target) target.appendChild(element);

      if (remove) element.remove();
      else element.style.display = display;
    }
  };

  return { prepareIn, animateIn, animateOut };
};
