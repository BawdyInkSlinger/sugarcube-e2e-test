import { DEBUG_SUGARCUBE_PARSER_TESTS_KEY } from '../../test/init-logger';
import { Category, getLogger } from '../logger';

const testLogger = getLogger(DEBUG_SUGARCUBE_PARSER_TESTS_KEY as Category);

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

type DebugDatum = {
  functionName: string;
  nodeInfo: string;
  nodeText: string;
};
type DebugData = DebugDatum[];

export const innerText = (el: Node): string => {
  const { result, debugDataTable } = innerTextHelper(el);

  if (testLogger.isDebugEnabled()) {
    console.table(
      debugDataTable.map((datum) => {
        return {
          ...datum,
          nodeText: JSON.stringify(datum.nodeText).replaceAll(/ /g, '·'),
        };
      })
    );
  }

  return result;
};

const innerTextHelper = (
  el: Node
): { result: string; debugDataTable: DebugData } => {
  const debugDataTable: DebugData = [];

  const addToDebugDataTable = (
    functionName: string,
    nodeInfo: string,
    nodeText: string
  ): void => {
    debugDataTable.push({ functionName, nodeInfo, nodeText });
  };

  function handleText(node: Node): string {
    const text = node.textContent
      .replaceAll(/\n/g, '')
      .replaceAll(/ +/g, ' ')
      .trim();

    addToDebugDataTable(handleText.name, node.nodeName, text);

    return text;
  }

  function handleParentDiv(node: Node): string {
    let recursed = innerTextHelper(node)
      .result.replaceAll(/^\s+/g, '')
      .replaceAll(/\s+$/g, '');
    recursed = '\n' + recursed + '\n';

    addToDebugDataTable(
      handleParentDiv.name,
      `${node.nodeName}.${(node as HTMLElement).classList}`,
      recursed
    );

    return recursed;
  }

  function handleHasChildNodes(node: Node): string {
    const recursed = innerTextHelper(node).result;

    addToDebugDataTable(
      handleHasChildNodes.name,
      `${node.nodeName}.${(node as HTMLElement).classList}`,
      recursed
    );

    return recursed;
  }

  function handleDoubleBr(node: Node): string {
    const text = `\n\n`;

    addToDebugDataTable(
      handleDoubleBr.name,
      `${node.nodeName}.${(node as HTMLElement).classList}`,
      text
    );

    return text;
  }

  function handleSingleBr(node: Node): string {
    const text = ' ';

    addToDebugDataTable(
      handleDoubleBr.name,
      `${node.nodeName}.${(node as HTMLElement).classList}`,
      text
    );

    return text;
  }

  function handleDefault(node: Node): string {
    const text = '';

    addToDebugDataTable(
      handleDefault.name,
      `${node.nodeName}.${(node as HTMLElement).classList}`,
      text
    );

    return text;
  }

  const result = [...el.childNodes]
    .map((node, index, originalArray) => {
      switch (getType(node)) {
        case 'TEXT_NODE':
          return handleText(node);
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
    })
    .join('');

  return { result: result.trim(), debugDataTable };
};

const getType = (node: Node): NodeType => {
  return nodeTypes[node.nodeType];
};
