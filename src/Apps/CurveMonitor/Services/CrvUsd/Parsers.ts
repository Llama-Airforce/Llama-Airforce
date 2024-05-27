import { toUTC } from "@CM/Services";
import type * as ApiTypes from "@CM/Services/CrvUsd/ApiTypes";
import type * as Models from "@CM/Services/CrvUsd/Models";

export const parseMarket = (
  x: ApiTypes.GetMarketsResponse["data"][number]
): Models.Market => {
  return {
    name: x.collateral_token.symbol,
    address: x.address.toLocaleLowerCase(),
    factory: x.factory_address.toLocaleLowerCase(),
    llamma: x.llamma.toLocaleLowerCase(),
    rate: x.rate,
    borrowed: x.total_debt,
    borrowable: x.borrowable,
    collateral: x.collateral_amount,
    collateralUsd: x.collateral_amount_usd,
    loans: x.n_loans,
    collateral_token: {
      symbol: x.collateral_token.symbol,
      address: x.collateral_token.address.toLocaleLowerCase(),
    },
    stablecoin_token: {
      symbol: x.stablecoin_token.symbol,
      address: x.stablecoin_token.address.toLocaleLowerCase(),
    },
  };
};

export const parseSnapshot = (
  x: ApiTypes.GetSnapshotsResponse["data"][number]
): Models.Snapshot => {
  return {
    timestamp: new Date(x.dt).getTime() / 1000,
    rate: x.rate,
    nLoans: x.n_loans,
    minted: x.minted,
    redeemed: x.redeemed,
    totalCollateral: x.total_collateral,
    totalCollateralUsd: x.total_collateral_usd,
    totalStablecoin: x.total_stablecoin,
    totalDebt: x.total_debt,
    priceAMM: x.amm_price,
    priceOracle: x.price_oracle,
    borrowable: x.borrowable,
  };
};

export const parseKeeper = (
  x: ApiTypes.GetKeepersResponse["keepers"][number]
): Models.Keeper => {
  return {
    address: x.address.toLocaleLowerCase(),
    pool: x.pool,
    pool_address: x.pool_address.toLocaleLowerCase(),
    pair: x.pair.map((p) => ({
      symbol: p.symbol,
      address: p.address.toLocaleLowerCase(),
    })),
    active: x.active,
    total_debt: x.total_debt,
    total_profit: x.total_profit,
    tvl: x.tvl,
    volume: x.volume,
  };
};

export const parseSupply = (
  x: ApiTypes.GetSupplyResponse["data"][number]
): Models.CrvUsdSupply => {
  return {
    timestamp: toUTC(x.timestamp),
    market: x.market,
    supply: x.supply,
    borrowable: x.borrowable,
  };
};
