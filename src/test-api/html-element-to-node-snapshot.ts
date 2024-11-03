import { NodeSnapshot } from './internal/node-snapshot';

export const htmlElementToNodeSnapshot = (el: HTMLElement): NodeSnapshot => {
  const result: NodeSnapshot= Object.assign({}, el, {
    get childNodeCount(): number {
      throw new Error(`Not Implemented`);
    },
    get hasChildElements(): boolean {
      throw new Error(`Not Implemented`);
    },
    get hasChildNodes(): boolean {
      throw new Error(`Not Implemented`);
    },
    get attributes(): { [name: string]: string } | undefined {
      throw new Error(`Not Implemented`);
    },
    get style(): { [prop: string]: string } | undefined {
      throw new Error(`Not Implemented`);
    },
  });

  return result;
};
