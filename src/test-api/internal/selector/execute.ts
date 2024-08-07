import { getLogger } from '../../../logging/logger';
import { unreachableStatement } from '../unreachable-statement';
import { selectorToStringBuilder } from './selector-to-string-builder';

const executionLogger = getLogger('DEBUG_SELECTOR_EXECUTION_LOG_MESSAGES');

export type ExecutionStep = Readonly<
  | { action: 'jQuerySelector'; value: string; toString: () => string }
  | {
      action: 'function';
      implementation: (jQuery: JQuery<HTMLElement>) => JQuery<HTMLElement>;
      toString: () => string;
    }
  | {
      action: 'filter';
      value: (
        this: HTMLElement,
        index: number,
        element: HTMLElement
      ) => boolean;
      toString: () => string;
    }
>;

export const execute = (executionSteps: ExecutionStep[]) => {
  const selectorToString = selectorToStringBuilder(executionSteps);

  if (executionLogger.isInfoEnabled()) {
    executionLogger.info(`execute selector: ${selectorToString()}`);
  }
  let jQuery = $(); // noop

  combineAdjacentSelectors(executionSteps).forEach((executionStep, index) => {
    executionLogger.debug(`executionSteps index='${index}'`);
    if (executionStep.action === 'jQuerySelector') {
      executionLogger.debug(`executionSteps jQuerySelector='${executionStep}'`);
      if (index === 0) {
        executionLogger.debug(
          `executionSteps execute='$(${executionStep.value})'`
        );
        jQuery = $(executionStep.value);
      } else {
        executionLogger.debug(
          `executionSteps execute='currentJQuery.find(${executionStep.value})'`
        );
        jQuery = jQuery.find(executionStep.value);
      }
    } else if (executionStep.action === 'filter') {
      executionLogger.debug(`executionSteps filter='${executionStep}'`);
      jQuery = jQuery.filter(executionStep.value);
    } else if (executionStep.action === 'function') {
      executionLogger.debug(`executionSteps function='${executionStep}'`);
      jQuery = executionStep.implementation(jQuery);
    } else {
      return unreachableStatement(executionStep);
    }
  });
  return jQuery;
};

const combineAdjacentSelectors = (executionSteps: ExecutionStep[]) => {
  const combinedSelectors: ExecutionStep[] = [];

  for (let index = 0; index < executionSteps.length; index++) {
    const currentStep = executionSteps[index];

    const latestCombinedStep =
      combinedSelectors.length > 0
        ? combinedSelectors[combinedSelectors.length - 1]
        : undefined;

    if (
      latestCombinedStep?.action === 'jQuerySelector' &&
      currentStep.action === 'jQuerySelector'
    ) {
      combinedSelectors[combinedSelectors.length - 1] = {
        action: 'jQuerySelector',
        value: latestCombinedStep.value + currentStep.value,
        toString: () => latestCombinedStep.value + currentStep.value,
      };
    } else {
      combinedSelectors.push(currentStep);
    }
  }

  return combinedSelectors;
};
//   return executionSteps.reduce(
//     (prev: ExecutionStep[], curr: ExecutionStep): ExecutionStep[] => {
//       const previousStep = prev.length > 0 ? prev[prev.length - 1] : undefined;
//       if (
//         previousStep?.action === 'jQuerySelector' &&
//         curr.action === 'jQuerySelector'
//       ) {
//         previousStep.value = previousStep.value + curr.value;
//         return prev;
//       }
//       return prev.concat([curr]);
//     },
//     []
//   );
