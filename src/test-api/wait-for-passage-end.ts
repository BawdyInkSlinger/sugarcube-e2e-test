import { getLogger } from '../logging/logger';
import { getObservableTimeouts } from '../observable-timeout';
import { promiseWithTimeout } from './internal/promise-with-timeout';

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export async function waitForPassageEnd(debugNote = '', timeoutMillis = 2000) {
  enterLogger.debug(
    `waitForPassageEnd: entering waitForPassageEnd debugNote=${debugNote}`
  );

  const waitForPassageEndPromise = new Promise<void>((resolve) => {
    $(document).one(':passageend', function () {
      logger.debug(
        `waitForPassageEnd: resolving waitForPassageEnd :passageend debugNote=${debugNote}`
      );
      resolve();
    });
  });

  await promiseWithTimeout(
    timeoutMillis,
    waitForPassageEndPromise.then(() =>
      Promise.allSettled(getObservableTimeouts())
    )
  );

  logger.debug(
    `waitForPassageEnd: resolving waitForPassageEnd then debugNote=${debugNote}`
  );
}
