import { writable, type Writable } from '../../ui/stores/store';

export const routerStore: Writable<{
  hash: string;
  url: URL | null;
}> = writable({
  hash: '',
  url: typeof window !== 'undefined' ? new URL(window.location.href) : null
});
