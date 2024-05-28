import { AssertionApi, PromiseAssertions } from './internal/assertion';
import { Selector } from './selector';
import { getLogger } from '../logging/logger';
import { ClickActionOptions } from './internal/click-action-options';
import { buildWaitStrategy } from './wait-strategy';
import { GotoActionOptions } from './internal/goto-action-options';
import { durationFormat } from './internal/duration-format';
import { PromiseTimeoutError } from './promise-with-timeout';

// added by BIS:
const logger = getLogger('DEFAULT');
const performanceLogger = getLogger('DEBUG_PERFORMANCE');
const enterLogger = getLogger('DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES');
const thisAsPromiseLogger = getLogger('DEBUG_THIS_AS_PROMISE');

export interface TestController {
  // ctx: { [key: string]: any };
  // readonly fixtureCtx: { [key: string]: any };
  // readonly browser: Browser;
  // readonly customActions: CustomActions;
  // dispatchEvent(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   eventName: string,
  //   options?: object
  // ): TestControllerPromise;
  click(
    selector: // | string
    Selector,
    // | NodeSnapshot
    // | SelectorPromise,
    // | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
    options?: ClickActionOptions
  ): TestControllerPromise;
  // rightClick(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: ClickActionOptions
  // ): TestControllerPromise;
  // doubleClick(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: ClickActionOptions
  // ): TestControllerPromise;
  // hover(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: MouseActionOptions
  // ): TestControllerPromise;
  // scroll(posX: number, posY: number): TestControllerPromise;

  // scroll(position: ScrollPosition): TestControllerPromise;

  // scroll(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   scrollLeft: number,
  //   scrollTop: number,
  //   options?: OffsetOptions
  // ): TestControllerPromise;

  // scroll(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   position: ScrollPosition,
  //   options?: OffsetOptions
  // ): TestControllerPromise;

  // scrollBy(x: number, y: number): TestControllerPromise;

  // scrollBy(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   x: number,
  //   y: number,
  //   options?: OffsetOptions
  // ): TestControllerPromise;

  // scrollIntoView(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: OffsetOptions
  // ): TestControllerPromise;

  // drag(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   dragOffsetX: number,
  //   dragOffsetY: number,
  //   options?: MouseActionOptions
  // ): TestControllerPromise;
  // dragToElement(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   destinationSelector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: DragToElementOptions
  // ): TestControllerPromise;
  // typeText(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   text: string,
  //   options?: TypeActionOptions
  // ): TestControllerPromise {
  //   return {} as TestControllerPromise;
  // }
  // selectText(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   startPos?: number,
  //   endPos?: number,
  //   options?: ActionOptions
  // ): TestControllerPromise;
  // selectTextAreaContent(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   startLine?: number,
  //   startPos?: number,
  //   endLine?: number,
  //   endPos?: number,
  //   options?: ActionOptions
  // ): TestControllerPromise;
  // selectEditableContent(
  //   startSelector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   endSelector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   options?: ActionOptions
  // ): TestControllerPromise;
  // pressKey(keys: string, options?: PressActionOptions): TestControllerPromise {
  //   return {} as TestControllerPromise;
  // }
  wait(timeout: number): TestControllerPromise;
  // navigateTo(url: string): TestControllerPromise {
  //   return {} as TestControllerPromise;
  // }
  // setFilesToUpload(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   filePath: string | string[]
  // ): TestControllerPromise;
  // clearUpload(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)
  // ): TestControllerPromise;
  // takeScreenshot(path?: string): TestControllerPromise;
  // takeScreenshot(options: TakeScreenshotOptions): TestControllerPromise;
  // takeElementScreenshot(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection),
  //   path?: string,
  //   options?: TakeElementScreenshotOptions
  // ): TestControllerPromise;
  // resizeWindow(width: number, height: number): TestControllerPromise;

  // resizeWindowToFitDevice(
  //   deviceName: string,
  //   options?: ResizeToFitDeviceOptions
  // ): TestControllerPromise;
  // maximizeWindow(): TestControllerPromise;
  // switchToIframe(
  //   selector:
  //     | string
  //     | Selector
  //     | NodeSnapshot
  //     | SelectorPromise
  //     | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)
  // ): TestControllerPromise;
  // switchToMainWindow(): TestControllerPromise;

  // openWindow(url: string): WindowDescriptorPromise;

  // closeWindow(windowDescriptor?: WindowDescriptor): TestControllerPromise;

  // getCurrentWindow(): WindowDescriptorPromise;

