import { NodeHandler, TextAndLog } from './node-handler';

export const handleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const isPreviousElementInline: boolean =
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() === `span`;
  const isNextElementInline: boolean =
    index + 1 < originalArray.length &&
    originalArray[index + 1].nodeName.toLowerCase().trim() === `span`;

  let text = node.textContent.replaceAll(/\n/g, '').replaceAll(/ +/g, ' ');
  text = isPreviousElementInline ? text : text.trimStart();
  text = isNextElementInline ? text : text.trimEnd();

  return {
    text,
    log: {
      functionName: handleText.name,
      nodeInfo: node.nodeName,
      nodeText: text,
    },
  };
};
