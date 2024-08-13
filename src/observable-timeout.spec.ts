import './test-api/internal/monkey-patching/jsdom/strings';
import {
  clearTimeouts,
  getObservableTimeouts,
  observeTimeout,
} from './observable-timeout';

describe('Observable Timeout', () => {
  it('has status of pending when timeout is created', async () => {
    const data = observeTimeout('a', () => {}, 1);

    expect(data.status).toEqual(`pending`);
  });

  it('has status of completed when timeout completes', async () => {
    const data = observeTimeout('a', () => {}, 1);

    await Promise.all(getObservableTimeouts());

    expect(data.status).toEqual(`completed`);
  });

  it('has status of rejected when timeout throws an error', async () => {
    let data: any;
    try {
      data = observeTimeout(
        'a',
        () => {
          throw new Error(`intentional`);
        },
        1
      );

      await Promise.all(getObservableTimeouts());
    } catch (ex) {
      expect(ex.cause.message).toEqual(`intentional`);
    }
    expect(data.status).toEqual(`rejected`);
  });

  it('Promise.all waits for all timeouts to complete', async () => {
    observeTimeout('a', () => {}, 1);
    observeTimeout('b', () => {}, 2);
    observeTimeout('c', () => {}, 3);

    await Promise.all(getObservableTimeouts());

    expect(getObservableTimeouts()).toEqual([]);
  });

  it('contains timers if you do not Promise.all', async () => {
    observeTimeout('a', () => {}, 1);
    observeTimeout('b', () => {}, 2);
    observeTimeout('c', () => {}, 3);

    expect(getObservableTimeouts().length).not.toEqual(0);
  });

  it('lets you clear timeouts', async () => {
    observeTimeout('a', () => {}, 1);
    observeTimeout('b', () => {}, 2);
    observeTimeout('c', () => {}, 3);

    await clearTimeouts();

    expect(getObservableTimeouts()).toEqual([]);
  });
});
