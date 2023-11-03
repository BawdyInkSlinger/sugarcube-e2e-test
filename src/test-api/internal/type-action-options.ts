import { ClickActionOptions } from './click-action-options';

export interface TypeActionOptions extends ClickActionOptions {
  /**
   * `true` to remove the current text in the target element, and false to leave the text as it is.
   */
  replace?: boolean;
  /**
   * `true` to insert the entire block of current text in a single keystroke (similar to a copy & paste function),
   * and false to insert the current text character by character.
   */
  paste?: boolean;
  /**
   * `true` to replace the typed text with a placeholder when sending action logs to a reporter.
   */
  confidential?: boolean;
}