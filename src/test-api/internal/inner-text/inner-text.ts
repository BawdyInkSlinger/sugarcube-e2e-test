import { Category, getLogger } from '../../../logger';
import { DataTable } from './data-table';
import { handleElement } from './node-handlers/handle-element';
import { handleText } from './node-handlers/handle-text';
import { TextAndLog } from './node-handlers/node-handler';

const innerTextLogger = getLogger('DEBUG_INNER_TEXT');
const recursiveLogger = getLogger('DEBUG_INNER_TEXT_TABLE_RECURSIVE');

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
  if (innerTextLogger.isDebugEnabled()) {
    innerTextLogger.debug((el as HTMLElement).outerHTML);
  }

  const { result, debugDataTable } = innerTextHelper(el, 0);

  if (innerTextLogger.isDebugEnabled()) {
    debugDataTable.print();
  }

  return result;
};

export const innerTextHelper = (
  el: Node,
  parentDepth: number
): { result: string; debugDataTable: DataTable } => {
  const debugDataTable = new DataTable();

  const result = [...el.childNodes]
    .map((node: Node, index: number, originalArray: Node[]): TextAndLog => {
      switch (getType(node)) {
        case 'TEXT_NODE':
          return handleText(node, index, originalArray, parentDepth);
        case 'ELEMENT_NODE':
          return handleElement(node, index, originalArray, parentDepth);
      }
    })
    .map((textAndLog: TextAndLog) => {
      debugDataTable.add(textAndLog.log);
      if (recursiveLogger.isDebugEnabled()) {
        textAndLog.children.forEach((childRow) => {
          debugDataTable.add(childRow);
        });
      }
      return textAndLog.text;
    })
    .join('');

  return { result: result.trim(), debugDataTable };
};

const getType = (node: Node): NodeType => {
  return nodeTypes[node.nodeType];
};
