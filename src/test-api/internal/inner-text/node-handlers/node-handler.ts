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
  recursionDepth: number
) => TextAndLog;

export const returnWrapper = (
  text: string,
  functionName: string,
  nodeInfo: string,
  nodeText: string,
  recursionDepth: number,
  childTable: DataTable = new DataTable()
): TextAndLog => {
  return {
    text,
    log: {
      functionName,
      nodeInfo: indent(recursionDepth) + nodeInfo,
      nodeText,
      postProcess: text,
    },
    children: childTable.rows,
  };
};

const indent = (recursionDepth: number): string => {
  return `·`.repeat(recursionDepth * 2);
};
