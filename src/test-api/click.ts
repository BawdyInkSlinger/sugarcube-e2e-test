import { getLogger } from '../logging/logger';
import { ClickActionOptions } from './internal/click-action-options';
import { durationFormat } from './internal/duration-format';
import { PromiseTimeoutError } from './promise-with-timeout';
import { Selector } from './selector';
import {
  TestController,
  TestControllerPromise,
  testController,
} from './test-controller';
import { buildWaitStrategy } from './wait-strategy';

const logger = getLogger('DEFAULT');
const performanceLogger = getLogger('DEBUG_PERFORMANCE');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function click(
  thisAsPromise: Promise<void>,
  selector: Selector,
  { waitFor: waitStrategy = ':passageend' }: ClickActionOptions = {}
): TestControllerPromise {
  const startMillis = Date.now();
  const cause = new Error(`click error`);
  enterLogger.debug(`testController: entering click selector='${selector}'`);

  const asyncClick = thisAsPromise
    .then<void>(() => {
      enterLogger.debug(
        `testController: entering asyncClick selector='${selector}' to wait for ${waitStrategy}`
      );

      const waitUntil = buildWaitStrategy(waitStrategy)(
        `click ${selector.toString()} and wait for ${waitStrategy}`
      );

      logger.debug(`Pre $(${selector.toString()}).trigger('click');`);
      const clickable = selector.execute();
      if (clickable.length === 0) {
        throw new Error(
          `Attempted to click on selector that could not be found: ${selector.toString()}`
        );
      }
      clickable.trigger('click');
      logger.debug(
        `Post $(${selector.toString()}).trigger('click'); Waiting for ${waitStrategy}`
      );

      return waitUntil;
    })
    .catch((err: Error) => {
      err.cause = cause;
      if (err instanceof PromiseTimeoutError) {
        throw new Error(
          `The selector was clicked, but a timeout occurred 
while waiting for a :passageend event. Does this click 
go to a new passage? If not, click with a different wait strategy.`.replace(
            /\n/,
            ''
          ) +
            `\n\ne.g., await t.click(${selector.toString()}, { waitFor: 'click end' })`,
          { cause: err }
        );
      }
      throw err;
    })
    .finally(() => {
      const endMillis = Date.now();
      performanceLogger.isDebugEnabled() &&
        performanceLogger.debug(
          `click performance: ${durationFormat(startMillis, endMillis)}`
        );
    });
  return Object.assign(asyncClick, testController);
}
