export interface AssertionOptions {
  /**
   * The amount of time, in milliseconds, allowed for an assertion to pass before the test fails if a
   * selector property or a client function was used in assertion.
   */
  timeout?: number;
  /**
   * By default, a Promise is not allowed to be passed to an assertion unless it is a selector property
   * or the result of a client function. Setting this property to `true` overrides that default.
   */
  allowUnawaitedPromise?: boolean;
}
