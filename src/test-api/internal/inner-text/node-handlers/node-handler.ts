import { DataRow, DataTable } from '../data-table';

export type TextAndLog = {
  text: string;
  log: DataRow;
  children: DataRow[];
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
  nodeText: string,
  childTable: DataTable = new DataTable(),
): TextAndLog => {
  return {
    text,
    log: {
      functionName,
      nodeInfo,
      nodeText,
    },
    children: childTable.rows,
  };
};
