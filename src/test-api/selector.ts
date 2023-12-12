import { getLogger } from '../logger';
import { innerText } from './inner-text';
import { NodeSnapshot } from './internal/node-snapshot';
import ReExecutablePromise from './internal/re-executable-promise';

const enterLogger = getLogger('DEBUG_SELECTOR_ENTER_LOG_MESSAGES');

interface SelectorFactory {
  (
    init: string
    // | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)
    // | Selector,
    // | NodeSnapshot
    // | SelectorPromise,
    // options?: SelectorOptions
  ): Selector;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Selector extends SelectorAPI {
  // (...args: any[]): SelectorPromise;
  execute: () => JQuery<HTMLElement>;
}

interface SelectorAPI {
  // childElementCount: Promise<number>;
  // childNodeCount: Promise<number>;
  // hasChildElements: Promise<boolean>;
  // hasChildNodes: Promise<boolean>;
  // nodeType: Promise<number>;
  // textContent: Promise<string>;
  // attributes: Promise<{[name: string]: string}>;
  // boundingClientRect: Promise<TextRectangle>;
  // checked: Promise<boolean | undefined>;
  // classNames: Promise<string[]>;
  // clientHeight: Promise<number>;
  // clientLeft: Promise<number>;
  // clientTop: Promise<number>;
  // clientWidth: Promise<number>;
  // focused: Promise<boolean>;
  // id: Promise<string>;
  innerText: Promise<string>;
  // namespaceURI: Promise<string | null>;
  // offsetHeight: Promise<number>;
  // offsetLeft: Promise<number>;
  // offsetTop: Promise<number>;
  // offsetWidth: Promise<number>;
  // selected: Promise<boolean | undefined>;
  // selectedIndex: Promise<number | undefined>;
  // scrollHeight: Promise<number>;
  // scrollLeft: Promise<number>;
  // scrollTop: Promise<number>;
  // scrollWidth: Promise<number>;
  // style: Promise<{[prop: string]: string}>;
  // tagName: Promise<string>;
  // value: Promise<string | undefined>;
  // visible: Promise<boolean>;
  // hasClass(className: string): Promise<boolean>;
  // getStyleProperty(propertyName: string): Promise<string>;
  getAttribute(attributeName: string): Promise<string | null>;
  // getBoundingClientRectProperty(propertyName: string): Promise<number>;
  // hasAttribute(attributeName: string): Promise<boolean>;
  // shadowRoot(): Selector;
  nth(index: number): Selector;
  withText(text: string): Selector;
  // withText(re: RegExp): Selector;
  // withExactText(text: string): Selector;
  // withAttribute(attrName: string | RegExp, attrValue?: string | RegExp): Selector;
  // filter(cssSelector: string): Selector;
  // filter(filterFn: (node: Element, idx: number) => boolean,
  //        dependencies?: {[key: string]: any}): Selector;
  // filterVisible(): Selector;
  // filterHidden(): Selector;
  // find(cssSelector: string): Selector;
  // find(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //      dependencies?: {[key: string]: any}): Selector;
  // parent(): Selector;
  // parent(index: number): Selector;
  // parent(cssSelector: string): Selector;
  // parent(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //        dependencies?: {[key: string]: any}): Selector;
  // child(): Selector;
  // child(index: number): Selector;
  // child(cssSelector: string): Selector;
  // child(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //       dependencies?: {[key: string]: any}): Selector;
  // sibling(): Selector;
  // sibling(index: number): Selector;
  // sibling(cssSelector: string): Selector;
  // sibling(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //         dependencies?: {[key: string]: any}): Selector;
  // nextSibling(): Selector;
  // nextSibling(index: number): Selector;
  // nextSibling(cssSelector: string): Selector;
  // nextSibling(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //             dependencies?: {[key: string]: any}): Selector;
  // prevSibling(): Selector;
  // prevSibling(index: number): Selector;
  // prevSibling(cssSelector: string): Selector;
  // prevSibling(filterFn: (node: Element, idx: number, originNode: Element) => boolean,
  //             dependencies?: {[key: string]: any}): Selector;
  exists: Promise<boolean>;
  // count: Promise<number>;
  // addCustomDOMProperties(props: {[prop: string]: (node: Element) => any}): Selector;
  // addCustomMethods(methods: {[method: string]: (node: Element, ...methodParams: any[]) => any }, opts?: {returnDOMNodes?: boolean}): Selector;
  // with(options?: SelectorOptions): Selector;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SelectorOptions {
  /**
   * If you need to call a selector from a Node.js callback, assign the current test
   * controller to the `boundTestRun` option.
   */
  // boundTestRun?: TestController;
  /**
   * The amount of time, in milliseconds, allowed for an element returned by the
   * selector to appear in the DOM before the test fails.
   */
  // timeout?: number;
  /**
   * Use this option to pass functions, variables or objects to selectors initialized with a function.
   * The `dependencies` object's properties are added to the function's scope as variables.
   */
  // dependencies?: { [key: string]: any };
  /**
   * `true` to additionally require the returned element to become visible within `options.timeout`.
   */
  // visibilityCheck?: boolean;
}

export interface SelectorPromise extends SelectorAPI, Promise<NodeSnapshot> {}

export const Selector: SelectorFactory = (
  init: string
  // | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)
  // | Selector,
  // | NodeSnapshot
  // | SelectorPromise,
  // options?: SelectorOptions
): Selector => {
  enterLogger.debug(
    `${new Date().getTime()} selector: entering init='${init}'`
  );

  const executionSteps: (
    | { action: 'jQuerySelector'; value: string; toString: () => string }
    | { action: 'nth'; value: number; toString: () => string }
  )[] = [{ action: 'jQuerySelector', value: init, toString: () => init }];
  const execute: () => JQuery<HTMLElement> = () => {
    let jQueryChain = $();
    for (
      let executionStepIndex = 0;
      executionStepIndex < executionSteps.length;
      executionStepIndex++
    ) {
      if (executionSteps[executionStepIndex]?.action === 'jQuerySelector') {
        const loopCount = executionStepIndex;
        let jQuerySelector = '';
        while (
          executionSteps[executionStepIndex]?.action === 'jQuerySelector'
        ) {
          jQuerySelector += executionSteps[executionStepIndex].value;
          executionStepIndex++;
        }
        if (jQuerySelector.length > 0) {
          if (loopCount === 0) {
            jQueryChain = $(jQuerySelector);
          } else {
            jQueryChain = jQueryChain.find(jQuerySelector);
          }
        }
      } else if (executionSteps[executionStepIndex]?.action === 'nth') {
        jQueryChain = jQueryChain[executionSteps[executionStepIndex].value];
      }
    }
    return jQueryChain;
  };

  const selectorImpl: Selector & { toString: () => string } = {
    execute,
    innerText: ReExecutablePromise.fromFn(() => {
      return innerText(execute()[0]);
    }),
    exists: ReExecutablePromise.fromFn(() => execute().length > 0),
    withText: function (text: string): Selector {
      enterLogger.debug(
        `${new Date().getTime()} selector: entering withText init='${init}' text='${text}'`
      );
      executionSteps.push({
        action: 'jQuerySelector',
        value: `:contains(${text})`,
        toString: () => `:contains(${text})`,
      });
      return this;
    },
    nth(index: number): Selector {
      executionSteps.push({
        action: 'nth',
        value: index,
        toString: () => `:nth(${index})`,
      });
      return this;
    },
    getAttribute(attributeName: string): Promise<string | null> {
      return ReExecutablePromise.fromFn(() => execute().attr(attributeName));
    },
    toString: function (): string {
      return `Selector(\`${executionSteps.join('')}\`)`;
    },
  };
  return selectorImpl;
};
