import { getLogger } from '../../../logger';

const executionLogger = getLogger('DEBUG_SELECTOR_EXECUTION_LOG_MESSAGES');

export type ExecutionStep =
  | { action: 'jQuerySelector'; value: string; toString: () => string }
  | { action: 'nth'; value: number; toString: () => string };

export const execute = (executionSteps: ExecutionStep[]) => {
  function selectorToString(): string {
    return `Selector(\`${executionSteps.join('')}\`)`;
  }

  if (executionLogger.isInfoEnabled()) {
    executionLogger.info(`execute selector: ${selectorToString()}`);
  }
  let currentJQuery = $(); // noop

  const squashedExecutionSteps = executionSteps.reduce(
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

  squashedExecutionSteps.forEach((executionStep, index) => {
    executionLogger.debug(`executionSteps index='${index}'`);
    if (executionStep.action === 'jQuerySelector') {
      executionLogger.debug(`executionSteps jQuerySelector='${executionStep}'`);
      if (index === 0) {
        executionLogger.debug(
          `executionSteps execute='$(${executionStep.value})'`
        );
        currentJQuery = $(executionStep.value);
      } else {
        executionLogger.debug(
          `executionSteps execute='currentJQuery.find(${executionStep.value})'`
        );
        currentJQuery = currentJQuery.find(executionStep.value);
      }
    } else if (executionStep.action === 'nth') {
      executionLogger.debug(`executionSteps nth='${executionStep}'`);
      currentJQuery = $(currentJQuery[executionStep.value]);
    }
  });
  return currentJQuery;
};
