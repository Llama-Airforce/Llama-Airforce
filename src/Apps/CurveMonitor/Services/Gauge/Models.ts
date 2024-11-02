import type { Chain } from "@/Framework/Chain";

export type Gauge = {
  address: string;
  type: string;
  name?: string;
  version?: string;
  lpToken?: string;
  pool?: {
    address: string;
    name: string;
    chain: Chain;
    tvlUsd: number;
    tradingVolume24h: number;
  };
  tokens: {
    symbol: string;
    address: string;
    precision: number;
  }[];
  market?: {
    name: string;
    chain: Chain;
  };
  killed: boolean;
  emissions: number;
  weight: bigint;
  weightDelta7d?: number;
  weightDelta60d?: number;
  weightRelative: number;
  weightRelativeDelta7d?: number;
  weightRelativeDelta60d?: number;
  creationTx: string;
  creationDate: number;
  lastVoteTx?: string;
  lastVoteDate?: number;
};

export type GaugeVote = {
  user: string;
  weight: number;
  blockNumber: number;
  timestamp: number;
  tx: string;
};

export type WeightHistory = {
  killed: boolean;
  weight: number;
  weightRelative: number;
  emissions: number;
  epoch: number;
};

export type Deployment = {
  addressFrom: string;
  addressTo?: string;
  calldata: string;
  calldataDecoded?: string;
  blockNumber: number;
  timestamp: number;
};

export type UserGaugeVote = {
  timestamp: number;
  gauge: string;
  gaugeName: string;
  weight: number;
  blockNumber: number;
  txHash: string;
};
