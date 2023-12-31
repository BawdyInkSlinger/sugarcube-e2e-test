// This comes from sugarcube.js

import { SugarCubeTemporaryVariables } from '../declarations/twine-sugarcube-copy/userdata';

// this and last line added by BIS to stop side-effects on import
export const initialize = () => {
  // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
  let _tempVariables: SugarCubeTemporaryVariables = Object.create(null);

  globalThis.TempVariables = {
    get() {
      return _tempVariables;
    },
    set(val: typeof _tempVariables) {
      _tempVariables = val;
    },
  };
};

// sugarcube reassigns tempVariables in some places. You can't reassign to imports. Importing the container is the workaround.
export const TempVariablesContainer = {
  TempVariables: globalThis.TempVariables,
};
