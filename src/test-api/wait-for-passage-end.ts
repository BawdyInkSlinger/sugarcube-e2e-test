import { getLogger } from '../logging/logger';

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function waitForPassageEnd(debugNote = '') {
  enterLogger.debug(
    `waitForPassageEnd: entering waitForPassageEnd debugNote=${debugNote}`
  );
  return Promise.race([
    new Promise<void>((resolve) => {
      $(document).one(':passageend', function () {
        logger.debug(
          `waitForPassageEnd: resolving waitForPassageEnd :passageend debugNote=${debugNote}`
        );
        resolve();
      });
    }),
    new Promise<void>((resolve) => {
      $(document).one(':clickdone', function () {
        logger.debug(
          `waitForPassageEnd: resolving waitForPassageEnd :clickdone debugNote=${debugNote}`
        );
        resolve();
      });
    }),
  ]).then(() => {
    logger.debug(
      `waitForPassageEnd: resolving waitForPassageEnd then debugNote=${debugNote}`
    );
  });
}
