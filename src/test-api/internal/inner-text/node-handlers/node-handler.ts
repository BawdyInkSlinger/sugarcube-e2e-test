import { DataRow, DataTable } from '../data-table';

export type TextAndLog = {
  text: string;
  log: DataRow;
  children: DataRow[];
};

export type NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  parentDepth: number
) => TextAndLog;

export const returnWrapper = (
  text: string,
  functionName: string,
  nodeInfo: string,
  nodeText: string,
  parentDepth: number,
  childTable: DataTable = new DataTable()
): TextAndLog => {
  return {
    text,
    log: {
      functionName,
      nodeInfo: indent(parentDepth) + nodeInfo,
      nodeText,
      postProcess: text,
    },
    children: childTable.rows,
  };
};

const indent = (parentDepth: number): string => {
  return `·`.repeat(parentDepth * 2);
};
