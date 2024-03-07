import { ExecutionStep } from './execute';

export const selectorToStringBuilder = (
  executionSteps: ExecutionStep[]
): (() => string) => {
  return () => {
    return `Selector(\`${executionSteps.join('')}\`)`;
  };
};
