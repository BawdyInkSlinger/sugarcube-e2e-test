import { getLogger } from '../logging/logger';
import {
  PromiseTimeoutError,
  promiseWithTimeout,
} from './promise-with-timeout';

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function waitForPassageEnd(debugNote = '', timeoutMillis = 2000) {
  const cause = new Error(
    `Timeout after ${timeoutMillis}ms. debugNote=${debugNote}`
  );
  enterLogger.debug(
    `waitForPassageEnd: entering waitForPassageEnd debugNote=${debugNote}`
  );
  return promiseWithTimeout(
    timeoutMillis,
    new Promise<void>((resolve) => {
      $(document).one(':passageend', function () {
        logger.debug(
          `waitForPassageEnd: resolving waitForPassageEnd :passageend debugNote=${debugNote}`
        );
        resolve();
      });
    })
  )
    .catch((err: Error) => {
      if (err instanceof PromiseTimeoutError) {
        throw new Error(
          `The selector was clicked, but a timeout occurred 
while waiting for a :passageend event. Does this click 
go to a new passage? If not, click with a different wait strategy.`.replace(
            /\n/,
            ''
          ) +
            `\n\ne.g., await t.click(Selector('.passage button'), { waitFor: 'click end' })`,
          { cause: err }
        );
      }
      throw err;
    })
    .then(() => {
      logger.debug(
        `waitForPassageEnd: resolving waitForPassageEnd then debugNote=${debugNote}`
      );
    });
}
