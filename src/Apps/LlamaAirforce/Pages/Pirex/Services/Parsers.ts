import { type Address } from "viem";
import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import type * as Models from "@LAF/Pages/Pirex/Services/Models";

export const parseRewards = (
  x: ApiTypes.GetRewardsResponse["snapshotRewards"][number][number]
): Models.SnapshotReward => {
  return {
    address: x.address.toLocaleLowerCase() as Address,
    rewardAmount: BigInt(x.rewardAmount),
    rewardIndex: x.rewardIndex,
    isClaimed: x.isClaimed,
    epoch: x.epoch,
  };
};

export const parseRedemption = (
  x: ApiTypes.GetRedemptionsResponse[number]
): Models.RedemptionPending => {
  return {
    tokenId: BigInt(x.tokenId),
    balance: BigInt(x.balance),
  };
};
