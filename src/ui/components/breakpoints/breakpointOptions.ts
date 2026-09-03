import {
  DesktopWithStar,
  MobileLandscape,
  MobilePortrait,
  TabletPreview,
  XL,
  XXL,
  XXXL,
} from '../../icons';

import type { IconComponent } from '../../types';
import type { ALLOWED_BREAKPOINTS } from '../../../types';

type BreakpointOption = {
  label: string;
  description: string;
  icon: IconComponent;
};

export type BreakpointOptions = {
  [K in ALLOWED_BREAKPOINTS]: BreakpointOption;
};

export const breakpointOptions: BreakpointOptions = {
  '320': {
    label: 'Mobile Portrait',
    description:
      'Settings added here will apply at 320px and down, unless they’re edited at a smaller breakpoint',
    icon: MobilePortrait,
  },
  '480': {
    label: 'Mobile Landscape',
    description:
      'Settings added here will apply at 480px and down, unless they’re edited at a smaller breakpoint',
    icon: MobileLandscape,
  },
  '768': {
    label: 'Tablet',
    description:
      'Settings added here will apply at 768px and down, unless they’re edited at a smaller breakpoint',
    icon: TabletPreview,
  },
  '991': {
    label: 'Desktop',
    description:
      'Desktop settings apply at all breakpoints, unless they’re edited on another breakpoint',
    icon: DesktopWithStar,
  },
  '1280': {
    label: 'Desktop Small',
    description:
      'Settings added here will apply at 1280px and down, unless they’re edited at a smaller breakpoint',
    icon: XL,
  },
  '1440': {
    label: 'Desktop Medium',
    description:
      'Settings added here will apply at 1280px and down, unless they’re edited at a smaller breakpoint',
    icon: XXL,
  },
  '1920': {
    label: 'Desktop Large',
    description:
      'Settings added here will apply at 1280px and down, unless they’re edited at a smaller breakpoint',
    icon: XXXL,
  },
};
