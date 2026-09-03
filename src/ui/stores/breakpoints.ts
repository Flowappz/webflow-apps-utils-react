import { writable } from './store';

export type Breakpoint = {
  name: string;
  value: number;
  duration: number;
  enabled: boolean;
};

export type BreakpointOutput = {
  [breakpoint: number]: number;
};

export const breakpointsStore = writable<BreakpointOutput>({});
