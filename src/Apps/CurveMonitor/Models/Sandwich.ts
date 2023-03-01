import type { Transaction } from "@CM/Models";

export type Sandwich = {
  blockNumber: number;
  timestamp: number;
  profit: number;
  profitUnit: string;
  loss: number;
  lossUnit: string;
  txs: Transaction[];
};
