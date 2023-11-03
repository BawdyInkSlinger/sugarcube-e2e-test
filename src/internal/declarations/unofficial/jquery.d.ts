import { Passage } from '../../fakes/passage';

declare global {
  namespace JQuery {
    interface EventExtensions {
      // I'm prettty sure this is missing because of a bug in the official jquery types?
      trigger(type: string): JQueryStatic;
      // I'm prettty sure this is missing because of a bug in the official jquery types?
      trigger(options: {
        type: string;
        passage: Passage;
        content?: ReturnType<typeof document.createElement>;
      }): JQueryStatic;
      trigger(type: string, ...params: unknown[]): JQueryStatic;
    }
  }

  interface JQuery {
    wikiWithOptions(
      options: { cleanup: boolean; profile: string },
      ...sources: string[]
    ): this;
  }
}

export {};
