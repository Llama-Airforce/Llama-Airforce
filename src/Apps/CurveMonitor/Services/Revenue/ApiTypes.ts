import { type Chain } from "@CM/Models/Chain";

export type GetCushionsResponse = {
  cushions: {
    pool: string;
    address: string;
    chain: Chain;
    coins: string[];
    coinNames: string[];
    balance: number[];
    value: number;
    totalUSD: number;
  }[];
};

export type GetBreakdownResponse = {
  revenue: {
    week: number;
    label: string;
    total_fees: number;
  }[];
};

export type GetByChainResponse = {
  revenue: {
    chain: string;
    totalDailyFeesUSD: number;
  }[];
};

export type GetTopPoolsResponse = {
  revenue: {
    name: string;
    totalDailyFeesUSD: number;
  }[];
};

export type GetDistributionsResponse = {
  distributions: {
    timestamp: string;
    fees_usd: number;
  }[];
};
