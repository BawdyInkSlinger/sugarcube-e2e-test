type DebugRow = {
  functionName: string;
  nodeInfo: string;
  nodeText: string;
};

export class DebugTable {
  debugDataTable: DebugRow[] = [];

  add(debugRow: DebugRow): void {
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
