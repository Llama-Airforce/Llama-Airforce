import { type Address } from "viem";

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
  pool: Address;
  name: string;
  adminFees: number[];
  usdValue: number;
};

export type Distribution = {
  timestamp: number;
  feesUsd: number;
};
