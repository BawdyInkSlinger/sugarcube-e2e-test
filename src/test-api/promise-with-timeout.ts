import { getLogger } from '../logging/logger';

const logger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export async function promiseWithTimeout<PR>(
  millis: number,
  promise: Promise<PR>
): Promise<PR> {
  const cause = new Error();
  let timeoutPid: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<PR>((_resolve, reject) => {
    logger.debug(`entering timeout promise. millis='${millis}'`);
    timeoutPid = setTimeout(() => {
      logger.debug(`rejecting timeout promise`);
      reject(new PromiseTimeoutError(millis, undefined, { cause }));
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

export class PromiseTimeoutError extends Error {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
  timeoutMillis: number;

  constructor(timeoutMillis: number, message?: string, options?: ErrorOptions) {
    super(message ?? `Timed out after ${timeoutMillis} ms.`, options);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PromiseTimeoutError);
    }

    this.name = 'PromiseTimeoutError';
    this.timeoutMillis = timeoutMillis;
  }
}
