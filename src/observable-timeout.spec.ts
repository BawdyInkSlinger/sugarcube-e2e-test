import './test-api/internal/monkey-patching/jsdom/strings';
import { getObservableTimeouts, observeTimeout } from './observable-timeout';
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
});
