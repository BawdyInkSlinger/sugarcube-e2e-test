import { ParentDepth } from '../inner-text';
import { NodeHandler, TextAndLog, returnWrapper } from './node-handler';

export const handleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  parentDepth: ParentDepth
): TextAndLog => {
  if (
    node.nodeName.toLowerCase().trim() === `#text` &&
    index - 1 >= 0 &&
    originalArray[index - 1].nodeName.toLowerCase().trim() === `#text`
  ) {
    return handleDoubleText(node, index, originalArray, parentDepth);
  } else {
    return handleSingleText(node, index, originalArray, parentDepth);
  }
};

const handleSingleText: AddParameters<NodeHandler, [functionName?: string]> = (
  node: Node,
  index: number,
  originalArray: Node[],
  parentDepth: ParentDepth,
  functionName = handleSingleText.name
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

  return returnWrapper(
    text,
    functionName,
    node.nodeName,
    node.textContent,
    parentDepth
  );
};

const handleDoubleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[],
  parentDepth: ParentDepth
): TextAndLog => {
  const previousNode = originalArray[index - 1];
  const previousNodeTextContent = previousNode.textContent;
  const currentNodeTextContent = node.textContent;

  const result = handleSingleText(
    node,
    index,
    originalArray,
    parentDepth,
    handleDoubleText.name
  );

  const previousEndsWithSpace = isSpaceAfter(previousNodeTextContent);
  const currentBeginsWithSpace = isSpaceBefore(currentNodeTextContent);
  if (result.text !== '' && (previousEndsWithSpace || currentBeginsWithSpace)) {
    const text = ' ' + result.text.trimStart();
    return returnWrapper(
      text,
      handleDoubleText.name,
      node.nodeName,
      text,
      parentDepth
    );
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

function isSpaceBefore(text: string): boolean {
  return text.trimStart().length < text.length;
}

function isSpaceAfter(text: string): boolean {
  return text.trimEnd().length < text.length;
}

type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any],
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;
