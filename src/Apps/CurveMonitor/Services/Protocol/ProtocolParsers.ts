import type * as ApiTypes from "@CM/Services/Protocol/ProtocolApiTypes";
import type * as Models from "@CM/Services/Protocol/ProtocolModels";

export const parseLiquidityTop = (
  x: ApiTypes.GetLiquidityTopResponse["liquidity_use"][number]
): Models.Liquidity => {
  return {
    pool: x.pool,
    chain: x.chain,
    name: x.name,
    liq_use: x.liq_use,
  };
};

export const parseTradesLarge = (
  x: ApiTypes.GetTradesLargeResponse["large_trades"][number]
): Models.Trade => {
  return {
    pool: x.pool,
    chain: x.chain,
    name: x.name,
    tx: x.tx,
    value: x.value,
  };
};

export const parseTvlGainer = (
  x: ApiTypes.GetTvlGainersResponse["tvl_gainers"][number]
): Models.TvlGrower => {
  return {
    pool: x.pool,
    chain: x.chain,
    name: x.name,
    tvl_growth: x.tvl_growth,
  };
};

export const parseTvlLoser = (
  x: ApiTypes.GetTvlLosersResponse["tvl_losers"][number]
): Models.TvlGrower => {
  return {
    pool: x.pool,
    chain: x.chain,
    name: x.name,
    tvl_growth: x.tvl_growth,
  };
};

export const parseTvlBreakdownType = (
  x: ApiTypes.GetTvlBreakdownTypeResponse["tvl_breakdown_type"][number]
): Models.TvlBreakdownType => {
  return {
    type: x.type,
    tvl: x.tvl,
  };
};

export const parseTvlBreakdownChain = (
  x: ApiTypes.GetTvlBreakdownChainResponse["tvl_breakdown_chain"][number]
): Models.TvlBreakdownChain => {
  return {
    chain: x.chain,
    tvl: x.tvl,
  };
};

export const parseVolumeBreakdownType = (
  x: ApiTypes.GetVolumeBreakdownTypeResponse["volume_breakdown_type"][number]
): Models.VolumeBreakdownType => {
  return {
    type: x.type,
    volumeUSD: x.volumeUSD,
  };
};

export const parseVolumeBreakdownChain = (
  x: ApiTypes.GetVolumeBreakdownChainResponse["volume_breakdown_chain"][number]
): Models.VolumeBreakdownChain => {
  return {
    chain: x.chain,
    volumeUSD: x.volumeUSD,
  };
};
