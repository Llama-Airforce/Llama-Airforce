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
  symbol: string;
  address: Address;
  amount: number;
  amountUsd: number;
};

export type Staking = {
  symbol: string;
  address: Address;
  amount: number;
  amountUsd: number;
};
