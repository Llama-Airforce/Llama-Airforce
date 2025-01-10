import type { Address } from "@/Types/Address";

export type SnapshotReward = {
  address: Address;
  rewardAmount: bigint;
  rewardIndex: number;
  isClaimed: boolean;
  epoch: number;
};

export type FuturesReward = {
  address: Address;
  rewardAmount: bigint;
  epoch: number;
};

export type Claim = {
  epoch: number;
  rewardIndex: number;
};

export type Reward = {
  type: "snapshot" | "futures" | "combined";
  symbol: string;
  address: Address;
  amount: number;
  amountUsd: number;
};

export type RewardSnapshot = Reward & {
  type: "snapshot";
  claims: Claim[];
};

export type RewardFutures = Reward & {
  type: "futures";
  epochs: number[];
};

export type Redemption = {
  lockIndex: number;
  unlockTime: number;
  cvxAvailable: number;
  fee: number;
};

export type FuturePending = {
  tokenId: bigint;
  balance: bigint;
};

export type RedemptionPending = {
  tokenId: bigint;
  balance: bigint;
};

export function isSnapshotReward(reward: Reward): reward is RewardSnapshot {
  return reward.type === "snapshot";
}

export function isFuturesReward(reward: Reward): reward is RewardFutures {
  return reward.type === "futures";
}
