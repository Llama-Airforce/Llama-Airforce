import type * as ApiTypes from "@CM/Services/Chains/ApiTypes";
import type * as Models from "@CM/Services/Chains/Models";

export const parseChainInfo = (
  x: ApiTypes.GetChainInfoResponse
): Models.ChainInfo => {
  return {
    chain: x.chain,
    total: {
      total_tvl: x.total.total_tvl,
      trading_volume_24h: x.total.trading_volume_24h,
    },
  };
};
