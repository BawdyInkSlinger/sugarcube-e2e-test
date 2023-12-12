import { Category, getLogger } from "../logger";

// const logger = getLogger(`DEBUG_SUGARCUBE_PARSER_TESTS` as Category);

const nodeTypes = {
  1: 'ELEMENT_NODE',
  2: 'ATTRIBUTE_NODE',
  3: 'TEXT_NODE',
  4: 'CDATA_SECTION_NODE',
  7: 'PROCESSING_INSTRUCTION_NODE',
  8: 'COMMENT_NODE',
  9: 'DOCUMENT_NODE',
  10: 'DOCUMENT_TYPE_NODE',
  11: 'DOCUMENT_FRAGMENT_NODE',
} as const;

type NodeType = (typeof nodeTypes)[keyof typeof nodeTypes];

export const innerText = (el: Node): string => {
  return [...el.childNodes]
    .map((node, index, originalArray) => {
      switch (getType(node)) {
        case 'TEXT_NODE':
          return node.textContent
            .trim()
            .replaceAll(/\r/g, ' ')
            .replaceAll(/\n/g, ' ')
            .replaceAll(/ +/g, ' ');
        case 'ELEMENT_NODE':
          if (
            node.hasChildNodes() &&
            node.nodeName.toLowerCase().trim() === `div`
          ) {
            const recursed = innerText(node)
              .replaceAll(/^\s+/g, '')
              .replaceAll(/\s+$/g, '');
            return '\n' + recursed + '\n';
          } else if (node.hasChildNodes()) {
            console.log(
              `added 0 newlines to ${node.nodeName}.${
                (node as HTMLElement).classList
              }`
            );
            return innerText(node);
          } else if (
            index - 1 >= 0 &&
            originalArray[index - 1].nodeName.toLowerCase().trim() === `br`
          ) {
            console.log(
              `added two newlines before ${originalArray[index + 1].nodeName}.${
                (originalArray[index + 1] as HTMLElement).classList
              }`
            );
            return '\n\n';
          } else {
            return '';
          }
      }
    })
    .join('');
};

const getType = (node: Node): NodeType => {
  return nodeTypes[node.nodeType];
};
