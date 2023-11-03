/// <reference types="jquery" />
declare global {

  interface String {
    splitOrEmpty(separator: string | RegExp, limit?: number): string[];
  }

  interface JQueryAriaClickOptions {
    role?: string
  }

}

export {};
