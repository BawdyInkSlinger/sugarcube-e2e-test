import { getLogger } from '../logging/logger';

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
    logMessage(globalPropertyKey, 'reset');
    globalThis[globalPropertyKey].reset();
  }
  if (
    globalThis[globalPropertyKey] &&
    'restart' in globalThis[globalPropertyKey] &&
    typeof globalThis[globalPropertyKey].restart === 'function'
  ) {
    logMessage(globalPropertyKey, 'restart');
    globalThis[globalPropertyKey].restart();
  }
  globalThis[globalPropertyKey] = globalPropertyValue;
  global[globalPropertyKey] = globalPropertyValue;
  window[globalPropertyKey] = globalPropertyValue;
};

const logMessage = (
  globalPropertyKey: string,
  functionName: 'reset' | 'restart'
): void => {
  const prefix = `Calling \`globalThis[${globalPropertyKey}].${functionName}()\` because the global already exists`;
  let postfix = '.';
  if (logger.isDebugEnabled()) {
    postfix = `: ${JSON.stringify(globalThis[globalPropertyKey])}`;
  }

  const message = prefix + postfix;
  if (logger.isInfoEnabled()) {
    logger.info(message);
  } else if (logger.isDebugEnabled()) {
    logger.debug(message);
  }
};
