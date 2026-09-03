import { writable, type Writable } from '../../ui/stores/store';

export const isPreviewMode: Writable<boolean> = writable(false);
