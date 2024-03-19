import { WaitStrategyType } from '../wait-strategy';

export interface GotoActionOptions {
  waitFor?: Exclude<WaitStrategyType, 'click end'>;
}
