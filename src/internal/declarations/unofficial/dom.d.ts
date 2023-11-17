export {};

declare global {
  interface Document {
    jsdom: boolean | undefined;
  }

  // eslint-disable-next-line no-var
  var jsdom: boolean | undefined;
}
