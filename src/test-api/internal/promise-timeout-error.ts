export class PromiseTimeoutError extends Error {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
  timeoutMillis: number;

  constructor(timeoutMillis: number, message?: string, options?: ErrorOptions) {
    super(message ?? `Timed out after ${timeoutMillis} ms.`, options);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PromiseTimeoutError);
    }

    this.name = 'PromiseTimeoutError';
    this.timeoutMillis = timeoutMillis;
  }
}
