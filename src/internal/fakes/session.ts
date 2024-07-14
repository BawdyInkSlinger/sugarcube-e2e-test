// This comes from sugarcube.js

import { Adapter } from './adapter';

// eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
let _session: Adapter = null;

globalThis.session = {
  get() {
    return _session;
  },
  set(val: Adapter) {
    _session = val;
  },
};

// sugarcube reassigns session in some places. You can't reassign to imports. Importing the container is the workaround.
export const SessionContainer = {
  session: globalThis.session,
};
