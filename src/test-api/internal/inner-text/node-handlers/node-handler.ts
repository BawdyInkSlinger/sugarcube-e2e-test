import { DataRow } from '../data-table';

export type TextAndLog = {
  text: string;
  log: DataRow;
};

export type NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
) => TextAndLog;

export const returnWrapper = (
  text: string,
  functionName: string,
  nodeInfo: string,
  nodeText: string
): TextAndLog => {
  return {
    text,
    log: {
      functionName,
      nodeInfo,
      nodeText,
    },
  };
};
