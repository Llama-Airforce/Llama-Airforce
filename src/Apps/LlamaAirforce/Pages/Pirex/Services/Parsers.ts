import type { Address } from "@/Framework/Address";
import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import type * as Models from "@LAF/Pages/Pirex/Services/Models";

export const parseSnapshotRewards = (
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

export const parseFuturesRewards = (
  x: ApiTypes.GetRewardsResponse["futuresRewards"][number][number]
): Models.FuturesReward => {
  return {
    address: x.address.toLocaleLowerCase() as Address,
    rewardAmount: BigInt(x.rewardAmount),
    epoch: x.epoch,
  };
};

export const parseRedemption = (
  x: ApiTypes.GetRedemptionsResponse[number]
): Models.RedemptionPending => {
  return {
    tokenId: BigInt(x.tokenId),
    balance: BigInt(parseFloat(x.balance)), // Can be with scientific notation.
  };
};
