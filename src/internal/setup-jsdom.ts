import { JSDOM, ConstructorOptions } from 'jsdom';
import { getLogger } from '../logger';

const logger = getLogger();

// Object.getOwnPropertyNames(window) returns invalid results when created with
// { runScripts: 'dangerously' }
// This property will be initialized without that option so its `window` can be used
// in Object.getOwnPropertyNames(window) as a workaround to that bug.
let workaroundForJsdomGetOwnPropertyNamesBug: JSDOM;

export function setupJsdom(html?: string, options: ConstructorOptions = {}) {
  logger.debug(`setupJsdom(${html}, ${JSON.stringify(options)})`);

  if (workaroundForJsdomGetOwnPropertyNamesBug === undefined) {
    workaroundForJsdomGetOwnPropertyNamesBug = new JSDOM('');
  }

  // set a default url if we don't get one - otherwise things explode when we copy localstorage keys
  if (!('url' in options)) {
    Object.assign(options, { url: 'http://localhost:3000' });
  }

  // enable pretendToBeVisual by default since react needs
  // window.requestAnimationFrame, see https://github.com/jsdom/jsdom#pretending-to-be-a-visual-browser
  if (!('pretendToBeVisual' in options)) {
    Object.assign(options, { pretendToBeVisual: true });
  }

  const jsdom = new JSDOM(html, options);
  const { window } = jsdom;
  const { document } = window;

  // generate our list of keys by enumerating document.window - this list may vary
  // based on the jsdom version. filter out internal methods as well as anything
  // that node already defines

  const KEYS = [];
  KEYS.push(
    ...Object.getOwnPropertyNames(
      workaroundForJsdomGetOwnPropertyNamesBug.window
    ).filter((k) => !k.startsWith('_') && !(k in global))
  );
  // eslint-disable-next-line no-return-assign
  KEYS.forEach((key) => (global[key] = window[key]));

  // add properties to help with troubleshooting
  window.isJSDOM = true;
  document.isJSDOM = true;

  // setup document / window / window.console
  global.document = document;

  return jsdom;
}
