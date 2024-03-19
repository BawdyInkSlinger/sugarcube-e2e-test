import { getLogger } from '../logging/logger';

const logger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export async function promiseWithTimeout<PR>(
  millis: number,
  promise: Promise<PR>
): Promise<PR> {
  let timeoutPid: ReturnType<typeof setTimeout>;
  const timeout = new Promise<PR>((_resolve, reject) => {
    logger.debug(`entering timeout promise. millis='${millis}'`);
    timeoutPid = setTimeout(() => {
      logger.debug(`rejecting timeout promise`);
      reject(new Error(`Timed out after ${millis} ms.`));
    }, millis);
  });
  return Promise.race([promise, timeout]).finally(() => {
    logger.debug(
      `entering finally. timeoutPid exists? ${timeoutPid !== undefined}`
    );
    if (timeoutPid) {
      clearTimeout(timeoutPid);
    }
  });
}
