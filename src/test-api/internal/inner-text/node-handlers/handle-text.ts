import { NodeHandler, TextAndLog, returnWrapper } from './node-handler';

export const handleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  if (
    node.nodeName.toLowerCase().trim() === `#text` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() === `#text`
  ) {
    return handleDoubleText(node, index, originalArray);
  } else {
    return handleSingleText(node, index, originalArray);
  }
};

const handleSingleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const leaveSpaceAtStart: boolean =
    index - 1 >= 0 && isInlineElementName(originalArray[index - 1].nodeName);
  const leaveSpaceAtEnd: boolean =
    index + 1 < originalArray.length &&
    isInlineElementName(originalArray[index + 1].nodeName);

  let text = node.textContent
    .replaceAll(/\r/g, '')
    .replaceAll(/\n/g, '')
    .replaceAll(/ +/g, ' ');
  text = leaveSpaceAtStart ? text : text.trimStart();
  text = leaveSpaceAtEnd ? text : text.trimEnd();

  return returnWrapper(text, handleText.name, node.nodeName, node.textContent);
};

const handleDoubleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const previousNode = originalArray[index - 1];
  const previousNodeTextContent = previousNode.textContent;
  const currentNodeTextContent = node.textContent;

  const result = handleSingleText(node, index, originalArray);
  if (
    previousNodeTextContent.trimEnd().length < previousNodeTextContent.length ||
    currentNodeTextContent.trimStart().length < currentNodeTextContent.length
  ) {
    const text = ' ' + result.text.trimStart();
    return returnWrapper(text, handleDoubleText.name, node.nodeName, text);
  }

  return result;
};

const isInlineElementName = (elementName: string): boolean => {
  return [
    `a`,
    `abbr`,
    `acronym`,
    `b`,
    `bdo`,
    `big`,
    // `br`, technically true (?), but it causes parser problems
    `cite`,
    `code`,
    `dfn`,
    `em`,
    `i`,
    `img`,
    `input`,
    `kbd`,
    `label`,
    `mark`,
    `q`,
    `s`,
    `samp`,
    `small`,
    `span`,
    `strong`,
    `sub`,
    `sup`,
    `time`,
    `u`,
    `var`,
  ].some((inlineElementName: string) => {
    return inlineElementName === elementName.toLowerCase().trim();
  });
};
