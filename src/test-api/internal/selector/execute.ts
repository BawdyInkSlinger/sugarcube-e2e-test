import { getLogger } from '../../../logging/logger';
import { unreachableStatement } from '../unreachable-statement';
import { selectorToStringBuilder } from './selector-to-string-builder';

const executionLogger = getLogger('DEBUG_SELECTOR_EXECUTION_LOG_MESSAGES');

export type ExecutionStep =
  | { action: 'jQuerySelector'; value: string; toString: () => string }
  | {
      action: 'filter';
      value: (
        this: HTMLElement,
        index: number,
        element: HTMLElement
      ) => boolean;
      toString: () => string;
    }
  | { action: 'nth'; value: number; toString: () => string }
  | { action: 'parent'; toString: () => string };

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
    } else if (executionStep.action === 'nth') {
      executionLogger.debug(`executionSteps nth='${executionStep}'`);
      jQuery = $(jQuery[executionStep.value]);
    } else if (executionStep.action === 'parent') {
      executionLogger.debug(`executionSteps parent='${executionStep}'`);
      jQuery = $(jQuery.parent());
    } else {
      return unreachableStatement(executionStep);
    }
  });
  return jQuery;
};

const combineAdjacentSelectors = (executionSteps: ExecutionStep[]) => {
  return executionSteps.reduce(
    (prev: ExecutionStep[], curr: ExecutionStep): ExecutionStep[] => {
      const previousStep = prev.length > 0 ? prev[prev.length - 1] : undefined;
      if (
        previousStep?.action === 'jQuerySelector' &&
        curr.action === 'jQuerySelector'
      ) {
        previousStep.value = previousStep.value + curr.value;
        return prev;
      }
      return prev.concat([curr]);
    },
    []
  );
};