  // switchToWindow(windowDescriptor: WindowDescriptor): TestControllerPromise;

  // switchToWindow(
  //   filterFn: (data: WindowFilterData) => boolean
  // ): TestControllerPromise;

  // switchToParentWindow(): TestControllerPromise;

  // switchToPreviousWindow(): TestControllerPromise;

  // eval(fn: Function, options?: ClientFunctionOptions): Promise<any>;
  // setNativeDialogHandler(
  //   fn:
  //     | ((
  //         type: 'alert' | 'confirm' | 'beforeunload' | 'prompt',
  //         text: string,
  //         url: string
  //       ) => any)
  //     | null,
  //   options?: ClientFunctionOptions
  // ): TestControllerPromise;
  // getNativeDialogHistory(): Promise<NativeDialogHistoryItem[]>;
  // getBrowserConsoleMessages(): Promise<BrowserConsoleMessages>;
  expect<A>(actual: A | Promise<A>): AssertionApi<A>;
  // debug(): TestControllerPromise;
  // setTestSpeed(speed: number): TestControllerPromise;
  // setPageLoadTimeout(duration: number): TestControllerPromise;
  // useRole(role: Role): TestControllerPromise;
  // addRequestHooks(...hooks: object[]): TestControllerPromise;
  // removeRequestHooks(...hooks: object[]): TestControllerPromise;
  // getCookies(
  //   cookies?: CookieOptions | CookieOptions[]
  // ): Promise<CookieOptions[]>;
  // getCookies(
  //   names: string | string[],
  //   urls?: string | string[]
  // ): Promise<CookieOptions[]>;
  // setCookies(cookies?: CookieOptions | CookieOptions[]): TestControllerPromise;
  // setCookies(
  //   nameValueObjects: Record<string, string> | Record<string, string>[],
  //   url?: string
  // ): TestControllerPromise;
  // deleteCookies(
  //   cookies?: CookieOptions | CookieOptions[]
  // ): TestControllerPromise;
  // deleteCookies(
  //   names: string | string[],
  //   urls?: string | string[]
  // ): TestControllerPromise;

  // request: Request;

  // skipJsErrors(
  //   options?:
  //     | boolean
  //     | SkipJsErrorsOptionsObject
  //     | SkipJsErrorsCallback
  //     | SkipJsErrorsCallbackWithOptionsObject
  // ): TestControllerPromise;

  // report(...args: any[]): TestControllerPromise;
  goto(
    passageTitle: string,
    temporaryVariables?: unknown,
    options?: GotoActionOptions
  ): TestControllerPromise;
  logDocument(
    this: Promise<void> | TestController,
    options: Parameters<Document['toPrettyString']>[0]
  ): TestControllerPromise;
  log(
    this: Promise<void> | TestController,
    ...params: unknown[]
  ): TestControllerPromise;
}

