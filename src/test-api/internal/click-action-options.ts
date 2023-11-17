import { ActionOptions } from './action-options';
import { KeyModifiers } from './key-modifiers';

export interface ClickActionOptions extends MouseActionOptions {
  /**
   * The initial caret position if the action is performed on a text input field. A zero-based integer.
   * The default is the length of the input field content.
   */
  caretPos?: number;
}

interface OffsetOptions extends ActionOptions {
  /**
   * Mouse pointer X coordinate that define a point where the action is performed or started.
   * If an offset is a positive integer, coordinates are calculated relative to the top-left corner of the target element.
   * If an offset is a negative integer, they are calculated relative to the bottom-right corner.
   * The default is the center of the target element.
   */
  offsetX?: number;
  /**
   * Mouse pointer Y coordinate that define a point where the action is performed or started.
   * If an offset is a positive integer, coordinates are calculated relative to the top-left corner of the target element.
   * If an offset is a negative integer, they are calculated relative to the bottom-right corner.
   * The default is the center of the target element.
   */
  offsetY?: number;
}

interface MouseActionOptions extends OffsetOptions {
  /**
   * Indicate which modifier keys are to be pressed during the mouse action.
   */
  modifiers?: KeyModifiers;
}
