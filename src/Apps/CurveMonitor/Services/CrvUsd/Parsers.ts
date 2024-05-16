import type * as ApiTypes from "@CM/Services/CrvUsd/ApiTypes";
import type * as Models from "@CM/Services/CrvUsd/Models";

export const parseMarket = (
  x: ApiTypes.GetMarketsResponse["data"][number]
): Models.Market => {
  return {
    name: x.collateral_token.symbol,
    address: x.address.toLocaleLowerCase(),
    llamma: x.llamma.toLocaleLowerCase(),
    rate: x.rate,
    borrowed: x.total_debt,
    collateral: x.collateral_amount,
    collateralUsd: x.collateral_amount_usd,
    loans: x.n_loans,
  };
};

export const parseSnapshot = (
  x: ApiTypes.GetSnapshotsResponse["data"][number]
): Models.Snapshot => {
  return {
    timestamp: new Date(x.dt).getTime() / 1000,
    rate: x.rate,
    nLoans: x.n_loans,
  };
};

export const parseLlammaOHLC = (
  x: ApiTypes.GetLlammaOHLCResponse["data"][number]
): Models.LlammaOHLC => {
  return {
    time: x.time,
    open: x.open,
    close: x.close,
    high: x.high,
    low: x.low,
    base_price: x.base_price,
    oracle_price: x.oracle_price,
    volume: x.volume,
  };
};

export const parseKeeper = (
  x: ApiTypes.GetKeepersResponse["keepers"][number]
): Models.Keeper => {
  return {
    address: x.address.toLocaleLowerCase(),
    pool: x.pool,
    pool_address: x.pool_address.toLocaleLowerCase(),
    active: x.active,
    total_debt: x.total_debt,
    total_profit: x.total_profit,
    tvl: x.tvl,
    volume: x.volume,
  };
};
