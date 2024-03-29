import { JSDOMInstance } from '../../setup-jsdom';

declare global {
  interface Document {
    isJSDOM: boolean | undefined;
  }

  // eslint-disable-next-line no-var
  var isJSDOM: boolean | undefined;
  // eslint-disable-next-line no-var
  var jsdom: JSDOMInstance;
}
