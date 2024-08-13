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
type ClearTimeoutFunction = () => void;
export type TimeoutData = {
  cancelTimeout: ClearTimeoutFunction;
  timeoutIdentifier: TimeoutID;
  context: string;
  status: `completed` | `canceled` | `rejected` | `pending`;
};

const timers = new Map<TimeoutID, Promise<TimeoutData>>();

export function getObservableTimeouts(): Promise<TimeoutData>[] {
  return [...timers.values()].map((td) => Promise.resolve(td));
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
  const p = new Promise<TimeoutData>((resolve, reject) => {
    timeoutId = setTimeout(setTimeoutWithTrigger, delay);
    result = {
      cancelTimeout: () => {
        clearTimeout(timeoutId);
        logger.debug(
          `observeTimeout: trigger cancelTimeout for '${context.replaceAll(
            /\r/g,
            ''
          )}' delay='${delay}'`
        );
        timers.delete(timeoutId);
        resolve(result);
      },
      timeoutIdentifier: timeoutId,
      context,
      status: `pending`,
    };

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
        logger.debug(
          `observeTimeout: trigger completetimeout for '${context.replaceAll(
            /\r/g,
            ''
          )}' delay='${delay}'`
        );
        timers.delete(timeoutId);
        if (result.status !== 'rejected') {
          result.status = 'completed';
        }
        resolve(result);
      }
    }

    logger.debug(
      `observeTimeout: trigger createtimeout for '${context.replaceAll(
        /\r/g,
        ''
      )}' delay='${delay}'`
    );
  });

  timers.set(timeoutId, p);

  return result;
}

export async function clearTimeouts() {
  void [...timers.values()].map(async (timerData: Promise<TimeoutData>) =>
    (await timerData).cancelTimeout()
  );
  timers.clear();
}
