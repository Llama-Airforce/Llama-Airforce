import { type Address } from "viem";

export type SnapshotReward = {
  address: Address;
  rewardAmount: bigint;
  rewardIndex: number;
  isClaimed: boolean;
  epoch: number;
};

export type Claim = {
  epoch: number;
  rewardIndex: number;
};

export type Reward = {
  symbol: string;
  address: Address;
  amount: number;
  amountUsd: number;
  claims: Claim[];
};

export type Redemption = {
  lockIndex: number;
  unlockTime: number;
  cvxAvailable: number;
  fee: number;
};

export type RedemptionPending = {
  tokenId: bigint;
  balance: bigint;
};
