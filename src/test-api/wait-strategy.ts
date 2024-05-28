import { waitForClickEnd } from './wait-for-click-end';
import { waitForPassageEnd } from './wait-for-passage-end';

export type WaitStrategy = (
  debugNote?: string,
  timeoutMillis?: number
) => Promise<void>;
export type WaitStrategyType = ':passageend' | 'click end' | WaitStrategy;

export const buildWaitStrategy = (
  waitStrategyType: WaitStrategyType
): WaitStrategy => {
  switch (waitStrategyType) {
    case ':passageend':
      return waitForPassageEnd;
    case 'click end':
      return waitForClickEnd;
    default:
      return waitStrategyType;
  }
};
