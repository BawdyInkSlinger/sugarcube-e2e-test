import { getLogger } from '../logging/logger';
import { promiseWithTimeout } from './promise-with-timeout';

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function waitForClickEnd(debugNote = '', timeoutMillis = 2000) {
  const cause = new Error(
    `Timeout after ${timeoutMillis}ms. debugNote=${debugNote}`
  );
  enterLogger.debug(
    `waitForClickEnd: entering waitForClickEnd debugNote=${debugNote}`
  );
  return promiseWithTimeout(
      timeoutMillis,
      // todo: just return this instead of promiseWithTimeout?
    new Promise<void>((resolve) => {
      setTimeout(() => {
        logger.debug(
          `waitForClickEnd: resolving waitForClickEnd :passageend debugNote=${debugNote}`
        );
        resolve();
      }, 1); // wait until the effects of the click render
    })
  ).then(
    () => {
      logger.debug(
        `waitForClickEnd: resolving waitForClickEnd then debugNote=${debugNote}`
      );
    },
    (reason) => {
      reason.cause = cause;
      throw reason;
    }
  );
}
