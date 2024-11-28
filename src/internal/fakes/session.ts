// This comes from sugarcube.js

import { Adapter } from './adapter';

let _session: Adapter = null;

const attributes = {
  get(): Adapter {
    return _session;
  },
  set(val: Adapter) {
    _session = val;
  },
};

Object.defineProperty(globalThis, 'session', attributes);

// sugarcube reassigns session in some places. You can't reassign to imports. Importing the container is the workaround and better than using `globalThis.session`.
export const SessionContainer = Object.defineProperty<{ session: Adapter }>(
  { session: undefined },
  'session',
  attributes
);
