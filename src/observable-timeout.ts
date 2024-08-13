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
};

const timers: TimeoutData[] = [];

export function getObservableTimeouts(): Promise<TimeoutData>[] {
  return timers.map((td) => Promise.resolve(td));
}

export function observeTimeout<Params extends unknown[]>(
  context: string,
  functionRef: (...params: Params) => void,
  delay: number,
  ...params: Params
): TimeoutData {
  const cause = new Error();
  const timeoutId = setTimeout(setTimeoutWithTrigger, delay);
  const result = {
    cancelTimeout: () => {
      clearTimeout(timeoutId);
      logger.debug(
        `observeTimeout: trigger cancelTimeout for '${context.replaceAll(
          /\r/g,
          ''
        )}' delay='${delay}'`
      );
      timers.push(result);
    },
    timeoutIdentifier: timeoutId,
    context,
  };

  function setTimeoutWithTrigger() {
    try {
      functionRef(...params);
    } catch (ex: unknown) {
      if (ex instanceof Error) {
        if (cause) {
          ex.cause = cause;
        }
        throw ex;
      } else {
        throw new Error(ex + '');
      }
    } finally {
      logger.debug(
        `observeTimeout: trigger completetimeout for '${context.replaceAll(
          /\r/g,
          ''
        )}' delay='${delay}'`
      );
      timers.push(result);
    }
  }

  logger.debug(
    `observeTimeout: trigger createtimeout for '${context.replaceAll(
      /\r/g,
      ''
    )}' delay='${delay}'`
  );

  timers.push(result);

  return result;
}

export function clearTimeouts() {
  [...timers].forEach((timerData) => timerData.cancelTimeout());
  timers.length = 0;
}
