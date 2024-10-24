export type VotesOverview = {
  proposals: number;
  votesProposals: number;
  votesGauges: number;
  votersUnique: number;
  epoch: number;
};

export type LocksDaily = {
  day: number;
  amount: bigint;
};

export type UserLock = {
  timestamp: number;
  amount: bigint;
  unlockTime: number;
  lockType: "CREATE_LOCK" | "INCREASE_LOCK_AMOUNT" | "INCREASE_UNLOCK_TIME";
  lockedBalance: bigint;
  txHash: string;
};

export type Supply = {
  timestamp: number;
  veCrvTotal: bigint;
  crvEscrowed: bigint;
  crvSupply: bigint;
  circulatingSupply: bigint;
  lockedSupplyDetails: {
    address: string;
    label: string;
    locked: bigint;
  }[];
  blockNumber: number;
  txHash: string;
};

export type Locker = {
  user: string;
  locked: bigint;
  weight: bigint;
  weightRatio: number;
  unlockTime: number;
};
