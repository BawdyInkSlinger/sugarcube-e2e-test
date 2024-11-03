import { NodeSnapshot } from './internal/node-snapshot';

export const htmlElementToNodeSnapshot = function (
  el: HTMLElement
): NodeSnapshot {
  const result: NodeSnapshot = Object.assign({}, el, {
    get childNodeCount(): number {
      return el.childElementCount;
    },
    get hasChildElements(): boolean {
      return el.childElementCount > 0;
    },
    get hasChildNodes(): boolean {
      return el.childElementCount > 0;
    },
    get attributes(): { [name: string]: string } | undefined {
      if (!el.hasAttributes()) {
        return undefined;
      }

      return [...el.attributes].reduce((prev, { name, value }: Attr) => {
        prev[name] = value;
        return prev;
      }, {});
    },
    get style(): { [prop: string]: string } | undefined {
      const styleDeclaration = globalThis.window.getComputedStyle(el);

      const result: { [prop: string]: string } = {};

      for (let i = styleDeclaration.length; i--; ) {
        const key = styleDeclaration[i];
        const value = styleDeclaration.getPropertyValue(key);

        result[key] = value;
      }

      return result;
    },
  });

  return result;
};
