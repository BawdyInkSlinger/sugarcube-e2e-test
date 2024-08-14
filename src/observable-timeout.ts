/**
 * This code wraps setTimeout, dispatching triggers for its lifecycle events.
 * It is meant to be used as an alternative to direct setTimeout calls, since
 * the setTimeout lifecycle does not trigger events.
 */

import { Branded } from './internal/utils/branded';
import { getLogger } from './logging/logger';

const logger = getLogger('DEBUG_TRIGGER_TIMEOUT'); // TODO: Rename

type TimeoutID = Branded<string, 'TimeoutID'>;
declare function setTimeout<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  ms?: number,
  ...args: TArgs
): TimeoutID;
declare function setTimeout(
  callback: (args: void) => void,
  ms?: number
): TimeoutID;
type ClearTimeoutFunction = () => Promise<TimeoutID>;
export type TimeoutData = {
  cancelTimeout: ClearTimeoutFunction;
  timeoutIdentifier: TimeoutID;
  context: string;
  status: `completed` | `canceled` | `rejected` | `pending`;
};
export type CancelablePromise = Promise<TimeoutData> &
  Pick<TimeoutData, 'cancelTimeout'>;

const timers = new Map<TimeoutID, CancelablePromise>();

export function getObservableTimeouts(): CancelablePromise[] {
  return [...timers.values()];
}

export function observeTimeout<Params extends unknown[]>(
  context: string,
  functionRef: (...params: Params) => void,
  delay: number,
  ...params: Params
): TimeoutData {
  const source = new Error();

  let timeoutId: TimeoutID | undefined = undefined;
  let result: TimeoutData | undefined = undefined;
  const p: CancelablePromise = new Promise<TimeoutData>((resolve, reject) => {
    timeoutId = setTimeout(setTimeoutWithTrigger, delay);
    result = {
      cancelTimeout: () => {
        if (result.status !== 'pending') {
          source.cause = new Error(
            buildLogMessage(
              `trigger cancelTimeout on a timer that's already ${result.status}:`
            )
          );
          throw source;
        }

        timers.delete(timeoutId);
        clearTimeout(timeoutId);
        result.status = `canceled`;
        logger.debug(buildLogMessage(`trigger cancelTimeout for`));
        resolve(result);
        return Promise.resolve(timeoutId);
      },
      timeoutIdentifier: timeoutId,
      context,
      status: `pending`,
    };
    logger.debug(buildLogMessage(`trigger createtimeout for`));

    function setTimeoutWithTrigger() {
      try {
        functionRef(...params);
      } catch (ex: unknown) {
        result.status = 'rejected';
        if (ex instanceof Error) {
          source.cause = ex;
        } else {
          const cause = new Error(ex + '');
          source.cause = cause;
        }
        reject(source);
      } finally {
        timers.delete(timeoutId);
        if (result.status === 'pending') {
          result.status = 'completed';
        }
        logger.debug(buildLogMessage(`trigger completetimeout for`));
        resolve(result);
      }
    }

    function buildLogMessage(prefix: string): string {
      return `observeTimeout: ${prefix} '${context.replaceAll(
        /\r/g,
        ''
      )}' delay='${delay}' timeoutID='${timeoutId}' status='${result.status}'`;
    }
  }) as CancelablePromise;
  p.cancelTimeout = result.cancelTimeout;

  timers.set(timeoutId, p);

  return result;
}

export async function clearTimeouts() {
  await Promise.allSettled(
    [...timers.values()].map((cancelablePromise) => {
      return cancelablePromise.cancelTimeout();
    })
  );

  timers.clear();
}
