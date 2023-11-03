export interface ActionOptions {
  /**
   * The speed of action emulation. Defines how fast TestCafe performs the action when running tests.
   * A value between 1 (the maximum speed) and 0.01 (the minimum speed). If test speed is also specified in the CLI or
   * programmatically, the action speed setting overrides test speed. Default is 1.
   */
  speed?: number;
}