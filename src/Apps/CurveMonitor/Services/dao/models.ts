import type { Address } from "..";

export type VotesOverview = {
  proposals: number;
  votesProposals: number;
  votesGauges: number;
  votersUnique: number;
  epoch: number;
};

export type LocksDaily = {
  day: Date;
  amount: bigint;
};

export type UserLock = {
  timestamp: Date;
  amount: bigint;
  unlockTime: Date;
  lockType: "CREATE_LOCK" | "INCREASE_LOCK_AMOUNT" | "INCREASE_UNLOCK_TIME";
  lockedBalance: bigint;
  txHash: string;
};

export type Supply = {
  timestamp: Date;
  veCrvTotal: bigint;
  crvEscrowed: bigint;
  crvSupply: bigint;
  circulatingSupply: bigint;
  lockedSupplyDetails: {
    address: Address;
    label: string;
    locked: bigint;
  }[];
  blockNumber: number;
  txHash: Address;
};

export type Locker = {
  user: Address;
  locked: bigint;
  weight: bigint;
  weightRatio: number;
  unlockTime: Date;
};
