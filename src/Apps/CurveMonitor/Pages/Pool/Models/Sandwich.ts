import type { Transaction } from "@CM/Pages/Pool/Models";

export type Sandwich = {
  blockNumber: number;
  timestamp: number;
  profit: number;
  profitUnit: string;
  loss: number;
  lossUnit: string;
  txs: Transaction[];
};
