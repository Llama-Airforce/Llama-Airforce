import type { Chain } from "..";

export type ChainInfo = {
  chain: string;
  total: {
    tvl: number;
    tradingVolume24h: number;
    tradingFee24h: number;
    liquidityVolume24h: number;
    liquidityFee24h: number;
  };
};

export const activityTypes = [
  "crvusd",
  "lending",
  "pools",
  "router",
  "dao",
] as const;
export type ActivityType = (typeof activityTypes)[number];

export type Activity = {
  timestamp: number;
  chain: Chain;
  type: ActivityType;
};

export type Transactions = Activity & {
  transactions: number;
};

export type Users = Activity & {
  users: number;
};
