import {
  DEBUG,
  DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES,
} from '../constants';

export function waitForPassageEnd(debugNote = '') {
  DEBUG &&
    DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES &&
    console.log(
      `${new Date().getTime()} waitForPassageEnd: entering waitForPageLoad debugNote=${debugNote}`
    );
  return new Promise<void>((resolve) => {
    $(document).one(':passageend', function () {
      DEBUG &&
        console.log(
          `${new Date().getTime()} waitForPassageEnd: resolving waitForPassageEnd debugNote=${debugNote}`
        );
      resolve();
    });
  });
}
