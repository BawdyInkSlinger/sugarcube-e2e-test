import { getLogger } from '../logging/logger';
import { ClickActionOptions } from './internal/click-action-options';
import { durationFormat } from './internal/duration-format';
import { PromiseTimeoutError } from './internal/error/promise-timeout-error';
import { Selector } from './selector';
import { TestControllerPromise, testController } from './test-controller';
import { waitForClickEnd } from './wait-for-click-end';
import { waitForPassageEnd } from './wait-for-passage-end';

const logger = getLogger('DEFAULT');
const performanceLogger = getLogger('DEBUG_PERFORMANCE');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');

export function click(
  thisAsPromise: Promise<void>,
  selector: Selector,
  { waitFor: waitStrategy = ':passageend' }: ClickActionOptions = {}
): TestControllerPromise {
  const startMillis = Date.now();
  const source1 = new Error(`Click error`);
  const source2 = new Error(`Click error`);
  enterLogger.debug(`testController: entering click selector='${selector}'`);

  const asyncClick = thisAsPromise
    .then<void>(() => {
      enterLogger.debug(
        `testController: entering asyncClick selector='${selector}' to wait for ${waitStrategy}`
      );

      logger.debug(`Pre $(${selector.toString()}).trigger('click');`);

      const clickableElements = selector.execute();
      // If the element does not exist...
      if (clickableElements.length === 0) {
        source1.cause = new Error(
          `Attempted to click on selector that could not be found: ${selector.toString()}`
        );
        throw source1;
      }

      let waitForPassageEndPromise = undefined;
      // If we are waiting for :passageend, start listening for it BEFORE the click
      if (waitStrategy === `:passageend`) {
        waitForPassageEndPromise = waitForPassageEnd(
          `click ${selector.toString()} and wait for ${waitStrategy}`
        ).catch((err: Error) => {
          if (err instanceof PromiseTimeoutError) {
            source2.cause = new Error(
              `The selector was clicked, but a timeout occurred 
while waiting for a :passageend event. Does this click 
go to a new passage? If not, click with a different wait strategy.`.replace(
                /\n/,
                ''
              ) +
                `\n\ne.g., await t.click(${selector.toString()}, { waitFor: 'click end' })`,
              { cause: err }
            );
          } else {
            source2.cause = err;
          }
          throw source2;
        });
      }

      // Perform the click
      clickableElements.trigger('click');
      logger.debug(
        `Post $(${selector.toString()}).trigger('click'); Waiting for ${waitStrategy}`
      );

      return (
        waitForPassageEndPromise ??
        waitForClickEnd(
          `click ${selector.toString()} and wait for ${waitStrategy}`
        )
      );
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
