import type * as ApiTypes from "@CM/Services/Chains/ApiTypes";
import type * as Models from "@CM/Services/Chains/Models";

export const parseChainInfo = (
  x: ApiTypes.GetChainInfoResponse
): Models.ChainInfo => {
  return {
    chain: x.chain,
    total: {
      tvl: x.total.total_tvl,
      tradingVolume24h: x.total.trading_volume_24h,
      tradingFee24h: x.total.trading_volume_24h,
      liquidityVolume24h: x.total.liquidity_volume_24h,
      liquidityFee24h: x.total.liquidity_fee_24h,
    },
  };
};
