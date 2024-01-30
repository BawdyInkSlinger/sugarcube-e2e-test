import { DataTable } from '../data-table';
import { innerTextHelper } from '../inner-text';
import { NodeHandler, TextAndLog, returnWrapper } from './node-handler';

export const handleElement: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  if (node.hasChildNodes() && node.nodeName.toLowerCase().trim() === `div`) {
    return handleParentDiv(node, index, originalArray, recursionDepth);
  } else if (node.hasChildNodes()) {
    return handleHasChildNodes(node, index, originalArray, recursionDepth);
  } else if (
    node.nodeName.toLowerCase().trim() === `br` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() === `br`
  ) {
    return handleDoubleBr(node, index, originalArray, recursionDepth);
  } else if (
    node.nodeName.toLowerCase().trim() === `br` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() !== `br` &&
    index + 1 < originalArray.length &&
    originalArray[index + 1].nodeName.toLowerCase().trim() !== `br`
  ) {
    return handleSingleBr(node, index, originalArray, recursionDepth);
  } else {
    return handleDefault(node, index, originalArray, recursionDepth);
  }
};

const handleParentDiv: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  const recursed = recurse(node, recursionDepth, (result) => {
    return '\n' + result.replaceAll(/^\s+/g, '').replaceAll(/\s+$/g, '') + '\n';
  });

  return returnWrapper(
    recursed.result,
    handleParentDiv.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    recursed.result,
    recursionDepth,
    recursed.debugDataTable
  );
};

const handleHasChildNodes: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  const recursed = recurse(node, recursionDepth, (result) => {
    return result;
  });

  return returnWrapper(
    recursed.result,
    handleHasChildNodes.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    recursed.result,
    recursionDepth,
    recursed.debugDataTable
  );
};

const handleDoubleBr: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  const text = `\n\n`;

  return returnWrapper(
    text,
    handleDoubleBr.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text,
    recursionDepth
  );
};

const handleSingleBr: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  const text = ' ';

  return returnWrapper(
    text,
    handleDoubleBr.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text,
    recursionDepth
  );
};

const handleDefault: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  recursionDepth: number
): TextAndLog => {
  const text = '';

  return returnWrapper(
    text,
    handleDefault.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text,
    recursionDepth
  );
};

const recurse = (
  node: Node,
   recursionDepth: number,
  cb: (value: string) => string
): { result: string; debugDataTable: DataTable } => {
  const { result, debugDataTable } = innerTextHelper(node, recursionDepth + 1);

  return {
    result: cb(result),
    debugDataTable,
  };
};
