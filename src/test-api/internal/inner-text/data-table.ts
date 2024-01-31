import { Table } from 'console-table-printer';

export type DataRow = {
  functionName: string;
  nodeInfo: string;
  nodeText: string;
  postProcess: string;
};

export class DataTable {
  debugDataTable: DataRow[] = [];

  get rows() {
    return this.debugDataTable;
  }

  add(debugRow: DataRow): void {
    if (debugRow.functionName === undefined) {
      throw new Error(`functionName was undefined`);
    }
    if (debugRow.nodeInfo === undefined) {
      throw new Error(`nodeInfo was undefined`);
    }
    if (debugRow.nodeText === undefined) {
      throw new Error(`nodeText was undefined`);
    }
    this.debugDataTable.push(debugRow);
  }

  print(): void {
    const minLen = 10;
    const maxLen = 100;
    const alignment = 'left';
    const table = new Table({
      columns: [
        { name: 'functionName', alignment },
        { name: 'nodeInfo', alignment },
        { name: 'nodeText', alignment, minLen, maxLen },
        { name: 'postProcess', alignment, minLen, maxLen },
      ],
    });
    table.addRows(
      this.debugDataTable.map((datum) => {
        return {
          ...datum,
          nodeText: JSON.stringify(datum.nodeText)
            .replaceAll(/ /g, '·')
            .replaceAll(/\n/g, '\\n'),
          postProcess: JSON.stringify(datum.postProcess).replaceAll(
            /\n/g,
            '\\n'
          ),
        };
      }),
      { color: 'green' }
    );

    table.printTable();
  }
}
