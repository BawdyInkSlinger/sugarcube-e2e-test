import './test-api/internal/monkey-patching/jsdom/strings';
import {
  clearTimeouts,
  getObservableTimeouts,
  observeTimeout,
} from './observable-timeout';

fdescribe('Observable Timeout', () => {
  beforeEach(async () => {
    await clearTimeouts();
  });

  it('has status of pending when timeout is created', async () => {
    const data = observeTimeout('1', () => {}, 1);

    expect(data.status).toEqual(`pending`);
  });

  it('has status of completed when timeout completes', async () => {
    const data = observeTimeout('2', () => {}, 1);

    await Promise.all(getObservableTimeouts());

    expect(data.status).toEqual(`completed`);
  });

  it('has status of rejected when timeout throws an error', async () => {
    let data: any;
    try {
      data = observeTimeout(
        '3',
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
  
  it('has status of rejected when timeout throws an error then it is cleared', async () => {
    let data: any;
    try {
      data = observeTimeout(
        '3',
        () => {
          throw new Error(`intentional`);
        },
        1
      );

      await Promise.all(getObservableTimeouts());
    } catch (ex) {
      expect(ex.cause.message).toEqual(`intentional`);
    }

    await data.cancelTimeout();
    
    expect(data.status).toEqual(`rejected`);
  });

  it('has status of canceled when timeout cleared', async () => {
    const data = observeTimeout('4', () => {}, 1);

    await data.cancelTimeout();
    await Promise.all(getObservableTimeouts());

    expect(data.status).toEqual(`canceled`);
  });

  it('has status of completed when timeout is cleared after it finishes', async () => {
    const data = observeTimeout('5', () => {}, 1);

    await Promise.all(getObservableTimeouts());
    await data.cancelTimeout();

    expect(data.status).toEqual(`completed`);
  });

  it('Promise.all waits for all timeouts to complete', async () => {
    observeTimeout('6', () => {}, 1);
    observeTimeout('7', () => {}, 2);
    observeTimeout('8', () => {}, 3);

    await Promise.all(getObservableTimeouts());

    expect(getObservableTimeouts()).toEqual([]);
  });

  it('contains timers if you do not Promise.all', async () => {
    observeTimeout('9', () => {}, 1);
    observeTimeout('10', () => {}, 2);
    observeTimeout('11', () => {}, 3);

    expect(getObservableTimeouts().length).not.toEqual(0);
  });

  it('lets you clear timeouts', async () => {
    observeTimeout('12', () => {}, 1);
    observeTimeout('13', () => {}, 2);
    observeTimeout('14', () => {}, 3);

    await clearTimeouts();

    expect(getObservableTimeouts()).toEqual([]);
  });
});
