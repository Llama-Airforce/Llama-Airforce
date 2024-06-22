import { type Address } from "viem";

type SnapshotReward = {
  address: Address;
  rewardAmount: string;
  rewardIndex: number;
  isClaimed: boolean;
  epoch: number;
};

export type GetRewardsResponse = {
  snapshotRewards: SnapshotReward[][];
};
