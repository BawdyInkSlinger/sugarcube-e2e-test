import { getLogger } from '../logger';

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function waitForPassageEnd(debugNote = '') {
  enterLogger.debug(
    `${new Date().getTime()} waitForPassageEnd: entering waitForPageLoad debugNote=${debugNote}`
  );
  return new Promise<void>((resolve) => {
    $(document).one(':passageend', function () {
      logger.debug(
        `${new Date().getTime()} waitForPassageEnd: resolving waitForPassageEnd debugNote=${debugNote}`
      );
      resolve();
    });
  });
}
