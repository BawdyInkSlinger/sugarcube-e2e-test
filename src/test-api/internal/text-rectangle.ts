export interface TextRectangle {
  /**
   * Y-coordinate, relative to the viewport origin, of the bottom of the rectangle box.
   */
  bottom: number;
  /**
   * X-coordinate, relative to the viewport origin, of the left of the rectangle box.
   */
  left: number;
  /**
   *    X-coordinate, relative to the viewport origin, of the right of the rectangle box.
   */
  right: number;
  /**
   * Y-coordinate, relative to the viewport origin, of the top of the rectangle box.
   */
  top: number;
  /**
   * Width of the rectangle box (This is identical to `right` minus `left`).
   */
  width: number;
  /**
   * Height of the rectangle box (This is identical to `bottom` minus `top`).
   */
  height: number;
}
