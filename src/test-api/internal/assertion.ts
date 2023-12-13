import { AssertionOptions } from './assertion-options';
import ReExecutablePromise from './re-executable-promise';
import { testController, TestControllerPromise } from '../test-controller';
import _ from 'lodash';
import { getLogger } from '../../logger';

export type ElementOf<T> = T extends (infer E)[] ? E : never;
export type Extend<T, E> = T extends E ? E : never;
export type EnsureString<T> = T extends string ? string : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AssertionApi<E = any> {
  currentPromise: Promise<void>;
  // eql(
  //   expected: E,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  eql(expected: E, options?: AssertionOptions): TestControllerPromise;
  // notEql(
  //   unexpected: E,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // notEql(unexpected: E, options?: AssertionOptions): TestControllerPromise;
  // ok(message?: string, options?: AssertionOptions): TestControllerPromise;
  ok(options?: AssertionOptions): TestControllerPromise;
  // notOk(message?: string, options?: AssertionOptions): TestControllerPromise;
  notOk(options?: AssertionOptions): TestControllerPromise;
  // contains<R>(
  //   expected: EnsureString<E> | ElementOf<E> | Extend<E, R>,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  contains<R>(
    expected: EnsureString<E> | ElementOf<E> | Extend<E, R>,
    options?: AssertionOptions
  ): TestControllerPromise;
  // notContains<R>(
  //   unexpected: EnsureString<E> | ElementOf<E> | Extend<E, R>,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  notContains<R>(
    unexpected: EnsureString<E> | ElementOf<E> | Extend<E, R>,
    options?: AssertionOptions
  ): TestControllerPromise;
  // typeOf(
  //   typeName:
  //     | 'function'
  //     | 'object'
  //     | 'number'
  //     | 'string'
  //     | 'boolean'
  //     | 'undefined'
  //     | 'null'
  //     | 'regexp',
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // typeOf(
  //   typeName:
  //     | 'function'
  //     | 'object'
  //     | 'number'
  //     | 'string'
  //     | 'boolean'
  //     | 'undefined'
  //     | 'null'
  //     | 'regexp',
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // notTypeOf(
  //   typeName:
  //     | 'function'
  //     | 'object'
  //     | 'number'
  //     | 'string'
  //     | 'boolean'
  //     | 'undefined'
  //     | 'null'
  //     | 'regexp',
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // notTypeOf(
  //   typeName:
  //     | 'function'
  //     | 'object'
  //     | 'number'
  //     | 'string'
  //     | 'boolean'
  //     | 'undefined'
  //     | 'null'
  //     | 'regexp',
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // gt(
  //   expected: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // gt(expected: number, options?: AssertionOptions): TestControllerPromise;
  // gte(
  //   expected: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // gte(expected: number, options?: AssertionOptions): TestControllerPromise;
  // lt(
  //   expected: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // lt(expected: number, options?: AssertionOptions): TestControllerPromise;
  // lte(
  //   expected: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // lte(expected: number, options?: AssertionOptions): TestControllerPromise;
  // within(
  //   start: number,
  //   finish: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // within(
  //   start: number,
  //   finish: number,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // notWithin(
  //   start: number,
  //   finish: number,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // notWithin(
  //   start: number,
  //   finish: number,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // match(
  //   re: RegExp,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  // match(re: RegExp, options?: AssertionOptions): TestControllerPromise;
  // notMatch(
  //   re: RegExp,
  //   message?: string,
  //   options?: AssertionOptions
  // ): TestControllerPromise;
  notMatch(re: RegExp, options?: AssertionOptions): TestControllerPromise;
}

const logger = getLogger('DEFAULT');
const enterLogger = getLogger('DEBUG_ASSERTIONS_ENTER_LOG_MESSAGES');

export class PromiseAssertions<A> implements AssertionApi<A> {
  currentPromise: Promise<void>;
  actual: Promise<A>;

