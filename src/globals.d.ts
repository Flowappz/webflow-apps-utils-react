declare module '*.css';

declare module 'just-debounce' {
  const debounce: <T extends (...args: never[]) => unknown>(
    fn: T,
    wait?: number,
    callFirst?: boolean
  ) => T & { cancel?: () => void };
  export default debounce;
}
