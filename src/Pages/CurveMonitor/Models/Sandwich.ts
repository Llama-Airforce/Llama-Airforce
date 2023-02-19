import type { Transaction } from "@/Pages/CurveMonitor/Models";

export type Sandwich = {
  blockNumber: number;
  timestamp: number;
  profit: number;
  profitUnit: string;
  loss: number;
  lossUnit: string;
  txs: Transaction[];
};
