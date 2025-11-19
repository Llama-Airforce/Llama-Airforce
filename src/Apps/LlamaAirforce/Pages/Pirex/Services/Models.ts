import type { Address } from "@/types/address";
import type { getPirexRewards } from "./PirexRewards";

type PirexReward = Awaited<ReturnType<typeof getPirexRewards>>;
export type SnapshotReward = PirexReward["snapshotRewards"][number];
export type FuturesReward = PirexReward["futuresRewards"][number];

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
