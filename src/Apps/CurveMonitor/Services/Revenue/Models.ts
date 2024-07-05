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

export type CowSwapSettlement = {
  timestamp: number;
  coin: {
    lpToken: boolean;
    symbol: string;
    address: Address;
    precision: number;
  };
  amount: bigint;
  amountFee: bigint;
  amountReceived: number;
  routerReceived: number;
  epoch: number;
  txHash: Address;
  blockNumber: number;
};
