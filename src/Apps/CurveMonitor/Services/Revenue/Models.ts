import { type Chain } from "@CM/Models/Chain";

export type BreakdownRevenue = {
  week: number;
  label: string;
  total_fees: number;
};

export type ChainRevenue = {
  chain: string;
  totalDailyFeesUSD: number;
};

export type ChainTopPoolRevenue = {
  name: string;
  totalDailyFeesUSD: number;
};

export type Cushion = {
  pool: string;
  address: string;
  chain: Chain;
  coins: string[];
  coinNames: string[];
  balance: number[];
  value: number;
  totalUSD: number;
};

export type Distribution = {
  timestamp: number;
  feesUsd: number;
};
