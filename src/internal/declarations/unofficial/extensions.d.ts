/// <reference types="jquery" />
declare global {
  interface String {
    splitOrEmpty(separator: string | RegExp, limit?: number): string[];
  }

  interface JQueryAriaClickOptions {
    role?: string;
  }

  interface JSON {
    _real_stringify: typeof JSON.stringify;
    _real_parse: typeof JSON.parse;
  }
}

export {};
