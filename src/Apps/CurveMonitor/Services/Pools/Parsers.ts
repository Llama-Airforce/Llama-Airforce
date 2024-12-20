import type { Address } from "@/Types/Address";
import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parsePoolTotals = (
  x: ApiTypes.GetPoolsResponse["total"]
): Models.PoolsTotals => {
  return {
    tvl: x.total_tvl,
    tradingVolume24h: x.trading_volume_24h,
    tradingFee24h: x.trading_fee_24h,
    liquidityVolume24h: x.liquidity_volume_24h,
    liquidityFee24h: x.liquidity_fee_24h,
  };
};

export const parsePool = (
  x: ApiTypes.GetPoolsResponse["data"][number]
): Models.Pool => {
  return {
    name: x.name,
    address: x.address.toLocaleLowerCase() as Address,
    numCoins: x.n_coins,
    tvlUsd: x.tvl_usd,
    tradingVolume24h: x.trading_volume_24h,
    tradingFee24h: x.trading_fee_24h,
    liquidityVolume24h: x.liquidity_volume_24h,
    liquidityFee24h: x.liquidity_fee_24h,
    coins:
      x.coins?.map((coin) => ({
        poolIndex: coin.pool_index,
        symbol: coin.symbol,
        address: coin.address.toLocaleLowerCase(),
      })) ?? [],
    baseDailyApr: x.base_daily_apr,
    baseWeeklyApr: x.base_weekly_apr,
    virtualPrice: x.virtual_price,
    poolMethods: x.pool_methods?.map((x) => x) ?? [],
  };
};

export const parseVolume = (
  x: ApiTypes.GetVolumeResponse["data"][number]
): Models.Volume => {
  return {
    timestamp: x.timestamp,
    volume: x.volume,
    fees: x.fees,
  };
};

export const parseTvl = (
  x: ApiTypes.GetTvlResponse["data"][number]
): Models.Tvl => {
  return {
    timestamp: x.timestamp,
    tvlUSD: x.tvl_usd ?? 0,
    balances: [...x.balances],
    tokenPrices: [...x.token_prices],
  };
};
