import { NodeSnapshot } from './internal/node-snapshot'

export const htmlElementToNodeSnapshot = (el: HTMLElement): NodeSnapshot => {
  return {
 
  childElementCount: number;
  childNodeCount: number;
  hasChildElements: boolean;
  hasChildNodes: boolean;
  nodeType: number;
  textContent: string;
  attributes?: { [name: string]: string };
  boundingClientRect?: TextRectangle;
  checked?: boolean | undefined;
  classNames?: string[];
  clientHeight?: number;
  clientLeft?: number;
  clientTop?: number;
  clientWidth?: number;
  focused?: boolean;
  id?: string;
  innerText?: string;
  namespaceURI?: string | null;
  offsetHeight?: number;
  offsetLeft?: number;
  offsetTop?: number;
  offsetWidth?: number;
  selected?: boolean | undefined;
  selectedIndex?: number | undefined;
  scrollHeight?: number;
  scrollLeft?: number;
  scrollTop?: number;
  scrollWidth?: number;
  style?: { [prop: string]: string };
  tagName?: string;
  value?: string | undefined;
  visible?: boolean;
  hasClass?(className: string): boolean;
  getStyleProperty?(propertyName: string): string;
  getAttribute?(attributeName: string): string | null;
  getBoundingClientRectProperty?(propertyName: string): number;
  hasAttribute?(attributeName: string): boolean;


}
}