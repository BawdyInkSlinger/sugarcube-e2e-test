import { DebugRow } from "../debug-table";

export type TextAndLog = {
    text: string;
    log: DebugRow
}

export type NodeHandler = (
  node: Node,
  index: number,
  originalArray: Node[]
) => TextAndLog;
