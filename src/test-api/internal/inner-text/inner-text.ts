import { Category, getLogger } from '../../../logger';
import { DebugTable } from './debug-table';
import { handleElement } from './node-handlers/handle-element';
import { handleText } from './node-handlers/handle-text';
import { TextAndLog } from './node-handlers/node-handler';

const testLogger = getLogger('DEBUG_INNER_TEXT');

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
  const { result, debugDataTable } = innerTextHelper(el);

  if (testLogger.isDebugEnabled()) {
    debugDataTable.print();
  }

  return result;
};

export const innerTextHelper = (
  el: Node
): { result: string; debugDataTable: DebugTable } => {
  const debugDataTable = new DebugTable();

  const result = [...el.childNodes]
    .map((node: Node, index: number, originalArray: Node[]): TextAndLog => {
      switch (getType(node)) {
        case 'TEXT_NODE':
          return handleText(node, index, originalArray);
        case 'ELEMENT_NODE':
          return handleElement(node, index, originalArray);
      }
    })
    .map((textAndLog: TextAndLog) => {
      debugDataTable.add(textAndLog.log);
      return textAndLog.text;
    })
    .join('');

  return { result: result.trim(), debugDataTable };
};

const getType = (node: Node): NodeType => {
  return nodeTypes[node.nodeType];
};
