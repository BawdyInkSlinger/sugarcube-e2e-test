import { ActionOptions } from './action-options';

export interface PressActionOptions extends ActionOptions {
  /**
   * `true` to replace the pressed keys with a placeholder when sending action logs to a reporter.
   */
  confidential?: boolean;
}
