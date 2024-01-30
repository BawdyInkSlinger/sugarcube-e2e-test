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
      nodeInfo: calculateParentNodeInfo(parentDepth, nodeInfo),
      nodeText,
      postProcess: text,
    },
    children: childTable.rows,
  };
};

const calculateParentNodeInfo = (
  { parent }: ParentDepth,
  nodeInfo: string
): string => {
  return [
    parent === undefined ? undefined : calculateNodeInfo(parent),
    nodeInfo,
  ]
    .filter((val) => {
      return val !== undefined;
    })
    .join('>');
};

export const calculateNodeInfo = (node: Node): string => {
  const id = (node as HTMLElement).id;
  if (id !== '') {
    return '#' + id;
  }

  const classes = (node as HTMLElement).className;
  if (classes !== '') {
    return '.' + classes.replaceAll(' ', '.');
  }

  return `${node.nodeName}`;
};
