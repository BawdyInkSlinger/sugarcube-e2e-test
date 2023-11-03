/* eslint-disable @typescript-eslint/ban-types */
// Taken from testcafe source code
// See https://discord.com/channels/389867840406159362/389956523796725761/1168747794891284571
import { noop } from 'lodash';

type ExecutorFn<T> = <T>(
  resolve: (value?: T) => void,
  reject: (reason?: T) => void
) => void;

export default class ReExecutablePromise<T> extends Promise<T> {
  private readonly _fn: ExecutorFn<T>;
  private _taskPromise: Promise<T> | null;

  public constructor(executorFn: ExecutorFn<T>) {
    super(noop);

    this._fn = executorFn;
    this._taskPromise = null;
  }

  private _ensureExecuting(): void {
    if (this._taskPromise === null) this._taskPromise = new Promise(this._fn);
  }

  public _reExecute(): ReExecutablePromise<T> {
    this._taskPromise = null;

    return this;
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    this._ensureExecuting();

    return (this._taskPromise as Promise<unknown>).then(
      onfulfilled,
      onrejected
    );
  }

  public catch<TResult = never>(
    onrejected?:
      | ((reason: unknown) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult> {
    this._ensureExecuting();

    return this._taskPromise.catch(onrejected);
  }

  public static fromFn<T>(
    asyncExecutorFn: () => T
  ): ReExecutablePromise<T> {
    return new ReExecutablePromise((resolve: Function) =>
      resolve(asyncExecutorFn())
    );
  }
}
