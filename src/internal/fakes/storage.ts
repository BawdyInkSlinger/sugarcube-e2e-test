// This comes from sugarcube.js

import { Adapter } from './adapter';

// eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
let _storage: Adapter = {} as any;

globalThis.storage = {
  get(): Adapter {
    return _storage;
  },
  set(val: Adapter) {
    _storage = val;
  },
};

// sugarcube reassigns storage in some places. You can't reassign to imports. Importing the container is the workaround.
export const StorageContainer = {
  storage: globalThis.storage,
};