export const testController: TestController = {
  goto(
    this: Promise<void> | TestController,
    passageTitle: string,
    temporaryVariables?: unknown,
    { waitFor: waitStrategy = ':passageend' }: GotoActionOptions = {}
  ): TestControllerPromise {
    const startMillis = Date.now();
    const cause = new Error(`goto error`);
    enterLogger.debug(`testController: entering goto '${passageTitle}'`);

    return Object.assign(
      thisAsPromise(this).then(() => {
        const pageLoadPromise = buildWaitStrategy(waitStrategy)(
          `goto '${passageTitle}'`
        )
          .catch((reason) => {
            reason.cause = cause;
            throw reason;
          })
          .finally(() => {
            const endMillis = Date.now();
            performanceLogger.isDebugEnabled() &&
              performanceLogger.debug(
                `goto performance: ${durationFormat(startMillis, endMillis)}`
              );
          });
        if (temporaryVariables !== undefined) {
          logger.debug(
            `temporaryVariables=${JSON.stringify(temporaryVariables)}`
          );
          $(document).one(':passagestart', () => {
            logger.debug(
              `:passagestart temporaryVariables=${JSON.stringify(
                temporaryVariables
              )}`
            );
            for (const key of Object.keys(temporaryVariables)) {
              globalThis.State.temporary[key] = temporaryVariables[key];
            }
            logger.debug(
              `globalThis.State.temporary=${JSON.stringify(
                globalThis.State.temporary
              )}`
            );
          });
        }

        globalThis.Engine.play(passageTitle);

        return pageLoadPromise;
      }),
      testController
    );
  },

  click(
    this: Promise<void> | TestController,
    selector: Selector,
    { waitFor: waitStrategy = ':passageend' }: ClickActionOptions = {}
  ): TestControllerPromise {
    const startMillis = Date.now();
    const cause = new Error(`click error`);
    enterLogger.debug(`testController: entering click selector='${selector}'`);

    const asyncClick = thisAsPromise(this)
      .then<void>(() => {
        enterLogger.debug(
          `testController: entering asyncClick selector='${selector}' to wait for ${waitStrategy}`
        );

        const waitUntil = buildWaitStrategy(waitStrategy)(
          `click ${selector.toString()} and wait for ${waitStrategy}`
        );

        logger.debug(`Pre $(${selector.toString()}).trigger('click');`);
        const clickable = selector.execute();
        if (clickable.length === 0) {
          throw new Error(
            `Attempted to click on selector that could not be found: ${selector.toString()}`
          );
        }
        clickable.trigger('click');
        logger.debug(
          `Post $(${selector.toString()}).trigger('click'); Waiting for ${waitStrategy}`
        );

        return waitUntil;
      })
      .catch((err: Error) => {
        err.cause = cause;
        if (err instanceof PromiseTimeoutError) {
          throw new Error(
            `The selector was clicked, but a timeout occurred 
while waiting for a :passageend event. Does this click 
go to a new passage? If not, click with a different wait strategy.`.replace(
              /\n/,
              ''
            ) +
              `\n\ne.g., await t.click(${selector.toString()}, { waitFor: 'click end' })`,
            { cause: err }
          );
        }
        throw err;
      })
      .finally(() => {
        const endMillis = Date.now();
        performanceLogger.isDebugEnabled() &&
          performanceLogger.debug(
            `click performance: ${durationFormat(startMillis, endMillis)}`
          );
      });
    return Object.assign(asyncClick, testController);
  },

  expect<A>(
    this: Promise<void> | TestController,
    actual: A | Promise<A>
  ): AssertionApi<A> {
    const startMillis = Date.now();
    enterLogger.debug(`testController: entering expect actual=`, actual);
    if (!(actual instanceof Promise)) {
      actual = Promise.resolve(actual);
    }
    const assertionApi = new PromiseAssertions(
      thisAsPromise(this),
      actual,
      startMillis
    );
    return assertionApi as AssertionApi<A>;
  },

  logDocument(
    this: Promise<void> | TestController,
    options: Parameters<Document['toPrettyString']>[0]
  ): TestControllerPromise {
    enterLogger.debug(`testController: entering logDocument options=`, options);

    return Object.assign(
      thisAsPromise(this).then(() => {
        console.log(document.toPrettyString(options));
      }),
      testController
    );
  },

  log(
    this: Promise<void> | TestController,
    ...params: unknown[]
  ): TestControllerPromise {
    enterLogger.debug(
      `testController: entering log params=${JSON.stringify(params)}`
    );

    return Object.assign(
      thisAsPromise(this).then(() => {
        console.log(params);
      }),
      testController
    );
  },

  wait(
    this: Promise<void> | TestController,
    millis: number,
    resolveOrReject: 'resolve' | 'reject' = 'resolve'
  ): TestControllerPromise {
    const cause = new Error(
      `wait(${millis}, '${resolveOrReject}') timeout reached`
    );

    enterLogger.debug(
      `testController: entering wait(${millis}, '${resolveOrReject}')`
    );

    return Object.assign(
      thisAsPromise(this).then(() => {
        return new Promise<void>((resolve, reject) => {
          const impl = () => {
            return resolveOrReject === 'resolve' ? resolve() : reject(cause);
          };
          setTimeout(impl, millis);
        });
      }),
      testController
    );
  },
};

const thisAsPromise = (self: Promise<void> | TestController) => {
  if (self instanceof Promise) {
    thisAsPromiseLogger.debug(`thisPromise: Promise`);
    return self;
  } else {
    thisAsPromiseLogger.debug(`thisPromise: this`);
    return Promise.resolve();
  }
};

const wait = (
  millis: number,
  resolveOrReject: 'resolve' | 'reject' = 'resolve'
): Promise<void> => {
  const cause = new Error('Timeout');
  return new Promise<void>((resolve, reject) => {
    enterLogger.debug(`testController: entering waiting ${millis} seconds`);
    let impl = resolve;
    if (resolveOrReject === 'reject') {
      impl = () => {
        reject(cause);
      };
    }
    setTimeout(impl, millis);
  });
};

export interface TestControllerPromise<T = void>
  extends TestController,
    Promise<T> {}
