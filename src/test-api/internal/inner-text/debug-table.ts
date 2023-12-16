type DebugRow = {
  functionName: string;
  nodeInfo: string;
  nodeText: string;
};

export class DebugTable {
  debugDataTable: DebugRow[] = [];

  add(functionName: string, nodeInfo: string, nodeText: string): void {
    this.debugDataTable.push({ functionName, nodeInfo, nodeText });
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
