import type { Address } from "@/types/address";
import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import type * as Models from "@LAF/Pages/Pirex/Services/Models";

export const parseSnapshotRewards = (
  x: ApiTypes.GetRewardsResponse["snapshotRewards"][number][number]
): Models.SnapshotReward => ({
  address: x.address.toLocaleLowerCase() as Address,
  rewardAmount: BigInt(x.rewardAmount),
  rewardIndex: x.rewardIndex,
  isClaimed: x.isClaimed,
  epoch: x.epoch,
});

export const parseFuturesRewards = (
  x: ApiTypes.GetRewardsResponse["futuresRewards"][number][number]
): Models.FuturesReward => ({
  address: x.address.toLocaleLowerCase() as Address,
  rewardAmount: BigInt(x.rewardAmount),
  epoch: x.epoch,
});

export const parseRedemption = (
  x: ApiTypes.GetRedemptionsResponse[number]
): Models.RedemptionPending => ({
  tokenId: BigInt(x.tokenId),
  balance: BigInt(
    // Can be with scientific notation.
    x.balance.includes(".") || x.balance.includes("e")
      ? parseFloat(x.balance)
      : x.balance
  ),
});

export const parseFuture = (
  x: ApiTypes.GetFuturesResponse[number]
): Models.FuturePending => ({
  tokenId: BigInt(x.tokenId),
  balance: BigInt(
    // Can be with scientific notation.
    x.balance.includes(".") || x.balance.includes("e")
      ? parseFloat(x.balance)
      : x.balance
  ),
});
