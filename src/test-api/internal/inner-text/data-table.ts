export type DataRow = {
  functionName: string;
  nodeInfo: string;
  nodeText: string;
};

export class DataTable {
  debugDataTable: DataRow[] = [];

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
    console.table(
      this.debugDataTable.map((datum) => {
        return {
          ...datum,
          nodeText: JSON.stringify(datum.nodeText).replaceAll(/ /g, '·'),
        };
      })
    );
  }
}
