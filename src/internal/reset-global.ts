import { getLogger } from '../logger';

const logger = getLogger();

export const resetGlobal = <T>(
  globalPropertyKey: string,
  globalPropertyValue: T
) => {
  if (
    globalThis[globalPropertyKey] &&
    'reset' in globalThis[globalPropertyKey] &&
    typeof globalThis[globalPropertyKey].reset === 'function'
  ) {
    logger.debug(
      `Calling \`globalThis[${globalPropertyKey}].reset()\` because the global already exists.`
    );
    globalThis[globalPropertyKey].reset();
  }
  if (
    globalThis[globalPropertyKey] &&
    'restart' in globalThis[globalPropertyKey] &&
    typeof globalThis[globalPropertyKey].restart === 'function'
  ) {
    logger.debug(
      `Calling \`globalThis[${globalPropertyKey}].restart()\` because the global already exists.`
    );
    globalThis[globalPropertyKey].restart();
  }
  globalThis[globalPropertyKey] = globalPropertyValue;
  global[globalPropertyKey] = globalPropertyValue;
  window[globalPropertyKey] = globalPropertyValue;
};
