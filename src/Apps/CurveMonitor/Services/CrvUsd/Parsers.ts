import { toUTC } from "@CM/Services";
import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

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
    fees: {
      pending: x.pending_fees,
      collected: x.collected_fees,
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
    discountLiquidation: x.liquidation_discount,
    discountLoan: x.loan_discount,
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

export const parseUserMarkets = (
  x: ApiTypes.GetUserMarketsResponse
): Models.UserMarkets => {
  return x.markets.map((market) => ({
    collateral: market.collateral,
    controller: market.controller,
    snapshotFirst: toUTC(market.first_snapshot),
    snapshotLast: toUTC(market.last_snapshot),
  }));
};

export const parseUserMarketStats = (
  x: ApiTypes.GetUserMarketStatsResponse
) => {
  return {
    health: x.health,
    healthFull: x.health_full,
    n: x.n,
    n1: x.n1,
    n2: x.n2,
    debt: x.debt,
    collateral: x.collateral,
    collateralUp: x.collateral_up,
    stablecoin: x.stablecoin,
    softLiquidation: x.soft_liquidation,
    totalDeposited: x.total_deposited,
    loss: x.loss,
    lossPct: x.loss_pct,
    oraclePrice: x.oracle_price,
    blockNumber: x.block_number,
    timestamp: toUTC(x.timestamp),
  };
};

export const parseUserMarketSnapshots = (
  x: ApiTypes.GetUserMarketSnapshotsResponse
): Models.UserMarketSnapshots => {
  return x.data.map(parseUserMarketStats);
};

export const parseUserCollateralEvents = (
  x: ApiTypes.GetUserCollateralEventsResponse
): Models.UserCollateralEvents => {
  return {
    controller: x.controller.toLocaleLowerCase(),
    user: x.user.toLocaleLowerCase(),
    totalDeposit: x.total_deposit,
    totalDepositPrecise: x.total_deposit_precise,
    totalDepositUsd: x.total_deposit_usd_value,
    totalBorrowed: x.total_borrowed,
    totalBorrowedPrecise: x.total_borrowed_precise,
    events: x.data.map((y) => ({
      timestamp: toUTC(y.dt),
      txHash: y.transaction_hash,
      type: y.type,
      user: y.user.toLocaleLowerCase(),
      collateralChange: y.collateral_change,
      collateralChangeUsd: y.collateral_change_usd ?? undefined,
      loanChange: y.loan_change,
      loanChangeUsd: y.loan_change_usd ?? undefined,
      liquidation:
        y.liquidation === null
          ? undefined
          : {
              user: y.liquidation.user.toLocaleLowerCase(),
              liquidator: y.liquidation.liquidator.toLocaleLowerCase(),
              collateralReceived: y.liquidation.collateral_received,
              collateralReceivedUsd: y.liquidation.collateral_received_usd,
              stablecoinReceived: y.liquidation.stablecoin_received,
              debt: y.liquidation.debt,
            },
      n1: y.n1,
      n2: y.n2,
      oraclePrice: y.oracle_price,
    })),
  };
};
