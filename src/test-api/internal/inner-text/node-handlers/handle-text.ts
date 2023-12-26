import { NodeHandler, TextAndLog, returnWrapper } from './node-handler';

export const handleText: NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
): TextAndLog => {
  const isPreviousElementInline: boolean =
    index - 1 >= 0 && isInlineElementName(originalArray[index - 1].nodeName);
  const isNextElementInline: boolean =
    index + 1 < originalArray.length &&
    isInlineElementName(originalArray[index + 1].nodeName);

  let text = node.textContent
    .replaceAll(/\r/g, '')
    .replaceAll(/\n/g, '')
    .replaceAll(/ +/g, ' ');
  text = isPreviousElementInline ? text : text.trimStart();
  text = isNextElementInline ? text : text.trimEnd();

  return returnWrapper(text, handleText.name, node.nodeName, text);
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
