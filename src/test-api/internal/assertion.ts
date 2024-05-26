import chalk from 'chalk';
import { diffChars, diffLines, diffWordsWithSpace } from 'diff';
import { AssertionOptions } from './assertion-options';
import ReExecutablePromise from './re-executable-promise';
import { testController, TestControllerPromise } from '../test-controller';
import _ from 'lodash';
import { getLogger } from '../../logging/logger';
import { splitMatches } from './split-matches';
import { highlightMatches } from './highlight-matches';
import { durationFormat } from './duration-format';

export type ElementOf<T> = T extends (infer E)[] ? E : never;
export type Extend<T, E> = T extends E ? E : never;
export type EnsureString<T> = T extends string ? string : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AssertionApi<E = any> {
  currentPromise: Promise<void>;
  eql(
    expected: E,
    message?: string,
    options?: AssertionOptions
  ): TestControllerPromise;
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
const performanceLogger = getLogger('DEBUG_PERFORMANCE');

export class PromiseAssertions<A> implements AssertionApi<A> {
  currentPromise: Promise<void>;
  actual: Promise<A>;
  startMillis: number;

  constructor(
    currentPromise: Promise<void>,
    actual: Promise<A>,
    startMillis: number
  ) {
    this.currentPromise = currentPromise;
    this.actual = actual;
    this.startMillis = startMillis;
  }
  notMatch(
    re: RegExp,
    options?: AssertionOptions
  ): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `PromiseAssertions: entering notMatch this.actual=${this.actual}`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving notMatch then regexp='${re}' this.actual=${this.actual}`
          );
          return this.actual;
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving notMatch then regexp='${re}' actualValue=${actualValue}`
          );
          const matches = splitMatches(actualValue + '', re);
          if (matches.length > 1) {
            cause.message = `\n  Expected:\n${highlightMatches(
              matches,
              chalk.bgRed
            )}\n  To NOT match:\n${re}`;
            // console.log($(`.passage main`).html());
            // console.log(`actualValue`, JSON.stringify(actualValue));
            // console.log(document.toPrettyString({includeHeadElement: false,
            //     includeSvgBody: false,
            //     selectorsToRemove: [`#before-passage-container`, `#after-passage-container`]}));
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `notMatch performance: ${durationFormat(
                this.startMillis,
                endMillis
              )}`
            );
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
      `PromiseAssertions: entering contains needle='${needle}' this.actual='${this.actual}'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving contains then needle='${needle}' this.actual='${this.actual}'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `PromiseAssertions: re-executing!='${needle}' this.actual='${this.actual}'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving contains then needle='${needle}' actualValue='${actualValue}'`
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
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `contains performance: ${durationFormat(
                this.startMillis,
                endMillis
              )}`
            );
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
      `PromiseAssertions: entering notContains needle='${needle}' this.actual='${this.actual}'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving notContains then needle='${needle}' this.actual='${this.actual}'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `PromiseAssertions: re-executing!='${needle}' this.actual='${this.actual}'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving notContains then needle='${needle}' actualValue='${actualValue}'`
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
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `notContains performance: ${durationFormat(
                this.startMillis,
                endMillis
              )}`
            );
        }),
      testController
    );
  }

  eql(expected: A, options?: AssertionOptions): TestControllerPromise<void>;
  eql(
    expected: A,
    errorMessage: string,
    options?: AssertionOptions
  ): TestControllerPromise<void>;
  eql(
    expected: A,
    messageOrOptions: string | AssertionOptions,
    options?: AssertionOptions
  ): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `PromiseAssertions: entering eql expected='${expected}' this.actual='${this.actual}'`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving eql then expected='${expected}' this.actual='${this.actual}'`
          );
          if (this.actual instanceof ReExecutablePromise) {
            logger.debug(
              `PromiseAssertions: re-executing!='${expected}' this.actual='${this.actual}'`
            );
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving eql then expected='${expected}' actualValue='${actualValue}'`
          );
          if (actualValue !== expected) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#escape_sequences
            const oldStr = (expected + '')
              .replaceAll(/\n/g, `\\n\n`)
              .replaceAll(/\t/g, `\\t\t`)
              .replaceAll(/ /g, '·');
            const newStr = (actualValue + '')
              .replaceAll(/\n/g, `\\n\n`)
              .replaceAll(/\t/g, `\\t\t`)
              .replaceAll(/ /g, '·');
            const diff = diffChars(oldStr, newStr)
              .map((change, index, arr) => {
                // green for additions, red for deletions
                // grey for common parts
                const color = change.added
                  ? chalk.bgGreen
                  : change.removed
                    ? chalk.bgRed
                    : (x: string): string => x;

                const coloredText = color(change.value);
                return coloredText;
              })
              .join('');
            cause.message = `${
              typeof messageOrOptions === 'string' ? messageOrOptions : ''
            }\n  Expected:\n${expected}\n  Actual:\n${actualValue}\n  Diff:\n${diff}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `eql performance: ${durationFormat(this.startMillis, endMillis)}`
            );
        }),
      testController
    );
  }
  ok(options?: AssertionOptions): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `PromiseAssertions: entering ok this.actual=${this.actual}`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving ok then this.actual=${this.actual}`
          );
          if (this.actual instanceof ReExecutablePromise) {
            return this.actual._reExecute();
          } else {
            return this.actual;
          }
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving ok then actualValue=${actualValue}`
          );
          if (!actualValue) {
            cause.message = `\n  Expected:\nTruthy\n  Actual:\n${actualValue}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `ok performance: ${durationFormat(this.startMillis, endMillis)}`
            );
        }),
      testController
    );
  }
  notOk(options?: AssertionOptions): TestControllerPromise<void> {
    const cause = new Error();
    enterLogger.debug(
      `PromiseAssertions: entering notOk this.actual=${this.actual}`
    );
    return Object.assign(
      this.currentPromise
        .then(() => {
          logger.debug(
            `PromiseAssertions: resolving notOk then this.actual=${this.actual}`
          );
          return this.actual;
        })
        .then((actualValue: A) => {
          logger.debug(
            `PromiseAssertions: resolving notOk then actualValue=${actualValue}`
          );
          if (actualValue) {
            cause.message = `\n  Expected:\nFalsy\n  Actual:\n${actualValue}`;
            return Promise.reject(cause);
          } else {
            return Promise.resolve();
          }
        })
        .finally(() => {
          const endMillis = Date.now();
          performanceLogger.isDebugEnabled() &&
            performanceLogger.debug(
              `notOk performance: ${durationFormat(
                this.startMillis,
                endMillis
              )}`
            );
        }),
      testController
    );
  }
}