  constructor(currentPromise: Promise<void>, actual: Promise<A>) {
    this.currentPromise = currentPromise;
    this.actual = actual;
  }
  notMatch(
    re: RegExp,
    options?: AssertionOptions
  ): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering notMatch this.actual=${
        this.actual
      }`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notMatch then regexp='${re}' this.actual=${
              this.actual
            }`
          );
          return this.actual;
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notMatch then regexp='${re}' actualValue=${actualValue}`
          );
          if (re.test(actualValue + '')) {
            cause.message = `\n  Expected:\n${actualValue}\n  To NOT match:\n${re}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        }),
      testController
    );
  }

  contains<R>(
    needle: EnsureString<A> | ElementOf<A> | Extend<A, R>,
    options?: AssertionOptions
  ): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering contains needle='${needle}' this.actual='${
        this.actual
      }'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving contains then needle='${needle}' this.actual='${
              this.actual
            }'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `${new Date().getTime()} PromiseAssertions: re-executing!='${needle}' this.actual='${
                this.actual
              }'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving contains then needle='${needle}' actualValue='${actualValue}'`
          );
          if (
            typeof actualValue === 'string' &&
            actualValue.indexOf(needle + '') !== -1
          ) {
            return Promise.resolve();
          } else if (
            actualValue instanceof Array &&
            actualValue.includes(needle)
          ) {
            return Promise.resolve();
          } else if (
            typeof actualValue === 'object' &&
            typeof needle === 'object' &&
            _.isMatch(actualValue, needle)
          ) {
            return Promise.resolve();
          }

          cause.message = `\n  Expected:\n${actualValue}\n  To Contain:\n${needle}`;
          return Promise.reject(cause);
        }),
      testController
    );
  }
  notContains<R>(
    needle: EnsureString<A> | ElementOf<A> | Extend<A, R>,
    options?: AssertionOptions
  ): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering notContains needle='${needle}' this.actual='${
        this.actual
      }'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notContains then needle='${needle}' this.actual='${
              this.actual
            }'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `${new Date().getTime()} PromiseAssertions: re-executing!='${needle}' this.actual='${
                this.actual
              }'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notContains then needle='${needle}' actualValue='${actualValue}'`
          );
          if (
            typeof actualValue === 'string' &&
            actualValue.indexOf(needle + '') === -1
          ) {
            return Promise.resolve();
          } else if (
            actualValue instanceof Array &&
            !actualValue.includes(needle)
          ) {
            return Promise.resolve();
          } else if (
            typeof actualValue === 'object' &&
            typeof needle === 'object' &&
            !_.isMatch(actualValue, needle)
          ) {
            return Promise.resolve();
          }

          cause.message = `\n  Expected:\n${actualValue}\n  To NOT Contain:\n${needle}`;
          return Promise.reject(cause);
        }),
      testController
    );
  }

  eql(expected: A, options?: AssertionOptions): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering eql expected='${expected}' this.actual='${
        this.actual
      }'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving eql then expected='${expected}' this.actual='${
              this.actual
            }'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `${new Date().getTime()} PromiseAssertions: re-executing!='${expected}' this.actual='${
                this.actual
              }'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving eql then expected='${expected}' actualValue='${actualValue}'`
          );
          if (actualValue !== expected) {
            cause.message = `\n  Expected:\n${expected}\n  Actual:\n${actualValue}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        }),
      testController
    );
  }
  ok(options?: AssertionOptions): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering ok this.actual=${
        this.actual
      }`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving ok then this.actual=${
              this.actual
            }`
          );
          if (this.actual instanceof ReExecutablePromise) {
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving ok then actualValue=${actualValue}`
          );
          if (!actualValue) {
            cause.message = `\n  Expected:\nTruthy\n  Actual:\n${actualValue}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        }),
      testController
    );
  }
  notOk(options?: AssertionOptions): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `${new Date().getTime()} PromiseAssertions: entering notOk this.actual=${
        this.actual
      }`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notOk then this.actual=${
              this.actual
            }`
          );
          return this.actual;
        })
        .then((actualValue: A) => {
          logger.debug(
            `${new Date().getTime()} PromiseAssertions: resolving notOk then actualValue=${actualValue}`
          );
          if (actualValue) {
            cause.message = `\n  Expected:\nFalsy\n  Actual:\n${actualValue}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        }),
      testController
    );
  }
}
