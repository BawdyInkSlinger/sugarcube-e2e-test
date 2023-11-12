export {};

declare global {
  interface Document {
    jsdom: boolean | undefined;
  }

  var jsdom: boolean | undefined;
}
