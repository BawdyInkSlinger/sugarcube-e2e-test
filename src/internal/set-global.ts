export const setGlobal = <T>(globalPropertyKey: string, globalPropertyValue: T) => {
  globalThis[globalPropertyKey] = globalPropertyValue;
  global[globalPropertyKey] = globalPropertyValue;
  window[globalPropertyKey] = globalPropertyValue;
}