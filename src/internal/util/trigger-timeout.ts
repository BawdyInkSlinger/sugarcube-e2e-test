/**
 * This code wraps setTimeout, dispatching triggers for its lifecycle events.
 * It is meant to be used as an alternative to direct setTimeout calls, since
 * the setTimeout lifecycle does not trigger events.
 */

import { DEBUG, DEBUG_TRIGGER_TIMEOUT } from '../../constants';
import { Branded } from './branded';

type LastTimeoutEvent = 'created' | 'completed' | 'cleared';
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

const timers = new Map<TimeoutData, LastTimeoutEvent>();
export function triggerTimeout<Params extends unknown[]>(
  context: string,
  functionRef: (...params: Params) => void,
  delay: number,
  ...params: Params
): TimeoutData {
  const cause = DEBUG ? new Error() : undefined;
  const timeoutId = setTimeout(setTimeoutWithTrigger, delay);
  const result = {
    cancelTimeout: () => {
      clearTimeout(timeoutId);
      DEBUG &&
        DEBUG_TRIGGER_TIMEOUT &&
        console.log(
          `${new Date().getTime()} triggerTimeout: trigger :cleartimeout for '${context.replaceAll(
            /\r/g,
            ''
          )}' delay='${delay}'`
        );
      timers.set(result, 'cleared');
      jQuery.event.trigger(':cleartimeout', result);
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
      DEBUG &&
        DEBUG_TRIGGER_TIMEOUT &&
        console.log(
          `${new Date().getTime()} triggerTimeout: trigger :completetimeout for '${context.replaceAll(
            /\r/g,
            ''
          )}' delay='${delay}'`
        );
      timers.set(result, 'completed');
      jQuery.event.trigger(':completetimeout', result);
    }
  }

  DEBUG &&
    DEBUG_TRIGGER_TIMEOUT &&
    console.log(
      `${new Date().getTime()} triggerTimeout: trigger :createtimeout for '${context.replaceAll(
        /\r/g,
        ''
      )}' delay='${delay}'`
    );

  timers.set(result, 'created');
  jQuery.event.trigger(':createtimeout', result);

  return result;
}

export function clearTimeouts() {
  [...timers.keys()].forEach((timerData) => timerData.cancelTimeout());
  timers.clear();
}

export function findLastTimeoutEvent(
  cb: (timeoutData: TimeoutData) => boolean
): LastTimeoutEvent | null {
  const timeoutData = [...timers.keys()].find(cb);
  if (timeoutData) {
    return timers.get(timeoutData);
  }
  return null;
}
