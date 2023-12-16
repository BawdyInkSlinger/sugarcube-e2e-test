import { DebugRow } from '../debug-table';

export type TextAndLog = {
  text: string;
  log: DebugRow;
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
