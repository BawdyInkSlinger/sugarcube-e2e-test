import { DebugTable } from './debug-table';
import { handleText } from './node-handlers/handle-text';
import { TextAndLog } from './node-handlers/node-handler';

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

export const innerTextHelper = (
  el: Node
): { result: string; debugDataTable: DebugTable } => {
  const debugDataTable = new DebugTable();

  function handleParentDiv(node: Node): string {
    let recursed = innerTextHelper(node)
      .result.replaceAll(/^\s+/g, '')
      .replaceAll(/\s+$/g, '');
    recursed = '\n' + recursed + '\n';

    debugDataTable.add({
      functionName: handleParentDiv.name,
      nodeInfo: `${node.nodeName}.${(node as HTMLElement).classList}`,
      nodeText: recursed,
    });

    return recursed;
  }

  function handleHasChildNodes(node: Node): string {
    const recursed = innerTextHelper(node).result;

    debugDataTable.add({
      functionName: handleHasChildNodes.name,
      nodeInfo: `${node.nodeName}.${(node as HTMLElement).classList}`,
      nodeText: recursed,
    });

    return recursed;
  }

  function handleDoubleBr(node: Node): string {
    const text = `\n\n`;

    debugDataTable.add({
      functionName: handleDoubleBr.name,
      nodeInfo: `${node.nodeName}.${(node as HTMLElement).classList}`,
      nodeText: text,
    });

    return text;
  }

  function handleSingleBr(node: Node): string {
    const text = ' ';

    debugDataTable.add({
      functionName: handleDoubleBr.name,
      nodeInfo: `${node.nodeName}.${(node as HTMLElement).classList}`,
      nodeText: text,
    });

    return text;
  }

  function handleDefault(node: Node): string {
    const text = '';

    debugDataTable.add({
      functionName: handleDefault.name,
      nodeInfo: `${node.nodeName}.${(node as HTMLElement).classList}`,
      nodeText: text,
    });

    return text;
  }

  const result = [...el.childNodes]
    .map(
      (
        node: Node,
        index: number,
        originalArray: Node[]
      ):
        | TextAndLog
        // todo: delete
        | string => {
        switch (getType(node)) {
          case 'TEXT_NODE':
            return handleText(node, index, originalArray);
          case 'ELEMENT_NODE':
            if (
              node.hasChildNodes() &&
              node.nodeName.toLowerCase().trim() === `div`
            ) {
              return handleParentDiv(node);
            } else if (node.hasChildNodes()) {
              return handleHasChildNodes(node);
            } else if (
              node.nodeName.toLowerCase().trim() === `br` &&
              index - 1 >= 0 &&
              originalArray[index - 1].nodeName.toLowerCase().trim() === `br`
            ) {
              return handleDoubleBr(node);
            } else if (
              node.nodeName.toLowerCase().trim() === `br` &&
              index - 1 >= 0 &&
              originalArray[index - 1].nodeName.toLowerCase().trim() !== `br` &&
              index + 1 < originalArray.length &&
              originalArray[index + 1].nodeName.toLowerCase().trim() !== `br`
            ) {
              return handleSingleBr(node);
            } else {
              return handleDefault(node);
            }
        }
      }
    )
    .map((textAndLog: TextAndLog) => {
      //todo: remove
      if (typeof textAndLog === 'string') {
        return textAndLog;
      }

      debugDataTable.add(textAndLog.log);
      return textAndLog.text;
    })
    .join('');

  return { result: result.trim(), debugDataTable };
};

const getType = (node: Node): NodeType => {
  return nodeTypes[node.nodeType];
};
