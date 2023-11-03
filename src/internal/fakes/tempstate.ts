// This comes from sugarcube.js
// eslint-disable-next-line prefer-const
let tempState = {
  repeatTimerId: -1,
  break: -1,
  macroTypeQueue: [],
}

globalThis.TempState = {
  get() {
    return tempState;
  },
  set(val: typeof tempState) {
    tempState = val;
  }
}

// sugarcube reassigns TempState in some places. You can't reassign to imports. Importing the container is the workaround.
export const TempStateContainer = {
  TempState: globalThis.TempState
};

globalThis.TempState = tempState;