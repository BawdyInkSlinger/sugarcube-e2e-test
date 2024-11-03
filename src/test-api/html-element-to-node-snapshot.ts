import { NodeSnapshot } from './internal/node-snapshot';
import { TextRectangle } from './internal/text-rectangle';

export const htmlElementToNodeSnapshot = (el: HTMLElement): NodeSnapshot => {
  return {
    get childElementCount(): number {
      throw new Error(`Not Implemented`);
    },
    get childNodeCount(): number {
      throw new Error(`Not Implemented`);
    },
    get hasChildElements(): boolean {
      throw new Error(`Not Implemented`);
    },
    get hasChildNodes(): boolean {
      throw new Error(`Not Implemented`);
    },
    get nodeType(): number {
      throw new Error(`Not Implemented`);
    },
    get textContent(): string {
      throw new Error(`Not Implemented`);
    },
    get attributes(): { [name: string]: string } | undefined {
      throw new Error(`Not Implemented`);
    },
    get boundingClientRect(): TextRectangle | undefined {
      throw new Error(`Not Implemented`);
    },
    get checked(): boolean | undefined | undefined {
      throw new Error(`Not Implemented`);
    },
    get classNames(): string[] | undefined {
      throw new Error(`Not Implemented`);
    },
    get clientHeight(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get clientLeft(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get clientTop(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get clientWidth(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get focused(): boolean | undefined {
      throw new Error(`Not Implemented`);
    },
    get id(): string | undefined {
      throw new Error(`Not Implemented`);
    },
    get innerText(): string | undefined {
      throw new Error(`Not Implemented`);
    },
    get namespaceURI(): string | null | undefined {
      throw new Error(`Not Implemented`);
    },
    get offsetHeight(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get offsetLeft(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get offsetTop(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get offsetWidth(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get selected(): boolean | undefined | undefined {
      throw new Error(`Not Implemented`);
    },
    get selectedIndex(): number | undefined | undefined {
      throw new Error(`Not Implemented`);
    },
    get scrollHeight(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get scrollLeft(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get scrollTop(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get scrollWidth(): number | undefined {
      throw new Error(`Not Implemented`);
    },
    get style(): { [prop: string]: string } | undefined {
      throw new Error(`Not Implemented`);
    },
    get tagName(): string | undefined {
      throw new Error(`Not Implemented`);
    },
    get value(): string | undefined | undefined {
      throw new Error(`Not Implemented`);
    },
    get visible(): boolean | undefined {
      throw new Error(`Not Implemented`);
    },
    hasClass(className: string): boolean | undefined {
      throw new Error(`Not Implemented`);
    },
    getStyleProperty(propertyName: string): string | undefined {
      throw new Error(`Not Implemented`);
    },
    getAttribute(attributeName: string): string | null | undefined {
      throw new Error(`Not Implemented`);
    },
    getBoundingClientRectProperty(propertyName: string): number | undefined {
      throw new Error(`Not Implemented`);
    },
    hasAttribute(attributeName: string): boolean | undefined {
      throw new Error(`Not Implemented`);
    },
  };
};
