import { getLogger } from '../logger';
import { NodeSnapshot } from './internal/node-snapshot';
import ReExecutablePromise from './internal/re-executable-promise';

const enterLogger = getLogger('DEBUG_SELECTOR_ENTER_LOG_MESSAGES');

interface SelectorFactory {
  (
    init: string,
    // | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)
    // | Selector,
    // | NodeSnapshot
    // | SelectorPromise,
    options?: SelectorOptions
  ): Selector;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Selector extends SelectorAPI {
  // (...args: any[]): SelectorPromise;
  selectorString: string;
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
  // getAttribute(attributeName: string): Promise<string | null>;
  // getBoundingClientRectProperty(propertyName: string): Promise<number>;
  // hasAttribute(attributeName: string): Promise<boolean>;
  // shadowRoot(): Selector;
  // nth(index: number): Selector;
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
  enterLogger.debug(`${new Date().getTime()} selector: entering init='${init}'`);
  const selectorImpl: Selector & { toString: () => string } = {
    selectorString: init,
    innerText: ReExecutablePromise.fromFn(() => {
      return $(init).text().trim();
    }),
    withText: function (text: string): Selector {
      enterLogger.debug(
          `${new Date().getTime()} selector: entering withText init='${init}' text='${text}'`
        );
      // return Selector(`${init}:contains('${$.escapeSelector(text)}')`);
      return Selector(`${init}:contains(${text})`);
    },
    exists: ReExecutablePromise.fromFn(() => $(init).length > 0),
    toString: function (): string {
      return `Selector(\`${init}\`)`;
    },
  };
  return selectorImpl;
};
