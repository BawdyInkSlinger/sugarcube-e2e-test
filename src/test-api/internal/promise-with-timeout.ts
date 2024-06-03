import { getLogger } from '../../logging/logger';
import { PromiseTimeoutError } from './error/promise-timeout-error';

const logger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export async function promiseWithTimeout<PR>(
  millis: number,
  promise: Promise<PR>
): Promise<PR> {
  let timeoutPid: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<PR>((_resolve, reject) => {
    logger.debug(`entering timeout promise. millis='${millis}'`);
    timeoutPid = setTimeout(() => {
      logger.debug(`rejecting timeout promise`);
      reject(new PromiseTimeoutError(millis, undefined));
    }, millis);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    logger.debug(
      `entering finally. timeoutPid exists? ${timeoutPid !== undefined}`
    );
    if (timeoutPid) {
      clearTimeout(timeoutPid);
    }
  });
}

