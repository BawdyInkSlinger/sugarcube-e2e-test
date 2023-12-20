import { innerTextHelper } from '../inner-text';
import { NodeHandler, TextAndLog, returnWrapper } from './node-handler';

export const handleElement: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  if (node.hasChildNodes() && node.nodeName.toLowerCase().trim() === `div`) {
    return handleParentDiv(node, index, originalArray);
  } else if (node.hasChildNodes()) {
    return handleHasChildNodes(node, index, originalArray);
  } else if (
    node.nodeName.toLowerCase().trim() === `br` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() === `br`
  ) {
    return handleDoubleBr(node, index, originalArray);
  } else if (
    node.nodeName.toLowerCase().trim() === `br` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() !== `br` &&
    index + 1 < originalArray.length &&
    originalArray[index + 1].nodeName.toLowerCase().trim() !== `br`
  ) {
    return handleSingleBr(node, index, originalArray);
  } else {
    return handleDefault(node, index, originalArray);
  }
};

const handleParentDiv: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  let recursed = innerTextHelper(node)
    .result.replaceAll(/^\s+/g, '')
    .replaceAll(/\s+$/g, '');
  recursed = '\n' + recursed + '\n';

  return returnWrapper(
    recursed,
    handleParentDiv.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    recursed
  );
};

const handleHasChildNodes: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const recursed = innerTextHelper(node).result;

  return returnWrapper(
    recursed,
    handleHasChildNodes.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    recursed
  );
};

const handleDoubleBr: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const text = `\n\n`;

  return returnWrapper(
    text,
    handleDoubleBr.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text
  );
};

const handleSingleBr: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const text = ' ';

  return returnWrapper(
    text,
    handleDoubleBr.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text
  );
};

const handleDefault: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const text = '';

  return returnWrapper(
    text,
    handleDefault.name,
    `${node.nodeName}.${(node as HTMLElement).classList}`,
    text
  );
};
