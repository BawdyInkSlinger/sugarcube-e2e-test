import './test-api/internal/monkey-patching/jsdom/strings';
import { clearTimeouts, getObservableTimeouts, observeTimeout } from './observable-timeout';
import {
  ResourceLoaderConstructorOptions,
  ResourceLoader,
  AbortablePromise,
  FetchOptions,
} from 'jsdom';

describe('Observable Timeout', () => {
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

    await clearTimeouts()

    expect(getObservableTimeouts()).toEqual([]);
  });
});
