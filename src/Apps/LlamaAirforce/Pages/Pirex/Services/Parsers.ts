import type * as ApiTypes from "@LAF/Pages/Pirex/Services/ApiTypes";
import type * as Models from "@LAF/Pages/Pirex/Services/Models";

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
