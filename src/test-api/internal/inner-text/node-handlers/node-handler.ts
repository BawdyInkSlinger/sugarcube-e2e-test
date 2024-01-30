import { DataRow, DataTable } from '../data-table';
import { ParentDepth } from '../inner-text';

export type TextAndLog = {
  text: string;
  log: DataRow;
  children: DataRow[];
};

export type NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  parentDepth: ParentDepth
) => TextAndLog;

export const returnWrapper = (
  text: string,
  functionName: string,
  nodeInfo: string,
  nodeText: string,
  parentDepth: ParentDepth,
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

const indent = ({ depth }: ParentDepth): string => {
  return `·`.repeat(depth * 2);
};
